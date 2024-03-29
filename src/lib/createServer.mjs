import http2 from 'node:http2'
import path from 'path'

import log from '../log.mjs'
import * as middleware from '../../middleware.mjs'

import { createSecureContext } from './createSecureContext.mjs'
import { denyRequest } from './denyRequest.mjs'

// const { HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS, HTTP2_HEADER_CONTENT_TYPE } =
//   http2.constants

export const createServer = async (config, handler) => {
  const defaultCertDir = path.join('node_modules', '@grundstein', 'commons', 'src', 'certificates')

  const {
    certDir = defaultCertDir,
    host = 'localhost',
    port = '2350',
    startTime = log.hrtime(),
  } = config

  const options = {}

  try {
    let absDir = certDir
    if (!path.isAbsolute(absDir)) {
      absDir = path.join(process.cwd(), absDir)
    }
    const secureContext = await createSecureContext({ certDir, host })

    options.SNICallback = (domain, cb) => {
      const apex = domain.split('.').slice(-2).join('.')
      cb(null, secureContext[apex])
    }
  } catch (e) {
    log.error('E_CERT_DIR', 'certDir could not be loaded.')
    throw e
  }

  const wrappedHandler = (stream, headers, flags) => {
    if (denyRequest(stream, headers, flags)) {
      return
    }

    return handler(stream, headers, flags)
  }

  const server = http2.createSecureServer(options)

  server.on('stream', wrappedHandler)

  const listener = middleware.listener({ host, port, startTime })
  server.listen(port, host, listener)
  return server
}

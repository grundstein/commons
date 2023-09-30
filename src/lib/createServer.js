import http2 from 'node:http2'
import path from 'path'

import log from '../log.js'
import * as middleware from '../../middleware.js'

import { createSecureContext } from './createSecureContext.js'
import { denyRequest } from './denyRequest.js'

export const createServer = async (config, handler) => {
  const defaultCertDir = path.join(
    process.cwd(),
    'node_modules',
    '@grundstein',
    'commons',
    'src',
    'certificates',
  )

  const {
    certDir = defaultCertDir,
    host = 'localhost',
    port = '2350',
    startTime = log.hrtime(),
    keyFileName = 'privkey.pem',
    chainFileName = 'fullchain.pem',
  } = config

  const options = {}

  try {
    const secureContext = await createSecureContext({ certDir, host, keyFileName, chainFileName })

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
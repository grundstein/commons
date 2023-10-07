import http2 from 'node:http2'
import path from 'node:path'

import log from '../log.js'
import * as middleware from '../../middleware.js'

import { createSecureContext } from './createSecureContext.js'
import { wrapHandler } from './wrapHandler.js'

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

  const wrappedHandler = await wrapHandler({ flags, handler, headers, stream })

  const server = http2.createSecureServer(options)

  /*
   * only register wrappedHandler if the handler function got passed.
   * osc and websocket servers might not want to answer via http.
   */
  if (wrappedHandler) {
    server.on('stream', wrappedHandler)
  }

  const listener = middleware.listener({ host, port, startTime })
  server.listen(port, host, listener)

  return server
}

import http2 from 'node:http2'
import path from 'node:path'

import log from '../log.js'
import * as middleware from '../middleware.js'

import { createSecureContext } from './createSecureContext.js'
import { wrapHandler } from './wrapHandler.js'

/**
 * @typedef {Object} ServerConfig
 * @property {string} [certDir] - Path to certificate directory.
 * @property {string} [host='localhost'] - Host to bind server to.
 * @property {number} [port=2350] - Port to listen on.
 * @property {ReturnType<typeof process.hrtime>} [startTime] - High-resolution start time.
 * @property {string} [keyFileName='privkey.pem'] - Private key file name.
 * @property {string} [chainFileName='fullchain.pem'] - Certificate chain file name.
 */

/**
 * @typedef {(stream: http2.ServerHttp2Stream, headers: http2.IncomingHttpHeaders, flags?: number) => void} HandlerFunction
 */

/**
 * Creates an HTTP/2 secure server.
 *
 * @param {ServerConfig} config - Configuration object.
 * @param {HandlerFunction} [handler] - Optional request/stream handler.
 * @returns {Promise<http2.Http2SecureServer>} The created HTTP/2 server.
 */
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
    port = 2350,
    startTime = log.hrtime(),
    keyFileName = 'privkey.pem',
    chainFileName = 'fullchain.pem',
  } = config

  /** @type {http2.SecureServerOptions} */
  const options = {}

  try {
    /** @type {Record<string, import('node:tls').SecureContext>} */
    const secureContext = await createSecureContext({ certDir, host, keyFileName, chainFileName })

    /**
     * @param {string} domain
     * @param {(err: Error | null, ctx?: import('node:tls').SecureContext) => void} cb
     */
    options.SNICallback = (domain, cb) => {
      const apex = domain.split('.').slice(-2).join('.')
      cb(null, secureContext[apex])
    }
  } catch (e) {
    log.error('E_CERT_DIR', 'certDir could not be loaded.')
    throw e
  }

  const server = http2.createSecureServer(options)

  /*
   * only register wrappedHandler if the handler function got passed.
   * osc and websocket servers might not want to answer via http.
   */
  if (handler) {
    /**
     * @param {http2.ServerHttp2Stream} stream
     * @param {http2.IncomingHttpHeaders} headers
     * @param {number} flags
     */
    const handleStream = (stream, headers, flags) =>
      wrapHandler({ handler, stream, headers, flags })

    server.on('stream', handleStream)
  }

  const listener = middleware.listener({ host, port, startTime })
  server.listen(port, host, listener)

  return server
}

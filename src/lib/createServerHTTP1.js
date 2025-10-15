import http from 'node:http'
import https from 'node:https'
import tls from 'node:tls'

import fs from '@magic/fs'
import log from '../log.js'
import * as middleware from '../../middleware.js'

import { createSecureContext } from './createSecureContext.js'
import { denyRequest } from './denyRequest.js'

/**
 * @typedef {Object} ServerConfig
 * @property {string} [certDir] - Directory containing SSL certificates.
 * @property {string} [host='localhost'] - Host to bind the server to.
 * @property {number} [port=2350] - Port number or string.
 * @property {ReturnType<typeof process.hrtime>} [startTime] - High-resolution time tuple from process.hrtime().
 */

/**
 * @typedef {(req: http.IncomingMessage, res: http.ServerResponse) => void} RequestHandler
 */

/**
 * Creates an HTTP or HTTPS server based on whether certificates are available.
 *
 * @param {ServerConfig} config - Server configuration object.
 * @param {RequestHandler} handler - The request handler.
 * @returns {Promise<http.Server | https.Server>} The created server.
 */
export const createServerHTTP1 = async (config, handler) => {
  const {
    certDir,
    host = 'localhost',
    port = 2350,
    startTime = log.hrtime?.() ?? process.hrtime(),
  } = config

  /** @type {Record<string, tls.SecureContext>} */
  let secureContext = {}

  /** @type {boolean} */
  let useHttps = false

  if (certDir) {
    try {
      const certDirExists = await fs.exists(certDir)

      if (certDirExists) {
        secureContext = await createSecureContext({ certDir, host })
        useHttps = true
      }
    } catch (e) {
      const err = /** @type {any} */ (e)
      if (err.code === 'ENOENT') {
        log.server.error(err)
      } else {
        throw e
      }
    }
  }

  /** @type {http.RequestListener} */
  const wrappedHandler = (req, res) => {
    if (denyRequest(req)) return
    handler(req, res)
  }

  let server
  if (useHttps) {
    /** @type {https.ServerOptions} */
    const options = {
      SNICallback: (servername, cb) => {
        const apex = servername.split('.').slice(-2).join('.')
        cb(null, secureContext[apex])
      },
    }
    server = https.createServer(options, wrappedHandler)
  } else {
    server = http.createServer(wrappedHandler)
  }

  const clientError = middleware.clientError()
  server.on('clientError', clientError)

  const listener = middleware.listener({ host, port, startTime })
  server.listen(port, host, listener)

  return server
}

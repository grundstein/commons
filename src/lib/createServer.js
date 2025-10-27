import http from 'node:http'
import https from 'node:https'

import fs from '@magic/fs'

import log from '../log.js'
import * as middleware from '../middleware/index.js'

import { createSecureContext } from './createSecureContext.js'
import { denyRequest } from './denyRequest.js'

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 * @typedef {import('http').Server} Server
 * @typedef {import('https').Server} HttpsServer
 * @typedef {import('tls').SecureContext} SecureContext
 */

/**
 * @typedef {Object} ServerConfig
 * @property {string} [certDir] - Certificate directory path
 * @property {string} [host='localhost'] - Server host
 * @property {number} [port=2350] - Server port
 * @property {[number, number]} [startTime] - Server start time
 */

/**
 * @callback RequestHandler
 * @param {IncomingMessage} req - HTTP request object
 * @param {ServerResponse} res - HTTP response object
 * @returns {void}
 */

/**
 * Creates an HTTP or HTTPS server
 * @param {ServerConfig} config - Server configuration
 * @param {RequestHandler} handler - Request handler function
 * @returns {Promise<Server|HttpsServer>} Created server instance
 */
export const createServer = async (config, handler) => {
  const { certDir, host = 'localhost', port = 2350, startTime = log.hrtime() } = config

  /** @type {https.ServerOptions} */
  const options = {}

  /** @type {typeof http | typeof https} */
  let connector = http

  if (certDir) {
    try {
      const certDirExists = await fs.exists(certDir)

      if (certDirExists) {
        const secureContext = await createSecureContext(certDir)

        /**
         * @param {string} domain
         * @param {(err: Error | null, ctx?: SecureContext) => void} cb
         */
        options.SNICallback = (domain, cb) => {
          const apex = domain.split('.').slice(-2).join('.')
          cb(null, secureContext[apex])
        }

        connector = https
      }
    } catch (e) {
      if (e && typeof e === 'object' && 'code' in e && e.code === 'ENOENT') {
        log.server.error(e)
      } else {
        throw e
      }
    }
  }

  /**
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   */
  const wrappedHandler = (req, res) => {
    if (denyRequest(req)) {
      return
    }

    return handler(req, res)
  }

  const server =
    connector === https
      ? https.createServer(options, wrappedHandler)
      : http.createServer(wrappedHandler)

  const clientError = middleware.clientError()
  server.on('clientError', clientError)

  const listener = middleware.listener({ host, port, startTime })
  server.listen(port, host, listener)

  return server
}

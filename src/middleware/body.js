import constants from '@magic/http1-constants'

import log from '../log.js'

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 */

// this middleware expects small chunks of data.
// it loads the full request body into ram before returning.
// request body size limits should be set in this middleware in the future.

/**
 * Parses request body, handling JSON and plain text
 * @param {IncomingMessage} req - HTTP request object
 * @returns {Promise<string|Object>} Parsed body as string or JSON object
 */
export const body = req =>
  new Promise((resolve, reject) => {
    try {
      /** @type {Uint8Array<ArrayBufferLike>[]} */
      const bodyParts = []

      req.on('data', chunk => {
        bodyParts.push(chunk)
      })

      req.on('end', () => {
        let body = Buffer.concat(bodyParts).toString()
        const isJson = req.headers[constants.headers.CONTENT_TYPE] === 'application/json'

        if (isJson) {
          try {
            body = JSON.parse(body)
          } catch (e) {
            log.server.error(e)
            reject(e)
            return
          }
        }

        resolve(body)
      })

      req.on('error', reject)
    } catch (e) {
      return e
    }
  })

import log from '../log.js'
import http2 from 'node:http2'

const { HTTP2_HEADER_CONTENT_TYPE } = http2.constants

/**
 * @typedef {import('node:http2').ServerHttp2Stream} Http2Stream
 * @typedef {import('node:http2').IncomingHttpHeaders} Http2Headers
 */

/**
 * Reads the full request body into memory.
 * Only works for small request bodies; size limits should be implemented.
 *
 * @param {Http2Stream} stream - The HTTP/2 stream
 * @param {Http2Headers} headers - The HTTP/2 headers
 * @returns {Promise<string | any>} Resolves with a string or parsed JSON object
 */
export const body = (stream, headers) =>
  new Promise((resolve, reject) => {
    try {
      const isJson = headers[HTTP2_HEADER_CONTENT_TYPE] === 'application/json'

      /** @type {Buffer[]} */
      const bodyParts = []

      stream.on(
        'data',
        /** @param {Buffer} chunk */ chunk => {
          bodyParts.push(chunk)
        },
      )

      stream.on('end', () => {
        let body = Buffer.concat(bodyParts).toString()

        if (isJson) {
          try {
            body = JSON.parse(body)
          } catch (e) {
            const err = /** @type {import('@magic/error').CustomError} */ (e)
            log.server.error(err)
            reject(err)
            return
          }
        }

        resolve(body)
      })

      stream.on('error', reject)
    } catch (e) {
      return reject(e)
    }
  })

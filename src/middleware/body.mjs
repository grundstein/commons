/*
 * this middleware expects small chunks of data.
 * it loads the full request body into ram before returning.
 * request body size limits should be set in this middleware in the future,
 * before it gets used anywhere!
 */

import log from '@magic/log'

import http2 from 'node:http2'

const { HTTP2_HEADER_CONTENT_TYPE } = http2.constants

export const body = (stream, headers, options = {}) =>
  new Promise((resolve, reject) => {
    const { maxBodySize = 10 * 1024 } = options

    try {
      const isJson = headers[HTTP2_HEADER_CONTENT_TYPE] === 'application/json'

      let bodyParts = []
      let bodyLength = 0

      stream.on('data', chunk => {
        bodyParts.push(chunk)
        bodyLength += chunk.length
        if (bodyLength > maxBodySize) {
          bodyParts = []
          stream.end()
        }
      })

      stream.on('end', () => {
        if (!bodyParts.length) {
          const e = new Error('E_MAX_BODY_SIZE: POST request body was too big.')
          resolve(e)
        }

        let body = Buffer.concat(bodyParts).toString()

        if (isJson) {
          try {
            body = JSON.parse(body)
          } catch (e) {
            log.server.error(e)
            resolve(e)
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

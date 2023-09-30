// this middleware expects small chunks of data.
// it loads the full request body into ram before returning.
// request body size limits should be set in this middleware in the future.

import http2 from 'node:http2'

const { HTTP2_HEADER_CONTENT_TYPE } = http2.constants

export const body = (stream, headers) =>
  new Promise((resolve, reject) => {
    try {
      const isJson = headers[HTTP2_HEADER_CONTENT_TYPE] === 'application/json'

      const bodyParts = []

      stream.on('data', chunk => {
        bodyParts.push(chunk)
      })

      stream.on('end', () => {
        let body = Buffer.concat(bodyParts).toString()

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

      stream.on('error', reject)
    } catch (e) {
      return reject(e)
    }
  })

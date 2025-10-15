import http2 from 'node:http2'
import path from 'node:path'

import { getFileEncoding } from './getFileEncoding.js'
import log from '../log.js'

const {
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_CONTENT_LENGTH,
  HTTP2_HEADER_CONTENT_ENCODING,
  HTTP2_HEADER_STATUS,
} = http2.constants

/**
 * @typedef {Object} FileDescriptor
 * @property {string} path - Absolute or relative file system path to the file.
 * @property {string} mime - MIME type of the file (e.g. `text/html`, `image/png`).
 * @property {number} size - File size in bytes.
 * @property {Buffer<ArrayBufferLike>} [br]
 * @property {Buffer<ArrayBufferLike>} [gzip]
 * @property {Buffer<ArrayBufferLike>} [deflate]
 */

/**
 * @typedef {Object} SendFileOptions
 * @property {number} [code=200] - HTTP status code to respond with.
 * @property {Record<string, string|number>} [head] - Additional headers to merge into the response.
 * @property {FileDescriptor} file - File information (path, MIME type, size).
 * @property {ReturnType<typeof process.hrtime>} [time] - Optional timestamp or high-resolution time for logging.
 */

/**
 * Sends a static file over an HTTP/2 stream with proper headers and error handling.
 *
 * @param {import('http2').ServerHttp2Stream} stream - The HTTP/2 stream to send the file over.
 * @param {import('http2').IncomingHttpHeaders} headers - Request headers from the client.
 * @param {SendFileOptions} options - Options controlling the response.
 * @returns {void} The function responds directly to the stream and does not return a value.
 */
export const sendFile = (stream, headers, options) => {
  let { code = 200, head, file, time = log.hrtime() } = options

  const encoding = getFileEncoding(file, headers['accept-encoding'])

  head = {
    [HTTP2_HEADER_CONTENT_TYPE]: file.mime,
    [HTTP2_HEADER_CONTENT_LENGTH]: file.size,
    [HTTP2_HEADER_CONTENT_ENCODING]: encoding,
    [HTTP2_HEADER_STATUS]: code,
    ...head,
  }

  /**
   * Handles file send errors by responding with an appropriate HTTP status.
   *
   * @param {NodeJS.ErrnoException} err - Error encountered while sending the file.
   */
  const onError = err => {
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ [http2.constants.HTTP2_HEADER_STATUS]: 404 })
        log.server.error('E_404', `File not found: ${file.path}`)
      } else {
        stream.respond({ [http2.constants.HTTP2_HEADER_STATUS]: 500 })
        log.server.error('E_500', `Unknown Error: ${file.path}`)
      }
    } catch (e) {
      const err = /** @type {import('@magic/error').CustomError} */ (e)
      log.server.error(`E_${err.code}`, err.msg)
    }

    stream.end()
  }

  if (!path.isAbsolute(file.path)) {
    file.path = path.join(process.cwd(), file.path)
  }

  log.server.request(stream, headers, { time })
  return stream.respondWithFile(file.path, head, { onError })
}

import { createReadStream } from 'node:fs'
import constants from '@magic/http1-constants'

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 * @typedef {import('http').OutgoingHttpHeaders} OutgoingHttpHeaders
 */

/**
 * @typedef {Object} StreamFileObject
 * @property {string} path - File path
 * @property {number} size - File size in bytes
 * @property {string} mime - MIME type
 */

/**
 * @typedef {Object} SendStreamOptions
 * @property {StreamFileObject} file - File object to stream
 * @property {OutgoingHttpHeaders} [headers={}] - Additional HTTP headers
 */

/**
 * Sends a file as a stream with support for HTTP range requests
 * @param {IncomingMessage} req - HTTP request object
 * @param {ServerResponse} res - HTTP response object
 * @param {SendStreamOptions} options - Stream options
 * @returns {void}
 */
export const sendStream = (req, res, options) => {
  const { file, headers = {} } = options
  const { range } = req.headers

  let statusCode = 200

  let start = 0
  let end = file.size - 1

  if (range) {
    const [startByte, endByte] = range.replace(/bytes=/, '').split('-')
    start = parseInt(startByte, 10)
    end = endByte ? parseInt(endByte, 10) : file.size - 1

    statusCode = 206
  }

  if (start >= file.size) {
    const errorMessage = `Requested range not satisfiable ${start} >= ${file.size}`
    const errorBuffer = Buffer.from(errorMessage)

    headers[constants.headers.CONTENT_TYPE] = 'text/plain'
    headers[constants.headers.CONTENT_LENGTH] = Buffer.byteLength(errorBuffer)

    res.writeHead(416, headers)
    res.end(errorMessage)
    return
  }

  const chunksize = end - start + 1

  headers[constants.headers.CONTENT_RANGE] = `bytes ${start}-${end}/${file.size}`
  headers[constants.headers.ACCEPT_RANGES] = 'bytes'
  headers[constants.headers.CONTENT_LENGTH] = chunksize
  headers[constants.headers.CONTENT_TYPE] = file.mime

  res.writeHead(statusCode, headers)

  const readStream = createReadStream(file.path, { start, end })

  readStream.pipe(res)

  res.on('close', () => {
    readStream.unpipe(res)
    readStream.destroy()
  })
}

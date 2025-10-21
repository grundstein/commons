import { createReadStream } from 'node:fs'

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

    headers['Content-Type'] = 'text/plain'
    headers['Content-Length'] = Buffer.byteLength(errorBuffer)

    res.writeHead(416, headers)
    res.end(errorMessage)
    return
  }

  const chunksize = end - start + 1

  headers['Content-Range'] = `bytes ${start}-${end}/${file.size}`
  headers['Accept-Ranges'] = 'bytes'
  headers['Content-Length'] = chunksize
  headers['Content-Type'] = file.mime

  res.writeHead(statusCode, headers)

  const readStream = createReadStream(file.path, { start, end })

  readStream.pipe(res)

  res.on('close', () => {
    readStream.unpipe(res)
    readStream.destroy()
  })
}

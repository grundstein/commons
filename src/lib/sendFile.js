import constants from '@magic/http1-constants'

import { getFileEncoding } from './getFileEncoding.js'
import { respond } from './respond.js'

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 * @typedef {import('http').OutgoingHttpHeaders} OutgoingHttpHeaders
 */

/**
 * @typedef {Object} FileObject
 * @property {Buffer} buffer - Uncompressed file buffer
 * @property {string} mime - MIME type
 * @property {Buffer} [gzip] - Gzip compressed buffer
 * @property {Buffer} [br] - Brotli compressed buffer
 * @property {Buffer} [deflate] - Deflate compressed buffer
 */

/**
 * @typedef {Object} SendFileOptions
 * @property {FileObject} file - File object to send
 * @property {number} [code=200] - HTTP status code
 * @property {string} [type='sendFile'] - Response type
 * @property {OutgoingHttpHeaders} [headers={}] - Additional HTTP headers
 */

/**
 * Sends a file as HTTP response with appropriate encoding
 * @param {IncomingMessage} req - HTTP request object
 * @param {ServerResponse} res - HTTP response object
 * @param {SendFileOptions} options - Send file options
 * @returns {void}
 */
export const sendFile = (req, res, options) => {
  const { file, code = 200, type = 'sendFile' } = options
  let { headers = {} } = options

  const acceptEncoding = req.headers[constants.headers.ACCEPT_ENCODING] || ''
  const encoding = getFileEncoding(file, acceptEncoding)

  /** @type {Buffer} */
  let body
  if (encoding === 'br' && file.br) {
    body = file.br
  } else if (encoding === 'gzip' && file.gzip) {
    body = file.gzip
  } else if (encoding === 'deflate' && file.deflate) {
    body = file.deflate
  } else {
    body = file.buffer
  }

  headers = {
    ...headers,
    [constants.headers.CONTENT_TYPE]: file.mime,
  }

  if (encoding !== 'buffer') {
    headers[constants.headers.CONTENT_ENCODING] = encoding
  }

  return respond(req, res, { code, headers, body, type })
}

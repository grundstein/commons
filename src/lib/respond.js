import http2 from 'node:http2'
import log from '../log.js'

const {
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_ENCODING,
  HTTP2_HEADER_CONTENT_LENGTH,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants

/**
 * @typedef {import('node:http2').ServerHttp2Stream} ServerHttp2Stream
 * @typedef {import('node:http2').IncomingHttpHeaders} Http2Headers
 * @typedef {import('node:http2').OutgoingHttpHeaders} Http2OutgoingHeaders
 */

/**
 * Response payload structure.
 * @typedef {Object} RespondPayload
 * @property {string | Buffer} [body='500 - Server Error'] - Response body content.
 * @property {number} [code=500] - HTTP status code.
 * @property {Http2OutgoingHeaders} [headers={}] - Additional response headers.
 * @property {ReturnType<typeof process.hrtime>} [time] - Request start time (used for logging).
 * @property {string} [type='response'] - Type of log entry.
 * @property {boolean} [getFullIp=false] - Whether to include the full IP address in logs.
 * @property {boolean} [json=false] - Whether to send JSON content-type.
 */

/**
 * Sends an HTTP/2 response and logs it.
 *
 * @param {ServerHttp2Stream} stream - The HTTP/2 stream object.
 * @param {Http2Headers} headers - Incoming HTTP/2 request headers.
 * @param {RespondPayload} [payload={}] - Response details and metadata.
 * @returns {void}
 */
export const respond = (stream, headers, payload = {}) => {
  let {
    body = '500 - Server Error',
    code = 500,
    headers: responseHeaders = {},
    time = log.hrtime(),
    type = 'response',
    getFullIp = false,
    json = false,
  } = payload

  const contentType = json ? 'application/json' : 'text/plain; charset=utf-8'

  // Safely compute byte length for both Buffer and string bodies
  const bodyLength =
    typeof body === 'string' ? Buffer.byteLength(body) : Buffer.isBuffer(body) ? body.length : 0

  responseHeaders = {
    [HTTP2_HEADER_CONTENT_TYPE]: contentType,
    [HTTP2_HEADER_CONTENT_LENGTH]: bodyLength,
    [HTTP2_HEADER_CONTENT_ENCODING]: 'identity',
    [HTTP2_HEADER_STATUS]: code,
    ...responseHeaders,
  }

  log.server.request(stream, headers, { headers: responseHeaders, time, type, getFullIp })

  stream.respond(responseHeaders)

  if (body && (typeof body === 'string' || Buffer.isBuffer(body))) {
    stream.write(body)
  }

  stream.end()
}

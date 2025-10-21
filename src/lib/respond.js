import log from '../log.js'

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 * @typedef {import('http').OutgoingHttpHeaders} OutgoingHttpHeaders
 */

/**
 * @typedef {Object} RespondPayload
 * @property {string|Buffer} [body='500 - Server Error'] - Response body
 * @property {number} [code=500] - HTTP status code
 * @property {OutgoingHttpHeaders} [headers=[]] - HTTP headers
 * @property {number} [time] - High-resolution time
 * @property {string} [type='response'] - Response type
 * @property {boolean} [getFullIp=false] - Whether to get full IP address
 */

/**
 * Sends HTTP response with headers and logs the request
 * @param {IncomingMessage} req - HTTP request object
 * @param {ServerResponse} res - HTTP response object
 * @param {RespondPayload} [payload={}] - Response payload options
 * @returns {void}
 */
export const respond = (req, res, payload = {}) => {
  const {
    body = '500 - Server Error',
    code = 500,
    headers = [],
    time = log.hrtime(),
    type = 'response',
    getFullIp = false,
  } = payload

  const head = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Content-Encoding': 'identity',
    ...headers,
  }

  res.writeHead(code, head)
  res.end(body)

  log.server.request(req, res, { time, type, getFullIp })
}

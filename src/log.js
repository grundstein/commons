import http2 from 'node:http2'
import magicLog from '@magic/log'
import is from '@magic/types'

import { getCurrentDate } from './lib/getCurrentDate.js'
import { getRequestDuration } from './lib/getRequestDuration.js'
import { getClientIp } from './lib/getClientIp.js'

/**
 * @typedef {import('node:http2').ServerHttp2Stream} ServerHttp2Stream
 * @typedef {import('node:http2').IncomingHttpHeaders} IncomingHttpHeaders
 * @typedef {import('node:http2').OutgoingHttpHeaders} OutgoingHttpHeader
 */

/**
 * @typedef {Object} RequestLogOptions
 * @property {IncomingHttpHeaders | OutgoingHttpHeader} [headers] - The response headers.
 * @property {ReturnType<typeof process.hrtime>} [time] - Timestamp for request start.
 * @property {string} [type='request'] - Log type.
 * @property {boolean} [getFullIp=false] - Whether to include full IP.
 */

/**
 * Logs a request entry.
 * @param {ServerHttp2Stream} stream - The HTTP2 stream for the request.
 * @param {IncomingHttpHeaders | OutgoingHttpHeader} [headers={}] - The incoming request headers.
 * @param {RequestLogOptions} [options={}] - Logging options.
 * @returns {void}
 */
const request = (stream, headers = {}, options = {}) => {
  const {
    headers: responseHeaders = {},
    time = [0, 0],
    type = 'request',
    getFullIp = false,
  } = options

  const duration = getRequestDuration(time)
  const timeData = getCurrentDate()
  const clientIp = getClientIp(stream, {}, getFullIp)

  const response = [
    '{',
    ' "code": "',
    responseHeaders[http2.constants.HTTP2_HEADER_STATUS] ?? '',
    '", ',
    '"date": "',
    timeData.date,
    '", ',
    '"time": "',
    timeData.time,
    '", ',
    '"duration": "',
    duration,
    '", ',
    '"type": "',
    type,
    '", ',
    '"path": "',
    headers[http2.constants.HTTP2_HEADER_PATH] ?? '',
    '", ',
    '"ip": "',
    clientIp ?? '',
    '"}',
  ].join('')

  magicLog(response)
}

/**
 * Logs an error entry.
 * @param {import('@magic/error').CustomError | string} err - The error object or message.
 * @param {...string} msgs - Additional context messages.
 * @returns {void}
 */
const error = (err, ...msgs) => {
  let msg = ''

  if (is.error(err)) {
    // Assuming @magic/types defines .error to check for Error-like objects
    msg = `${err.code ?? ''}: ${err.msg ?? err.message ?? ''} ${msgs.join(' ')}`
  } else {
    msg = [err, ...msgs].join(' ')
  }

  const { time, date } = getCurrentDate()

  const response = JSON.stringify({
    type: 'error',
    date,
    time,
    msg,
  })

  magicLog(response)
}

/**
 * Logs an informational message.
 * @param {...string} msgs
 * @returns {void}
 */
const info = (...msgs) => {
  const { time, date } = getCurrentDate()

  const response = JSON.stringify({
    type: 'info',
    date,
    time,
    msg: msgs.join(' '),
  })

  magicLog(response)
}

/**
 * Logs a warning message.
 * @param {...string} msgs
 * @returns {void}
 */
const warn = (...msgs) => {
  const { time, date } = getCurrentDate()

  const response = JSON.stringify({
    type: 'warn',
    date,
    time,
    msg: msgs.join(' '),
  })

  magicLog(response)
}

/**
 * @typedef {{
 *   server: {
 *     request: typeof request,
 *     info: typeof info,
 *     error: typeof error,
 *     warn: typeof warn,
 *   }
 * } & typeof magicLog} MagicLogExtended
 */

/** @type {MagicLogExtended} */
export const log = /** @type {any} */ (magicLog)

log.server = { request, info, error, warn }

export default log

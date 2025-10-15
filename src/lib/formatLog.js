import http2 from 'node:http2'
import log from '../log.js'
import { getRequestDuration } from './getRequestDuration.js'
import { getCurrentDate } from './getCurrentDate.js'

const { HTTP2_HEADER_STATUS, HTTP2_HEADER_PATH } = http2.constants

/**
 * @typedef {import('node:http2').IncomingHttpHeaders} Http2Headers
 */

/**
 * @typedef {{ [key: string]: string | number}} Head
 */

/**
 * @typedef {Object} FormatLogOptions
 * @property {Head} head - The HTTP/2 HEADERS frame
 * @property {ReturnType<typeof process.hrtime>} time - Request start timestamp (ms or hrtime)
 * @property {string} [type] - Log type, default 'request'
 */

/**
 * Formats and logs an HTTP/2 request.
 *
 * @param {Http2Headers} headers - The HTTP/2 headers object
 * @param {FormatLogOptions} options - Additional logging options
 */
export const formatLog = (headers, { head, time, type = 'request' }) => {
  const url = headers[HTTP2_HEADER_PATH]
  const statusCode = head[HTTP2_HEADER_STATUS]

  const duration = getRequestDuration(time)
  const timeData = getCurrentDate()

  const response = [
    '{',
    '"code": "',
    statusCode,
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
    url,
    '" ',
    '}',
  ].join('')

  log(response)
}

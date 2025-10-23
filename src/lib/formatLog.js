import logger from '../log.js'

import { getRequestDuration } from './getRequestDuration.js'
import { getCurrentDate } from './getCurrentDate.js'

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 */

/**
 * @typedef {Object} FormatLogOptions
 * @property {[number, number]} time - High-resolution time
 * @property {string} [type='request'] - Log type
 * @property {import('@magic/log').default} [log]
 */

/**
 * Formats and logs request information
 * @param {IncomingMessage} req - HTTP request object
 * @param {ServerResponse} res - HTTP response object
 * @param {FormatLogOptions} options - Format log options
 * @returns {void}
 */
export const formatLog = (req, res, { time, type = 'request', log = logger }) => {
  const { statusCode } = res
  const { url } = req

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

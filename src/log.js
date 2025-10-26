import magicLog from '@magic/log'

import { getCurrentDate } from './lib/getCurrentDate.js'
import { getRequestDuration } from './lib/getRequestDuration.js'
import { getClientIp } from './lib/getClientIp.js'

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 */

/**
 * @typedef {Object} RequestLogOptions
 * @property {[number, number]} time - High-resolution time
 * @property {string} [type='request'] - Type of request
 * @property {boolean} [getFullIp=false] - Whether to get full IP address
 */

/**
 * Logs HTTP request information
 * @param {IncomingMessage} req - HTTP request object
 * @param {ServerResponse} res - HTTP response object
 * @param {RequestLogOptions} options - Logging options
 * @returns {void}
 */
const request = (req, res, { time, type = 'request', getFullIp = false }) => {
  const { statusCode } = res
  const { url } = req

  const duration = getRequestDuration(time)

  const timeData = getCurrentDate()

  const clientIp = getClientIp(req, getFullIp)

  const response = [
    '{',
    ' "code": "',
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
    '", ',
    '"ip": "',
    clientIp,
    '"}',
  ].join('')

  magicLog(response)
}

/**
 * Logs error messages
 * @param {...string} msgs - Error messages to log
 * @returns {void}
 */
const error = (...msgs) => {
  const { time, date } = getCurrentDate()

  const response = [
    '{',
    '"type": "error", ',
    '"date": "',
    date,
    '", ',
    '"time": "',
    time,
    '", ',
    '"msg": "',
    msgs.join(' '),
    '" ',
    '}',
  ].join('')

  magicLog(response)
}

/**
 * Logs info messages
 * @param {...string} msgs - Info messages to log
 * @returns {void}
 */
const info = (...msgs) => {
  const { time, date } = getCurrentDate()

  const response = [
    '{',
    '"type": "info", ',
    '"date": "',
    date,
    '", ',
    '"time": "',
    time,
    '", ',
    '"msg": "',
    msgs.join(' '),
    '" ',
    '}',
  ].join('')

  magicLog(response)
}

/**
 * Logs warning messages
 * @param {...string} msgs - Warning messages to log
 * @returns {void}
 */
const warn = (...msgs) => {
  const { time, date } = getCurrentDate()

  const response = [
    '{',
    '"type": "warn", ',
    '"date": "',
    date,
    '", ',
    '"time": "',
    time,
    '", ',
    '"msg": "',
    msgs.join(' '),
    '" ',
    '}',
  ].join('')

  magicLog(response)
}

/**
 * @typedef {import('@magic/log').LogFunction & import('@magic/log').LogMethods & { server: { request: Function, info: Function, error: Function, warn: Function } }} EnhancedLog
 */

/** @type {EnhancedLog} */
const log = Object.assign(magicLog, {
  server: {
    request,
    info,
    error,
    warn,
  },
})

export default log

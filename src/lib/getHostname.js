import constants from '@magic/http1-constants'
import { is } from '../is.js'

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 */

/**
 * Extracts hostname from request headers or properties
 * Removes port number if present
 * @param {IncomingMessage} req - HTTP request object
 * @returns {string} Hostname without port
 */
export const getHostname = req => {
  if (!req) {
    return ''
  }

  const { headers = {} } = req
  let host = headers.host || headers[constants.headers.X_FORWARDED_FOR] || ''

  if (is.array(host)) {
    host = host[0]
  }

  if (is.str(host) && host.includes(':')) {
    return host.split(':')[0]
  }

  return host
}

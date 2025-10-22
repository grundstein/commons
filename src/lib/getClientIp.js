import { is } from '../is.js'
import { cleanIpAddress } from './cleanIpAddress.js'

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('net').Socket} Socket
 */

/**
 * @typedef {Object} ConnectionLike
 * @property {string} [remoteAddress]
 * @property {Socket} [socket]
 */

/**
 * @typedef {Object} RequestInfo
 * @property {string} [remoteAddress]
 */

/**
 * @typedef {Object} RequestIdentity
 * @property {string} [sourceIp]
 */

/**
 * @typedef {Object} RequestContext
 * @property {RequestIdentity} [identity]
 */

/**
 * @typedef {IncomingMessage & {
 *   info?: RequestInfo,
 *   requestContext?: RequestContext
 * }} ExtendedIncomingMessage
 */

/**
 * Returns the IP address from the headers, if it exists.
 * @param {ExtendedIncomingMessage} req - HTTP request object
 * @param {boolean} [full=false] - Whether to return full IP or cleaned version
 * @returns {string} Client IP address or 'unknown'
 */
export const getClientIp = (req, full = false) => {
  if (!req) {
    return 'unknown'
  }

  if (req.headers) {
    const keys = [
      'x-forwarded-for',
      'x-forwarded',
      'forwarded-for',
      'forwarded',
      // Heroku, AWS EC2, nginx (if configured), and others
      'x-client-ip',
      // used by some proxies, like nginx
      'x-real-ip',
      // Cloudflare
      'cf-connecting-ip',
      // Fastly and Firebase
      'fastly-client-ip',
      // Akamai, Cloudflare
      'true-client-ip',
      // Rackspace
      'x-cluster-client-ip',
    ]

    const headerKey = keys.find(key => is.ip(req.headers[key]))

    if (headerKey) {
      const value = req.headers[headerKey]
      if (typeof value === 'string') {
        return cleanIpAddress(value, full)
      }
    }
  }

  if (req.socket?.remoteAddress && is.ip(req.socket.remoteAddress)) {
    return cleanIpAddress(req.socket.remoteAddress, full)
  }

  const { info = {} } = req
  if (info.remoteAddress && is.ip(info.remoteAddress)) {
    return cleanIpAddress(info.remoteAddress, full)
  }

  const { requestContext = {} } = req
  const { identity = {} } = requestContext
  if (identity.sourceIp && is.ip(identity.sourceIp)) {
    return cleanIpAddress(identity.sourceIp, full)
  }

  return 'unknown'
}

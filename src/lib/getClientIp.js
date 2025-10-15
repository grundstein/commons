import is from '@magic/types'
import { isIp } from '../is.js'
import { cleanIpAddress } from './cleanIpAddress.js'

/**
 * @typedef {Object} StreamLike
 * @property {Object} [connection]
 * @property {string} [connection.remoteAddress]
 * @property {Object} [connection.socket]
 * @property {string} [connection.socket.remoteAddress]
 * @property {Object} [socket]
 * @property {string} [socket.remoteAddress]
 * @property {Object} [info]
 * @property {string} [info.remoteAddress]
 * @property {Object} [requestContext]
 * @property {Object} [requestContext.identity]
 * @property {string} [requestContext.identity.sourceIp]
 * @property {Object} [session]
 * @property {Object} [session.socket]
 * @property {string} [session.socket.remoteAddress]
 */

/**
 * @typedef {Record<string, string | string[] | undefined>} Headers
 */

/**
 * Returns the client IP address from HTTP/1.1 or HTTP/2 stream headers.
 *
 * @param {StreamLike} [stream={}] - The HTTP/2 stream or HTTP/1.1 request object
 * @param {Headers} [headers={}] - The request headers
 * @param {boolean} [full=false] - Whether to return the full IP or normalized
 * @returns {string} The client's IP address or `'unknown'`
 */
export const getClientIp = (stream = {}, headers = {}, full = false) => {
  if (stream.connection && stream.socket) {
    const req = stream
    const { connection = {} } = req
    if (isIp(connection.remoteAddress)) {
      const { remoteAddress = '' } = connection
      return cleanIpAddress(remoteAddress, full)
    }

    if (isIp(connection?.socket?.remoteAddress)) {
      const { remoteAddress = '' } = connection.socket || {}
      return cleanIpAddress(remoteAddress, full)
    }

    const { socket = {} } = req
    if (isIp(socket.remoteAddress)) {
      const { remoteAddress = '' } = socket
      return cleanIpAddress(remoteAddress, full)
    }

    const { info = {} } = req
    if (isIp(info.remoteAddress)) {
      const { remoteAddress = '' } = info
      return cleanIpAddress(remoteAddress, full)
    }

    const { requestContext = {} } = req
    const { identity = {} } = requestContext
    if (isIp(identity.sourceIp)) {
      const { sourceIp = '' } = identity
      return cleanIpAddress(sourceIp, full)
    }
  }

  const keys = [
    'x-forwarded-for',
    'x-forwarded',
    'forwarded-for',
    'forwarded',
    'x-client-ip',
    'x-real-ip',
    'cf-connecting-ip',
    'fastly-client-ip',
    'true-client-ip',
    'x-cluster-client-ip',
  ]

  const headerKey = keys.find(key => isIp(headers[key]))

  if (headerKey) {
    const value = headers[headerKey]
    if (value) {
      const v = is.array(value) ? value[0] : value
      return cleanIpAddress(v, full)
    }
  }

  const ip = stream?.session?.socket?.remoteAddress
  if (isIp(ip) && is.str(ip)) {
    return cleanIpAddress(ip, full)
  }

  return 'unknown'
}

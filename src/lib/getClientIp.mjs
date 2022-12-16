import { is } from '../is.mjs'
import { cleanIpAddress } from './cleanIpAddress.mjs'

/**
 * Returns the IP address from the headers, if it exists.
 */
export const getClientIp = (stream = {}, headers = {}, full = false) => {
  if (stream.connection && stream.socket) {
    const req = stream
    const { connection = {} } = req
    if (is.ip(connection.remoteAddress)) {
      return cleanIpAddress(connection.remoteAddress, full)
    }

    if (is.ip(connection?.socket?.remoteAddress)) {
      return cleanIpAddress(connection.socket.remoteAddress, full)
    }

    const { socket = {} } = req
    if (is.ip(socket.remoteAddress)) {
      return cleanIpAddress(socket.remoteAddress, full)
    }

    const { info = {} } = req
    if (is.ip(info.remoteAddress)) {
      return cleanIpAddress(info.remoteAddress, full)
    }

    const { requestContext = {} } = req
    const { identity = {} } = requestContext
    if (is.ip(identity.sourceIp)) {
      return cleanIpAddress(identity.sourceIp, full)
    }
  }

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

  const headerKey = keys.find(key => is.ip(headers[key]))

  if (headerKey) {
    const value = headers[headerKey]
    return cleanIpAddress(value, full)
  }

  const ip = stream?.session?.socket?.remoteAddress
  if (is.ip(ip)) {
    return cleanIpAddress(ip, full)
  }

  return 'unknown'
}

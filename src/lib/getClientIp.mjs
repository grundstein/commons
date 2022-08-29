import { is } from '../is.mjs'
import { cleanIpAddress } from './cleanIpAddress.mjs'

/**
 * Returns the IP address from the headers, if it exists.
 */
export const getClientIp = (stream = {}, headers = {}, full = false) => {
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

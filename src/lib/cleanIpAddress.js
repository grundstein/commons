import { is } from '../is.js'

/**
 * Cleans and optionally obscures an IP address
 * For IPv6: replaces last segment with 'xxxx' when not full
 * For IPv4: replaces last octet with 'xxx' when not full
 * @param {string} ip - IP address to clean
 * @param {boolean} [full] - Whether to return full IP address without obscuring
 * @returns {string} Cleaned IP address
 */
export const cleanIpAddress = (ip, full) => {
  if (!ip) {
    return ip
  }

  if (is.ip.v6(ip)) {
    if (!full) {
      const ipArray = ip.split(':')
      ipArray[ipArray.length - 1] = 'xxxx'
      return ipArray.join(':')
    }

    return ip
  }

  if (ip.includes(':')) {
    ip = ip.split(':')[0]
  }

  if (!full && is.ip.v4(ip)) {
    const ipArray = ip.split('.')
    ipArray[ipArray.length - 1] = 'xxx'
    return ipArray.join('.')
  }

  return ip
}

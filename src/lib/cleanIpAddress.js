import { isIPv6 } from 'node:net'

/**
 *
 *
 * @param {string} ip
 * @param {boolean} [full]
 * @returns
 */
export const cleanIpAddress = (ip, full = false) => {
  if (!ip) {
    return ip
  }

  if (isIPv6(ip)) {
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

  if (!full) {
    const ipArray = ip.split('.')
    ipArray[ipArray.length - 1] = 'xxx'
    return ipArray.join('.')
  }

  return ip
}

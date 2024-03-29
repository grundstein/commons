import { is } from '../is.mjs'

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

  if (!full) {
    const ipArray = ip.split('.')
    ipArray[ipArray.length - 1] = 'xxx'
    return ipArray.join('.')
  }

  return ip
}

import { isIp, isIpV4, isIpV6 } from '../src/is.js'

export default [
  { fn: isIp('1.2.3.4'), expect: true, info: 'isIp works for v4' },
  { fn: isIp('::1'), expect: true, info: 'isIp works for v6' },
  { fn: isIpV4('1.2.3.4'), expect: true, info: 'isIp.v4 works for v4' },
  { fn: isIpV4('::1'), expect: false, info: 'isIp.v4 works for v6' },
  { fn: isIpV6('::1'), expect: true, info: 'isIp.v6 works for v6' },
  { fn: isIpV6('1.2.3.4'), expect: false, info: 'isIp.v6 works for v4' },
]

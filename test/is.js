import { is } from '../src/is.js'

export default [
  { fn: is.ip('1.2.3.4'), expect: true, info: 'is.ip works for v4' },
  { fn: is.ip('::1'), expect: true, info: 'is.ip works for v6' },
  { fn: is.ip.v4('1.2.3.4'), expect: true, info: 'is.ip.v4 works for v4' },
  { fn: is.ip.v4('::1'), expect: false, info: 'is.ip.v4 works for v6' },
  { fn: is.ip.v6('::1'), expect: true, info: 'is.ip.v6 works for v6' },
  { fn: is.ip.v6('1.2.3.4'), expect: false, info: 'is.ip.v6 works for v4' },
]

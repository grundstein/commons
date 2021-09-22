import { getClientIp } from '../../src/lib/getClientIp.mjs'

const validHeaders = {
  'x-forwarded-for': '1.2.3.4',
}
const validHeaderResponse = '1.2.3.235'

const validConnection = {
  remoteAddress: '2.3.4.5',
}
const validConnectionResponse = '2.3.4.235'

const validIpv6Headers = {
  'x-forwarded-for': '1:2ab3:4:5:6:7:8:9'
}

export default [
  { fn: getClientIp(), expect: 'unknown', info: 'calling getClientIp without arguments returns "unknown"' },
  { fn: getClientIp(), expect: 'unknown', info: 'calling getClientIp without arguments returns "unknown"' },
  { fn: getClientIp({ connection: {}, headers: {} }), expect: 'unknown', info: 'calling getClientIp without headers and connection returns "unknown"' },
  { fn: getClientIp({ headers: validHeaders }, true), expect: validHeaders['x-forwarded-for'], info: 'calling with headers[x-forwarded-for] and full returns full ip.' },
  { fn: getClientIp({ connection: validConnection }, true), expect: validConnection.remoteAddress, info: 'calling with connection.remoteAddress and full returns full ip.' },
  { fn: getClientIp({ headers: validHeaders }), expect: validHeaderResponse, info: 'calling with connection.remoteAddress and full returns full ip.' },
  { fn: getClientIp({ connection: validConnection }), expect: validConnectionResponse, info: 'calling with connection.remoteAddress and full returns full ip.' },
]

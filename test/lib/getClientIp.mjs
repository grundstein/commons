import http2 from 'node:http2'

import { getClientIp } from '../../src/lib/getClientIp.mjs'

const { HTTP2_HEADER_X_FORWARDED_FOR } = http2.constants

const validHeaders = {
  [HTTP2_HEADER_X_FORWARDED_FOR]: '1.2.3.4',
}
const validHeaderResponse = '1.2.3.xxx'

const validIpv6Headers = {
  [HTTP2_HEADER_X_FORWARDED_FOR]: '1:2ab3:4:5:6:7:8:9',
}
const validIpv6HeaderResponse = '1:2ab3:4:5:6:7:8:xxxx'

const keys = [
  HTTP2_HEADER_X_FORWARDED_FOR,
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

const stream = {
  session: {
    socket: {
      remoteAddress: '1.2.3.4',
    },
  },
}

export default [
  {
    fn: getClientIp(),
    expect: 'unknown',
    info: 'calling getClientIp without arguments returns "unknown"',
  },
  {
    fn: getClientIp({}, {}),
    expect: 'unknown',
    info: 'calling getClientIp without empty headers and stream returns "unknown"',
  },
  {
    fn: getClientIp({}, validHeaders, true),
    expect: validHeaders[HTTP2_HEADER_X_FORWARDED_FOR],
    info: 'calling with headers[x-forwarded-for] and full returns full ip.',
  },
  {
    fn: getClientIp(stream, {}, true),
    expect: stream.session.socket.remoteAddress,
    info: 'calling with stream.session.socket.remoteAddress, empty headers and full = true returns full ip.',
  },
  {
    fn: getClientIp({}, validHeaders),
    expect: validHeaderResponse,
    info: 'calling with headers["x-forwarded-for"] and full = true returns full ip.',
  },
  {
    fn: getClientIp({}, validIpv6Headers, true),
    expect: validIpv6Headers[HTTP2_HEADER_X_FORWARDED_FOR],
    info: 'calling with ipv6 ip and full returns full ip.',
  },
  {
    fn: getClientIp({}, validIpv6Headers),
    expect: validIpv6HeaderResponse,
    info: 'calling with ipv6 ip returns anonymized ip.',
  },
  ...keys.map(key => ({
    fn: getClientIp({}, { [key]: '1.2.3.4' }),
    expect: '1.2.3.xxx',
    info: `using req.headers[${key}] works`,
  })),
]

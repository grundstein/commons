import { getClientIp } from '../../src/lib/getClientIp.js'

const validHeaders = {
  'x-forwarded-for': '1.2.3.4',
}
const validHeaderResponse = '1.2.3.xxx'

const validConnection = {
  remoteAddress: '2.3.4.5',
}
const validConnectionResponse = '2.3.4.xxx'

const validIpv6Headers = {
  'x-forwarded-for': '1:2ab3:4:5:6:7:8:9',
}

const validIpv6HeaderResponse = '1:2ab3:4:5:6:7:8:xxxx'

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

export default [
  {
    fn: getClientIp(),
    expect: 'unknown',
    info: 'calling getClientIp without arguments returns "unknown"',
  },
  {
    fn: getClientIp(),
    expect: 'unknown',
    info: 'calling getClientIp without arguments returns "unknown"',
  },
  {
    fn: getClientIp({ headers: {} }),
    expect: 'unknown',
    info: 'calling getClientIp without headers and connection returns "unknown"',
  },
  {
    fn: getClientIp({ headers: validHeaders }, true),
    expect: validHeaders['x-forwarded-for'],
    info: 'calling with headers[x-forwarded-for] and full returns full ip.',
  },
  {
    fn: getClientIp({ socket: { remoteAddress: '127.0.0.1' } }),
    expect: '127.0.0.xxx',
    info: 'req.socket.remoteAddress works',
  },
  {
    fn: getClientIp({ info: { remoteAddress: '127.0.0.1' } }),
    expect: '127.0.0.xxx',
    info: 'req.info.remoteAddress works',
  },
  {
    fn: getClientIp({ requestContext: { identity: { sourceIp: '127.0.0.1' } } }),
    expect: '127.0.0.xxx',
    info: 'requestContext.sourceIp works',
  },
  {
    fn: getClientIp({ headers: validHeaders }),
    expect: validHeaderResponse,
    info: 'calling with valid headers returns ip.',
  },
  {
    fn: getClientIp({ headers: validIpv6Headers }, true),
    expect: validIpv6Headers['x-forwarded-for'],
    info: 'calling with ipv6 ip and full returns full ip.',
  },
  {
    fn: getClientIp({ headers: validIpv6Headers }),
    expect: validIpv6HeaderResponse,
    info: 'calling with ipv6 ip returns anonymized ip.',
  },
  ...keys.map(key => ({
    fn: getClientIp({ headers: { [key]: '1.2.3.4' } }),
    expect: '1.2.3.xxx',
    info: `using req.headers[${key}] works`,
  })),
]

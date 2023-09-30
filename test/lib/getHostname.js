import { is } from '@magic/test'

import { getHostname } from '../../src/lib/getHostname.js'

const http1Headers = {
  hostname: 'toplevelhostname',
  headers: {
    host: 'headers.host',
  },
}

const xForwardedFor = {
  'x-forwarded-for': 'x-forwarded-for:8000',
  authority: 'authority',
}

const xForwardedForWithPort = {
  'x-forwarded-for': 'x-forwarded-for:8000',
}

export default [
  { fn: getHostname, expect: is.str, info: 'getHostname: always returns a string' },
  { fn: getHostname, expect: '', info: 'getHostname: without arguments returns empty string' },
  {
    fn: getHostname(xForwardedFor),
    expect: 'x-forwarded-for',
    info: 'getHostname: x-forwarded-for is highest authority for http2.',
  },
  {
    fn: getHostname({ headers: xForwardedFor }),
    expect: 'x-forwarded-for',
    info: 'getHostname: x-forwarded-for is highest authority for http1.1.',
  },
  {
    fn: getHostname(xForwardedForWithPort),
    expect: 'x-forwarded-for',
    info: 'getHostname: removes port from host if it exists (:8888).',
  },
  {
    fn: getHostname(http1Headers),
    expect: 'headers.host',
    info: 'getHostname: http1Headers return headers.host, even if req.hostname is defined',
  },
  {
    fn: getHostname({ hostname: 'testing', headers: {} }),
    expect: 'testing',
    info: 'if headers.hostname is set, return it if no other headers exist',
  },
]

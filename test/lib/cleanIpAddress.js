import { is, tryCatch } from '@magic/test'
import { cleanIpAddress } from '../../src/lib/cleanIpAddress.js'

export default [
  {
    fn: tryCatch(() => cleanIpAddress()),
    expect: is.undefined,
    info: 'returns undefined when called with no argument',
  },

  {
    fn: () => cleanIpAddress(null),
    expect: null,
    info: 'returns null when input is null',
  },

  {
    fn: () => cleanIpAddress('192.168.1.100'),
    expect: '192.168.1.xxx',
    info: 'obscures last octet of IPv4 when full = false',
  },

  {
    fn: () => cleanIpAddress('192.168.1.100', true),
    expect: '192.168.1.100',
    info: 'returns full IPv4 when full = true',
  },

  {
    fn: () => cleanIpAddress('192.168.1.100:8080'),
    expect: '192.168.1.xxx',
    info: 'strips port and obscures last octet for IPv4 with port',
  },

  {
    fn: () => cleanIpAddress('fe80::a6db:30ff:fe98:e946'),
    expect: 'fe80::a6db:30ff:fe98:xxxx',
    info: 'obscures last segment for IPv6 when full = false',
  },

  {
    fn: () => cleanIpAddress('fe80::a6db:30ff:fe98:e946', true),
    expect: 'fe80::a6db:30ff:fe98:e946',
    info: 'returns full IPv6 when full = true',
  },

  {
    fn: () => cleanIpAddress('::1'),
    expect: '::xxxx',
    info: 'handles short IPv6 (loopback) correctly',
  },

  {
    fn: () => cleanIpAddress('255.255.255.255'),
    expect: '255.255.255.xxx',
    info: 'obscures last octet for broadcast IPv4',
  },

  {
    fn: () => cleanIpAddress('not-an-ip'),
    expect: 'not-an-ip',
    info: 'returns input unchanged when not a valid IP',
  },
]

import { cleanIpAddress } from '../../src/lib/cleanIpAddress.mjs'

export default [
  { fn: cleanIpAddress, expect: undefined, info: 'cleanIpAddress: empty argument gets returned' },
  {
    fn: cleanIpAddress(false),
    expect: false,
    info: 'cleanIpAddress: "false" argument gets returned',
  },
  {
    fn: cleanIpAddress('127.0.0.1'),
    expect: '127.0.0.xxx',
    info: 'cleanIpAddress removes last part of localhost ip',
  },
  {
    fn: cleanIpAddress('192.168.1.101'),
    expect: '192.168.1.xxx',
    info: 'cleanIpAddress removes last part of local network ip',
  },
  {
    fn: cleanIpAddress('184.123.14.1'),
    expect: '184.123.14.xxx',
    info: 'cleanIpAddress removes last part of external ip',
  },
  {
    fn: cleanIpAddress('184.123.14.1:8888'),
    expect: '184.123.14.xxx',
    info: 'cleanIpAddress removes port before cleaning',
  },
]

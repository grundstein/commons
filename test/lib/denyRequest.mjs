import http2 from 'node:http2'

import { is, tryCatch } from '@magic/test'

import { denyRequest } from '../../src/lib/denyRequest.mjs'

const { HTTP2_HEADER_PATH } = http2.constants

const headers = {
  [HTTP2_HEADER_PATH]: '',
}

const testSocketDestroy = () => {
  let called = false

  const stream = {
    destroy: () => {
      called = true
    },
  }

  denyRequest(stream, headers)

  return called
}

export default [
  { fn: denyRequest, expect: true, info: 'denyRequest denies if called without argument.' },
  {
    fn: denyRequest({}, {}),
    expect: true,
    info: 'denyRequest denies if called with empty object argument.',
  },
  {
    fn: denyRequest({}, { [HTTP2_HEADER_PATH]: '' }),
    expect: true,
    info: 'denyRequest denies if called with empty url',
  },
  {
    fn: denyRequest({}, { [HTTP2_HEADER_PATH]: 'http://testing.com' }),
    expect: true,
    info: 'denyRequest denies if url includes ://',
  },
  {
    fn: denyRequest({}, { [HTTP2_HEADER_PATH]: 'testing' }),
    expect: true,
    info: 'denyRequest denies if url does not start with a /',
  },
  {
    fn: denyRequest({}, { [HTTP2_HEADER_PATH]: '/' }),
    expect: false,
    info: 'denyRequest denies if called with empty object argument.',
  },
  {
    fn: denyRequest({}, { [HTTP2_HEADER_PATH]: '/test/?query=true&t=1' }),
    expect: false,
    info: 'denyRequest handles ? query parameters.',
  },
  { fn: testSocketDestroy, expect: true, info: 'denyRequest calls socket.destroy if it exists.' },
]

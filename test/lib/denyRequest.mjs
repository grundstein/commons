import { is, tryCatch } from '@magic/test'

import { denyRequest } from '../../src/lib/denyRequest.mjs'

const testSocketDestroy = () => {
  let called = false

  const socket = {
    destroy: () => {
      called = true
    },
  }

  denyRequest({ socket, url: '' })

  return called
}

export default [
  { fn: denyRequest, expect: true, info: 'denyRequest denies if called without argument.' },
  {
    fn: denyRequest({}),
    expect: true,
    info: 'denyRequest denies if called with empty object argument.',
  },
  {
    fn: denyRequest({ url: '' }),
    expect: true,
    info: 'denyRequest denies if called with empty req.url',
  },
  {
    fn: denyRequest({ url: 'http://testing.com' }),
    expect: true,
    info: 'denyRequest denies if req.url includes ://',
  },
  {
    fn: denyRequest({ url: 'testing' }),
    expect: true,
    info: 'denyRequest denies if req.url does not start with a /',
  },
  {
    fn: denyRequest({ url: '/' }),
    expect: false,
    info: 'denyRequest denies if called with empty object argument.',
  },
  {
    fn: denyRequest({ url: '/test/?query=true&t=1' }),
    expect: false,
    info: 'denyRequest handles ? query parameters.',
  },
  { fn: testSocketDestroy, expect: true, info: 'denyRequest calls socket.destroy if it exists.' },
]

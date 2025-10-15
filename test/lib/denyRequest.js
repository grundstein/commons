import http2 from 'node:http2'

import { denyRequest } from '../../src/lib/denyRequest.js'

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

const testNullHeaders = () => {
  const stream = {}
  // @ts-ignore - Testing null headers explicitly
  return denyRequest(stream, null)
}

const testHTTP1Request = () => {
  const mockRequest = {
    url: '/test',
    socket: {
      destroy: () => {},
    },
  }
  return denyRequest(mockRequest, {})
}

const testHTTP1InvalidUrl = () => {
  let destroyed = false
  const mockRequest = {
    url: 'http://test.com',
    socket: {
      destroy: () => {
        destroyed = true
      },
    },
  }
  const result = denyRequest(mockRequest, {})
  return result && destroyed
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
  {
    fn: denyRequest({}, { [HTTP2_HEADER_PATH]: ['/test'] }),
    expect: false,
    info: 'denyRequest handles array path header with valid path.',
  },
  {
    fn: denyRequest({}, { [HTTP2_HEADER_PATH]: [''] }),
    expect: true,
    info: 'denyRequest denies if array path header contains empty string.',
  },
  {
    fn: denyRequest({}, { [HTTP2_HEADER_PATH]: ['http://testing.com'] }),
    expect: true,
    info: 'denyRequest denies if array path header contains url with ://',
  },
  { fn: testNullHeaders, expect: true, info: 'denyRequest denies if headers is null.' },
  {
    fn: testHTTP1Request,
    expect: false,
    info: 'denyRequest handles HTTP/1.1 request with valid url.',
  },
  {
    fn: testHTTP1InvalidUrl,
    expect: true,
    info: 'denyRequest denies HTTP/1.1 request with invalid url and destroys socket.',
  },
  { fn: testSocketDestroy, expect: true, info: 'denyRequest calls socket.destroy if it exists.' },
]

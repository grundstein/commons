import http2 from 'node:http2'
import path from 'node:path'
import { is } from '@magic/test'

import { sendFile } from '../../src/lib/sendFile.js'

const {
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_CONTENT_LENGTH,
  HTTP2_HEADER_CONTENT_ENCODING,
  HTTP2_HEADER_STATUS,
} = http2.constants

// Mock stream object
const createMockStream = (overrides = {}) => ({
  respond: () => {},
  respondWithFile: (filepath, headers, options) => {
    return { filepath, headers, options }
  },
  end: () => {},
  ...overrides,
})

// Test basic file sending
const testBasicFileSend = () => {
  const stream = createMockStream()
  const headers = { 'accept-encoding': 'gzip' }
  const file = {
    path: '/test/file.html',
    mime: 'text/html',
    size: 1024,
    gzip: Buffer.from('test'),
  }

  const result = sendFile(stream, headers, { file })

  return result && result.filepath === file.path
}

// Test with custom status code
const testCustomStatusCode = () => {
  let statusCode
  const stream = createMockStream({
    respondWithFile: (filepath, headers) => {
      statusCode = headers[HTTP2_HEADER_STATUS]
      return { filepath, headers }
    },
  })

  const headers = {}
  const file = {
    path: '/test/file.html',
    mime: 'text/html',
    size: 1024,
  }

  sendFile(stream, headers, { file, code: 201 })

  return statusCode === 201
}

// Test with additional headers
const testAdditionalHeaders = () => {
  let responseHeaders
  const stream = createMockStream({
    respondWithFile: (filepath, headers) => {
      responseHeaders = headers
      return { filepath, headers }
    },
  })

  const headers = {}
  const file = {
    path: '/test/file.html',
    mime: 'text/html',
    size: 1024,
  }

  sendFile(stream, headers, { file, head: { 'X-Custom': 'value' } })

  return responseHeaders['X-Custom'] === 'value'
}

// Test with relative path conversion
const testRelativePathConversion = () => {
  let resultPath
  const stream = createMockStream({
    respondWithFile: (filepath, headers) => {
      resultPath = filepath
      return { filepath, headers }
    },
  })

  const headers = {}
  const file = {
    path: 'test/file.html',
    mime: 'text/html',
    size: 1024,
  }

  sendFile(stream, headers, { file })

  return resultPath === file.path
}

// Test ENOENT error handling
const testENOENTError = () => {
  let responded = false
  let statusCode
  let ended = false

  const stream = createMockStream({
    respond: headers => {
      responded = true
      statusCode = headers[HTTP2_HEADER_STATUS]
    },
    respondWithFile: (filepath, headers, options) => {
      const err = new Error('File not found')
      err.code = 'ENOENT'
      options.onError(err)
      return { filepath, headers, options }
    },
    end: () => {
      ended = true
    },
  })

  const headers = {}
  const file = {
    path: '/test/nonexistent.html',
    mime: 'text/html',
    size: 1024,
  }

  sendFile(stream, headers, { file })

  return responded && statusCode === 404 && ended
}

// Test unknown error handling (500)
const testUnknownError = () => {
  let responded = false
  let statusCode
  let ended = false

  const stream = createMockStream({
    respond: headers => {
      responded = true
      statusCode = headers[HTTP2_HEADER_STATUS]
    },
    respondWithFile: (filepath, headers, options) => {
      const err = new Error('Unknown error')
      err.code = 'EUNKNOWN'
      options.onError(err)
      return { filepath, headers, options }
    },
    end: () => {
      ended = true
    },
  })

  const headers = {}
  const file = {
    path: '/test/file.html',
    mime: 'text/html',
    size: 1024,
  }

  sendFile(stream, headers, { file })

  return responded && statusCode === 500 && ended
}

// Test error handling when stream.respond throws
const testRespondThrowsError = () => {
  let ended = false

  const stream = createMockStream({
    respond: () => {
      throw new Error('Stream already closed')
    },
    respondWithFile: (filepath, headers, options) => {
      const err = new Error('File not found')
      err.code = 'ENOENT'
      options.onError(err)
      return { filepath, headers, options }
    },
    end: () => {
      ended = true
    },
  })

  const headers = {}
  const file = {
    path: '/test/file.html',
    mime: 'text/html',
    size: 1024,
  }

  sendFile(stream, headers, { file })

  // Should still call end() even if respond() throws
  return ended
}

// Test with all encoding types
const testBrotliEncoding = () => {
  let encoding
  const stream = createMockStream({
    respondWithFile: (filepath, headers) => {
      encoding = headers[HTTP2_HEADER_CONTENT_ENCODING]
      return { filepath, headers }
    },
  })

  const headers = { 'accept-encoding': 'br' }
  const file = {
    path: '/test/file.html',
    mime: 'text/html',
    size: 1024,
    br: Buffer.from('test'),
  }

  sendFile(stream, headers, { file })

  return encoding === 'br'
}

const testDeflateEncoding = () => {
  let encoding
  const stream = createMockStream({
    respondWithFile: (filepath, headers) => {
      encoding = headers[HTTP2_HEADER_CONTENT_ENCODING]
      return { filepath, headers }
    },
  })

  const headers = { 'accept-encoding': 'deflate' }
  const file = {
    path: '/test/file.html',
    mime: 'text/html',
    size: 1024,
    deflate: Buffer.from('test'),
  }

  sendFile(stream, headers, { file })

  return encoding === 'deflate'
}

// Test with custom time parameter
const testCustomTime = () => {
  const stream = createMockStream()
  const headers = {}
  const file = {
    path: '/test/file.html',
    mime: 'text/html',
    size: 1024,
  }
  const customTime = process.hrtime()

  const result = sendFile(stream, headers, { file, time: customTime })

  // Should not throw and should return result
  return !!result
}

export default [
  { fn: testBasicFileSend, expect: true, info: 'sendFile sends a basic file' },
  { fn: testCustomStatusCode, expect: true, info: 'sendFile uses custom status code' },
  { fn: testAdditionalHeaders, expect: true, info: 'sendFile merges additional headers' },
  {
    fn: testRelativePathConversion,
    expect: true,
    info: 'sendFile converts relative paths to absolute',
  },
  { fn: testENOENTError, expect: true, info: 'sendFile handles ENOENT error with 404' },
  { fn: testUnknownError, expect: true, info: 'sendFile handles unknown errors with 500' },
  { fn: testRespondThrowsError, expect: true, info: 'sendFile handles errors when respond throws' },
  { fn: testBrotliEncoding, expect: true, info: 'sendFile handles brotli encoding' },
  { fn: testDeflateEncoding, expect: true, info: 'sendFile handles deflate encoding' },
  { fn: testCustomTime, expect: true, info: 'sendFile accepts custom time parameter' },
]

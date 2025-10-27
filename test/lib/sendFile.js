import { fs, is, tryCatch } from '@magic/test'
import { join } from 'node:path'
import { Writable } from 'node:stream'

import { sendFile } from '../../src/lib/sendFile.js'

import constants from '@magic/http1-constants'

const { ACCEPT_ENCODING, CONTENT_ENCODING, CONTENT_TYPE } = constants.headers

// Create a test file for sending
const testDir = join(process.cwd(), 'test', '.sendFile-test-tmp')
const testFile = join(testDir, 'test-sendfile.txt')
const testContent = 'Hello World! This is test content for sending.'

// Setup
const before = async () => {
  await fs.mkdirp(testDir)
  await fs.writeFile(testFile, testContent)

  return async () => {
    await fs.rmrf(testDir)
  }
}

// Mock response object that extends Writable
class MockResponse extends Writable {
  constructor() {
    super()
    this.statusCode = 0
    this.headers = {}
    this.body = null
    this.finished = false
  }

  writeHead(code, headers) {
    this.statusCode = code
    this.headers = headers
  }

  end(data) {
    if (data) this.body = data
    this.finished = true
    this.emit('finish')
  }

  _write(_chunk, _encoding, callback) {
    callback()
  }
}

const createMockRes = () => new MockResponse()

// Create mock request
const createMockReq = (headers = {}) => ({
  headers,
  url: '/test',
  connection: {
    remoteAddress: '127.0.0.1',
  },
  socket: {
    remoteAddress: '127.0.0.1',
  },
})

// Create test buffers
const testBuffer = Buffer.from(testContent)
const testGzipBuffer = Buffer.from('gzipped content')
const testBrBuffer = Buffer.from('brotli content')
const testDeflateBuffer = Buffer.from('deflate content')

export default [
  {
    fn: tryCatch(sendFile),
    expect: is.error,
    info: 'sendFile without arguments throws',
  },

  {
    fn: () => {
      const req = createMockReq()
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        mime: 'text/plain',
      }

      sendFile(req, res, { file })

      return res.body.equals(testBuffer)
    },
    before,
    expect: true,
    info: 'sendFile sends uncompressed buffer when no encoding accepted',
  },

  {
    fn: () => {
      const req = createMockReq()
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        mime: 'text/plain',
      }

      sendFile(req, res, { file })

      return res.statusCode
    },
    before,
    expect: 200,
    info: 'sendFile uses default status code 200',
  },

  {
    fn: () => {
      const req = createMockReq()
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        mime: 'text/plain',
      }

      sendFile(req, res, { file, code: 404 })

      return res.statusCode
    },
    before,
    expect: 404,
    info: 'sendFile accepts custom status code',
  },

  {
    fn: () => {
      const req = createMockReq()
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        mime: 'text/html',
      }

      sendFile(req, res, { file })

      return res.headers[CONTENT_TYPE]
    },
    before,
    expect: 'text/html',
    info: 'sendFile sets correct content-type from file.mime',
  },

  {
    fn: () => {
      const req = createMockReq({ [ACCEPT_ENCODING]: 'gzip' })
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        gzip: testGzipBuffer,
        mime: 'text/plain',
      }

      sendFile(req, res, { file })

      return res.body.equals(testGzipBuffer)
    },
    before,
    expect: true,
    info: 'sendFile sends gzip compressed buffer when accepted',
  },

  {
    fn: () => {
      const req = createMockReq({ [ACCEPT_ENCODING]: 'gzip' })
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        gzip: testGzipBuffer,
        mime: 'text/plain',
      }

      sendFile(req, res, { file })

      return res.headers[CONTENT_ENCODING]
    },
    before,
    expect: 'gzip',
    info: 'sendFile sets content-encoding header for gzip',
  },

  {
    fn: () => {
      const req = createMockReq({ [ACCEPT_ENCODING]: 'br' })
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        br: testBrBuffer,
        mime: 'text/plain',
      }

      sendFile(req, res, { file })

      return res.body.equals(testBrBuffer)
    },
    before,
    expect: true,
    info: 'sendFile sends brotli compressed buffer when accepted',
  },

  {
    fn: () => {
      const req = createMockReq({ [ACCEPT_ENCODING]: 'br' })
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        br: testBrBuffer,
        mime: 'text/plain',
      }

      sendFile(req, res, { file })

      return res.headers[CONTENT_ENCODING]
    },
    before,
    expect: 'br',
    info: 'sendFile sets content-encoding header for brotli',
  },

  {
    fn: () => {
      const req = createMockReq({ [ACCEPT_ENCODING]: 'deflate' })
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        deflate: testDeflateBuffer,
        mime: 'text/plain',
      }

      sendFile(req, res, { file })

      return res.body.equals(testDeflateBuffer)
    },
    before,
    expect: true,
    info: 'sendFile sends deflate compressed buffer when accepted',
  },

  {
    fn: () => {
      const req = createMockReq({ [ACCEPT_ENCODING]: 'deflate' })
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        deflate: testDeflateBuffer,
        mime: 'text/plain',
      }

      sendFile(req, res, { file })

      return res.headers[CONTENT_ENCODING]
    },
    before,
    expect: 'deflate',
    info: 'sendFile sets content-encoding header for deflate',
  },

  {
    fn: () => {
      const req = createMockReq({ [ACCEPT_ENCODING]: 'gzip' })
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        mime: 'text/plain',
        // No gzip property
      }

      sendFile(req, res, { file })

      return res.body.equals(testBuffer)
    },
    before,
    expect: true,
    info: 'sendFile falls back to buffer when compressed version not available',
  },

  {
    fn: () => {
      const req = createMockReq({ [ACCEPT_ENCODING]: 'gzip' })
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        mime: 'text/plain',
      }

      sendFile(req, res, { file })

      return res.headers[CONTENT_ENCODING]
    },
    before,
    expect: 'identity',
    info: 'sendFile does not set content-encoding when sending uncompressed buffer',
  },

  {
    fn: () => {
      const req = createMockReq()
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        mime: 'text/plain',
      }
      const customHeaders = {
        'x-custom-header': 'custom-value',
        'x-another': 'value',
      }

      sendFile(req, res, { file, headers: customHeaders })

      return res.headers['x-custom-header']
    },
    before,
    expect: 'custom-value',
    info: 'sendFile includes custom headers',
  },

  {
    fn: () => {
      const req = createMockReq()
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        mime: 'text/plain',
      }
      const customHeaders = {
        'x-custom-header': 'custom-value',
        'x-another': 'value',
      }

      sendFile(req, res, { file, headers: customHeaders })

      return res.headers['x-another']
    },
    before,
    expect: 'value',
    info: 'sendFile includes custom headers',
  },

  {
    fn: () => {
      const req = createMockReq()
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        mime: 'text/plain',
      }

      sendFile(req, res, { file, type: 'custom' })

      return res.finished
    },
    before,
    expect: true,
    info: 'sendFile accepts custom type parameter',
  },

  {
    fn: () => {
      const req = createMockReq({ [ACCEPT_ENCODING]: 'gzip, deflate, br' })
      const res = createMockRes()
      const file = {
        buffer: testBuffer,
        br: testBrBuffer,
        gzip: testGzipBuffer,
        deflate: testDeflateBuffer,
        mime: 'text/plain',
      }

      sendFile(req, res, { file })

      // Should prioritize br (brotli) based on getFileEncoding logic
      return res.body.equals(testBrBuffer) && res.headers[CONTENT_ENCODING] === 'br'
    },
    before,
    expect: true,
    info: 'sendFile prioritizes best encoding when multiple accepted',
  },
]

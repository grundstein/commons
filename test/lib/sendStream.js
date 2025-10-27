import { fs, is, tryCatch } from '@magic/test'
import { join } from 'node:path'
import { Writable } from 'node:stream'

import { sendStream } from '../../src/lib/sendStream.js'
import constants from '@magic/http1-constants'

const { RANGE, CONTENT_RANGE, CONTENT_TYPE } = constants.headers

const testDir = join(process.cwd(), 'test', '.sendstream-test-tmp')
const testFile = join(testDir, 'test-stream.txt')
const testContent = 'Hello World! This is test content for streaming.'

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
    this.body = ''
    this.closeCallback = null
  }

  writeHead(code, headers) {
    this.statusCode = code
    this.headers = headers
  }

  end(data) {
    if (data) this.body = data
    this.emit('finish')
  }

  _write(_chunk, _encoding, callback) {
    callback()
  }

  triggerClose() {
    if (this.closeCallback) {
      this.closeCallback()
    }
    this.emit('close')
  }

  on(event, callback) {
    if (event === 'close') {
      this.closeCallback = callback
    }
    return super.on(event, callback)
  }
}

const createMockRes = () => new MockResponse()

export default [
  {
    fn: tryCatch(sendStream),
    expect: is.error,
    info: 'sendStream without arguments throws',
  },

  {
    fn: () => {
      const req = { headers: {} }
      const res = createMockRes()
      const file = {
        path: testFile,
        size: testContent.length,
        mime: 'text/plain',
      }

      sendStream(req, res, { file })

      return res.statusCode === 200
    },
    before,
    expect: true,
    info: 'sendStream sends file with 200 status when no range header',
  },

  {
    fn: () => {
      const req = { headers: {} }
      const res = createMockRes()
      const file = {
        path: testFile,
        size: testContent.length,
        mime: 'text/plain',
      }
      const headers = { 'x-custom': 'value' }

      sendStream(req, res, { file, headers })

      return res.headers['x-custom'] === 'value'
    },
    before,
    expect: true,
    info: 'sendStream includes custom headers',
  },

  {
    fn: () => {
      const req = { headers: { [RANGE]: 'bytes=0-10' } }
      const res = createMockRes()
      const file = {
        path: testFile,
        size: testContent.length,
        mime: 'text/plain',
      }

      sendStream(req, res, { file })

      return res.statusCode === 206
    },
    before,
    expect: true,
    info: 'sendStream handles range request with 206 status',
  },

  {
    fn: () => {
      const req = { headers: { [RANGE]: 'bytes=0-10' } }
      const res = createMockRes()
      const file = {
        path: testFile,
        size: testContent.length,
        mime: 'text/plain',
      }

      sendStream(req, res, { file })

      return res.headers[CONTENT_RANGE] === `bytes 0-10/${testContent.length}`
    },
    before,
    expect: true,
    info: 'sendStream sets correct content-range header',
  },

  {
    fn: () => {
      const req = { headers: { [RANGE]: 'bytes=5-' } }
      const res = createMockRes()
      const file = {
        path: testFile,
        size: testContent.length,
        mime: 'text/plain',
      }

      sendStream(req, res, { file })

      return (
        res.headers[CONTENT_RANGE] === `bytes 5-${testContent.length - 1}/${testContent.length}`
      )
    },
    before,
    expect: true,
    info: 'sendStream handles open-ended range request',
  },

  {
    fn: () => {
      const req = { headers: { [RANGE]: `bytes=${testContent.length + 100}-` } }
      const res = createMockRes()
      const file = {
        path: testFile,
        size: testContent.length,
        mime: 'text/plain',
      }

      sendStream(req, res, { file })

      return res.statusCode === 416
    },
    before,
    expect: true,
    info: 'sendStream returns 416 for range beyond file size',
  },

  {
    fn: () => {
      const req = { headers: { [RANGE]: `bytes=${testContent.length + 100}-` } }
      const res = createMockRes()
      const file = {
        path: testFile,
        size: testContent.length,
        mime: 'text/plain',
      }

      sendStream(req, res, { file })

      return res.body.includes('Requested range not satisfiable')
    },
    before,
    expect: true,
    info: 'sendStream sends error message for invalid range',
  },

  {
    fn: () => {
      const req = { headers: { [RANGE]: `bytes=${testContent.length + 100}-` } }
      const res = createMockRes()
      const file = {
        path: testFile,
        size: testContent.length,
        mime: 'text/plain',
      }

      sendStream(req, res, { file })

      return res.headers[CONTENT_TYPE] === 'text/plain'
    },
    before,
    expect: true,
    info: 'sendStream sets content-type for error response',
  },

  {
    fn: async () => {
      return new Promise(resolve => {
        const req = { headers: {} }
        const res = createMockRes()
        const file = {
          path: testFile,
          size: testContent.length,
          mime: 'text/plain',
        }

        sendStream(req, res, { file })

        // Trigger close after a short delay to allow stream to pipe
        setTimeout(() => {
          res.triggerClose()
          resolve(res.closeCallback !== null)
        }, 50)
      })
    },
    before,
    expect: true,
    info: 'sendStream registers and executes close event handler',
  },
]

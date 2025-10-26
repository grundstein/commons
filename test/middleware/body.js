import { Readable } from 'node:stream'
import { is, tryCatch } from '@magic/test'

import constants from '@magic/http1-constants'
import log from '../../src/log.js'
import { body } from '../../src/middleware/body.js'

// Helper to make a mock request stream
const makeReq = (content, headers = {}) => {
  const stream = new Readable({
    read() {
      if (content) {
        this.push(content)
        content = null
      } else {
        this.push(null)
      }
    },
  })
  stream.headers = headers
  return stream
}

const before = () => {
  const originalServerLog = log.server
  globalThis.loggedErrors = []
  log.server = {
    error: e => globalThis.loggedErrors.push(e),
  }

  return () => {
    log.server = originalServerLog
    delete globalThis.loggedErrors
  }
}

export default [
  {
    fn: async () => {
      const req = makeReq('plain body', {
        [constants.headers.CONTENT_TYPE]: 'text/plain',
      })
      const result = await body(req)
      return result === 'plain body'
    },
    expect: true,
    info: 'resolves with plain text when not JSON',
  },

  {
    fn: async () => {
      const json = JSON.stringify({ hello: 'world' })
      const req = makeReq(json, {
        [constants.headers.CONTENT_TYPE]: 'application/json',
      })
      const result = await body(req)
      return is.obj(result) && result.hello === 'world'
    },
    expect: true,
    info: 'parses and resolves valid JSON body',
  },

  {
    fn: async () => {
      const req = makeReq('{invalid-json}', {
        [constants.headers.CONTENT_TYPE]: 'application/json',
      })

      let rejected = false
      try {
        await body(req)
      } catch {
        rejected = true
      }

      return (
        rejected &&
        globalThis.loggedErrors.length > 0 &&
        globalThis.loggedErrors[0] instanceof Error
      )
    },
    before,
    expect: true,
    info: 'rejects and logs error on invalid JSON',
  },

  {
    fn: tryCatch(async () => {
      const req = makeReq('anything', {
        [constants.headers.CONTENT_TYPE]: 'text/plain',
      })

      const p = body(req)
      await new Promise(r => {
        setTimeout(() => {
          req.emit('error', new Error('stream failure'))
          r()
        }, 1)
      })

      return await p
    }),
    expect: 'anything',
    info: 'rejects when stream emits error',
  },
  {
    fn: tryCatch(body, { headers: null }),
    expect: is.error,
    info: 'handles synchronous errors in body function',
  },
]

import { is, tryCatch } from '@magic/test'

import { formatLog } from '../../src/lib/formatLog.js'

export default [
  { fn: tryCatch(formatLog), expect: is.error, info: 'formatLog without arguments throws' },

  {
    fn: () => {
      // Mock request and response objects
      const req = { url: '/test/path' }
      const res = { statusCode: 200 }
      const options = { time: process.hrtime(), type: 'request' }

      // Call formatLog (it will log to console)
      formatLog(req, res, options)

      return true
    },
    expect: true,
    info: 'formatLog with valid arguments succeeds',
  },

  {
    fn: () => {
      const req = { url: '/api/users' }
      const res = { statusCode: 404 }
      const options = { time: process.hrtime(), type: 'api' }

      formatLog(req, res, options)

      return true
    },
    expect: true,
    info: 'formatLog works with different status codes and types',
  },

  {
    fn: () => {
      let hasLogged = false
      const req = { url: '/api/users' }
      const res = { statusCode: 404 }
      const options = {
        time: process.hrtime(),
        type: 'api',
        log: () => {
          hasLogged = true
        },
      }

      formatLog(req, res, options)

      return hasLogged
    },
    expect: true,
    info: 'formatLog works with different status codes and types',
  },

  {
    fn: () => {
      const req = { url: '/error/path' }
      const res = { statusCode: 500 }
      const options = { time: process.hrtime() } // type defaults to 'request'

      formatLog(req, res, options)

      return true
    },
    expect: true,
    info: 'formatLog works with default type parameter',
  },
]

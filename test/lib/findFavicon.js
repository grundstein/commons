import http2 from 'node:http2'
import fs from '@magic/fs'
import { tryCatch } from '@magic/test'

import { findFavicon } from '../../src/lib/findFavicon.js'

const { constants } = http2

export default [
  {
    fn: async () => {
      const result = await findFavicon()

      return (
        result &&
        result.code === 200 &&
        result.body.toString() === 'favicon-content' &&
        result.headers[constants.HTTP2_HEADER_CONTENT_TYPE] === 'image/vnd.microsoft.icon'
      )
    },
    before: () => {
      const originalReadFile = fs.readFile

      fs.readFile = async filepath => {
        if (filepath.includes('src/favicon.ico')) {
          return Buffer.from('favicon-content')
        }
        const err = new Error('ENOENT')
        err.code = 'ENOENT'
        throw err
      }

      return () => {
        fs.readFile = originalReadFile
      }
    },
    expect: true,
    info: 'findFavicon finds favicon in src root',
  },
  {
    fn: async () => {
      const result = await findFavicon()

      return (
        result &&
        result.code === 200 &&
        result.body.toString() === 'static-favicon' &&
        globalThis.checkCount >= 2
      )
    },
    before: () => {
      const originalReadFile = fs.readFile
      globalThis.checkCount = 0

      fs.readFile = async filepath => {
        globalThis.checkCount++
        if (filepath.includes('src/static/favicon.ico')) {
          return Buffer.from('static-favicon')
        }
        const err = new Error('ENOENT')
        err.code = 'ENOENT'
        throw err
      }

      return () => {
        fs.readFile = originalReadFile

        delete globalThis.checkCount
      }
    },
    expect: true,
    info: 'findFavicon finds favicon in static folder',
  },
  {
    fn: async () => {
      const result = await findFavicon()

      return (
        result &&
        result.code === 200 &&
        result.body.toString() === 'assets-favicon' &&
        globalThis.checkCount >= 3
      ) // Should have checked at least 3 paths
    },
    before: () => {
      const originalReadFile = fs.readFile
      globalThis.checkCount = 0

      fs.readFile = async filepath => {
        globalThis.checkCount++
        if (filepath.includes('assets/static/favicon.ico')) {
          return Buffer.from('assets-favicon')
        }
        const err = new Error('ENOENT')
        err.code = 'ENOENT'
        throw err
      }

      return () => {
        fs.readFile = originalReadFile
        delete globalThis.checkCount
      }
    },
    expect: true,
    info: 'findFavicon finds favicon in assets/static folder',
  },
  {
    fn: async () => {
      const result = await findFavicon()

      return result === false
    },
    before: () => {
      const originalReadFile = fs.readFile

      fs.readFile = async () => {
        const err = new Error('ENOENT')
        err.code = 'ENOENT'
        throw err
      }

      return () => {
        fs.readFile = originalReadFile
      }
    },
    expect: true,
    info: 'findFavicon returns false when no favicon found',
  },
  {
    fn: tryCatch(findFavicon),
    expect: t => t.code === 'EACCESS',
    before: () => {
      const originalReadFile = fs.readFile

      fs.readFile = async () => {
        const err = new Error('Permission denied')
        err.code = 'EACCESS'
        throw err
      }

      return () => {
        fs.readFile = originalReadFile
      }
    },
    info: 'findFavicon throws non-ENOENT errors',
  },
  {
    fn: async () => {
      const result = await findFavicon()

      return result && globalThis.readCount === 1
    },
    before: () => {
      const originalReadFile = fs.readFile
      globalThis.readCount = 0

      fs.readFile = async filepath => {
        globalThis.readCount++
        // Return favicon on first path
        if (filepath.includes('src/favicon.ico')) {
          return Buffer.from('first-favicon')
        }
        // This shouldn't be reached
        return Buffer.from('should-not-reach')
      }

      return () => {
        fs.readFile = originalReadFile
        delete globalThis.readCount
      }
    },
    expect: true,
    info: 'findFavicon breaks loop after finding favicon',
  },
]

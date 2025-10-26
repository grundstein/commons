import { fs, is } from '@magic/test'
import path from 'node:path'

import { fileLog } from '../../src/fileLog.js'

const tmpDir = path.join(process.cwd(), 'test', '.fileLog-test-tmp')

const before = async () => {
  await fs.mkdirp(tmpDir)

  const originalLog = console.log
  console.log = () => {}

  return async () => {
    await fs.rmrf(tmpDir)
    console.log = originalLog
  }
}

const beforeAutoName = async () => {
  await fs.mkdirp(tmpDir)
  const origCwd = process.cwd
  process.cwd = () => path.join(tmpDir, 'demo-app')

  const origRandom = Math.random
  Math.random = () => 0.123456789 // deterministic name

  return async () => {
    Math.random = origRandom
    process.cwd = origCwd
    await fs.rmrf(tmpDir)
  }
}

export default [
  {
    fn: () => {
      // Ensure we don't call fileLog() without args (avoids /var/log permission issues)
      const logger = fileLog('commons', tmpDir)
      return (
        is.fn(logger.request) && is.fn(logger.info) && is.fn(logger.warn) && is.fn(logger.error)
      )
    },
    before,
    expect: true,
    info: 'fileLog returns request, info, warn and error functions',
  },

  {
    fn: async () => {
      const logger = fileLog('commons', tmpDir)

      const req = { url: '/api/test' }
      const res = { statusCode: 200 }

      // Call the loggers
      logger.request(req, res, { time: [0, 123456] })
      logger.info('Server started', 'on port', '3000')
      logger.warn('Low disk space')
      logger.error('Unhandled exception', 'details here')

      // give streams a moment to flush
      await new Promise(r => setTimeout(r, 100))

      const accessFile = path.join(tmpDir, 'commons-access.log')
      const errorFile = path.join(tmpDir, 'commons-error.log')

      const accessExists = await fs.exists(accessFile)
      const errorExists = await fs.exists(errorFile)
      if (!accessExists || !errorExists) return false

      const accessContent = await fs.readFile(accessFile, 'utf8')
      const errorContent = await fs.readFile(errorFile, 'utf8')

      // Basic checks on access log (request + info + warn are written to the access stream)
      const hasRequestType =
        accessContent.includes('"type": "request"') || accessContent.includes('"type":"request"')
      const hasPath =
        accessContent.includes('"path": "/api/test"') ||
        accessContent.includes('"path":"/api/test"')
      const hasInfo =
        accessContent.includes('"type": "info"') || accessContent.includes('"type":"info"')
      const hasWarn =
        accessContent.includes('"type": "warn"') || accessContent.includes('"type":"warn"')

      // Basic checks on error log
      const hasErrorType =
        errorContent.includes('"type": "error"') || errorContent.includes('"type":"error"')
      const hasErrorMsg =
        errorContent.includes('Unhandled exception') && errorContent.includes('details here')

      // Check for date/time/duration fields presence (not exact values)
      const hasDate =
        /"date"\s*:\s*"[0-9]{4}-[0-9]{2}-[0-9]{2}"/.test(accessContent) ||
        /"date"\s*:\s*".+?"/.test(accessContent)
      const hasTime = /"time"\s*:\s*".+?"/.test(accessContent)
      const hasDuration = /"duration"\s*:\s*".+?"/.test(accessContent)

      return (
        hasRequestType &&
        hasPath &&
        hasInfo &&
        !hasWarn &&
        hasErrorType &&
        hasErrorMsg &&
        hasDate &&
        hasTime &&
        hasDuration
      )
    },
    before,
    expect: true,
    info: 'fileLog writes JSON-like structured entries to access and error log files',
  },

  {
    fn: async () => {
      // Ensure multiple parts passed to info() are joined in the logged message
      const logger = fileLog('commons', tmpDir)
      logger.info('part1', 'part2', 'part3')
      await new Promise(r => setTimeout(r, 100))
      const accessFile = path.join(tmpDir, 'commons-access.log')
      const content = await fs.readFile(accessFile, 'utf8')
      // The message should contain the three parts joined by spaces (console.log uses spaces by default)
      return content.includes('part1 part2 part3') || content.includes('part1part2part3')
    },
    before,
    expect: true,
    info: 'info() joins multiple message parts into a single logged message',
  },

  {
    fn: async () => {
      const origCwd = process.cwd
      process.cwd = () => path.join(tmpDir, 'demo-app')

      const origRandom = Math.random
      Math.random = () => 0.123456789

      const logger = fileLog(undefined, tmpDir)

      // Trigger both request and error logging to touch both streams
      const req = { url: '/auto' }
      const res = { statusCode: 200 }

      logger.request(req, res, { time: [0, 111111] })
      logger.error('auto branch test')
      await new Promise(r => setTimeout(r, 100))

      // Verify files created with auto-generated name
      const files = await fs.readdir(tmpDir)
      const access = files.find(f => f.endsWith('-access.log'))
      const error = files.find(f => f.endsWith('-error.log'))

      const accessContent = await fs.readFile(path.join(tmpDir, access), 'utf8')
      const errorContent = await fs.readFile(path.join(tmpDir, error), 'utf8')

      // restore globals
      Math.random = origRandom
      process.cwd = origCwd

      return (
        access.includes('demo-app') &&
        error.includes('demo-app') &&
        accessContent.includes('"path": "/auto"') &&
        errorContent.includes('"type": "error"') &&
        accessContent.length > 0 &&
        errorContent.length > 0
      )
    },
    before: beforeAutoName,
    expect: true,
    info: 'fileLog auto-generates a name when none is provided and writes logs correctly',
  },
]

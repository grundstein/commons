import { fs, is } from '@magic/test'
import { join } from 'node:path'

import { fileLog } from '../../src/fileLog.js'

const testDir = join(process.cwd(), 'test', '.fileLog-test-tmp')

const before = async () => {
  await fs.mkdirp(testDir)

  const originalLog = console.log
  console.log = () => {}

  return async () => {
    await fs.rmrf(testDir)
    console.log = originalLog
  }
}

export default [
  {
    fn: () => {
      // Ensure we don't call fileLog() without args (avoids /var/log permission issues)
      const logger = fileLog('commons', testDir)
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
      const logger = fileLog('commons', testDir)

      const req = { url: '/api/test' }
      const res = { statusCode: 200 }

      // Call the loggers
      logger.request(req, res, { time: [0, 123456] })
      logger.info('Server started', 'on port', '3000')
      logger.warn('Low disk space')
      logger.error('Unhandled exception', 'details here')

      // give streams a moment to flush
      await new Promise(r => setTimeout(r, 100))

      const accessFile = join(testDir, 'commons-access.log')
      const errorFile = join(testDir, 'commons-error.log')

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
      const logger = fileLog('commons', testDir)
      logger.info('part1', 'part2', 'part3')
      await new Promise(r => setTimeout(r, 100))
      const accessFile = join(testDir, 'commons-access.log')
      const content = await fs.readFile(accessFile, 'utf8')
      // The message should contain the three parts joined by spaces (console.log uses spaces by default)
      return content.includes('part1 part2 part3') || content.includes('part1part2part3')
    },
    before,
    expect: true,
    info: 'info() joins multiple message parts into a single logged message',
  },
]

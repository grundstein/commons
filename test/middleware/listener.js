import log from '../../src/log.js'
import { listener } from '../../src/middleware/listener.js'

// Mock getRequestDuration to return a fixed value
const before = () => {
  // Spy for log.server.info
  globalThis.loggedMessages = []
  const originalLogInfo = log.server.info
  log.server.info = (...msgs) => globalThis.loggedMessages.push(msgs)
  return () => {
    // Restore originals after tests
    log.server.info = originalLogInfo
  }
}

export default [
  {
    fn: () => {
      globalThis.loggedMessages = []

      const startTime = [0, 0]
      const host = 'localhost'
      const port = 8080

      const fn = listener({ startTime, host, port })
      fn() // invoke listener

      const called = globalThis.loggedMessages.length === 1
      const args = globalThis.loggedMessages[0]

      return (
        called &&
        args.includes('Pid:') &&
        args.includes(process.pid) &&
        args.includes(`Listening to`) &&
        args.includes(`${host}:${port}`) &&
        args.includes('Startup needed:')
      )
    },
    before,
    expect: true,
    info: 'listener logs server startup info with correct arguments',
  },
]

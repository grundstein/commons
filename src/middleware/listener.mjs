import { log } from '../log.mjs'

export const listener = startTime => () => {
  log.success('Mainthread started', `pid: ${process.pid}`)
  log(`server listening to ${host}:${port}`)
  log.timeTaken(startTime, 'startup needed:')
}

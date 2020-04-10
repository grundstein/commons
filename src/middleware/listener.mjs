import { log } from '../log.mjs'

export const listener = ({ startTime, host, port }) => () => {
  log.success('Mainthread started', `pid: ${process.pid}`)
  log(`server listening to ${host}:${port}`)

  log.timeTaken(startTime, 'startup needed:')
}

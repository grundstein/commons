import log from '../log.mjs'

import { getRequestDuration } from '../lib/getRequestDuration.mjs'

export const listener = ({ startTime, host, port }) => () => {
  log.server.info(
    'Pid:',
    process.pid,
    'Listening to',
    `${host}:${port}`,
    'Startup needed:',
    getRequestDuration(startTime),
  )
}

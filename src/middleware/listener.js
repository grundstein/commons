import log from '../log.js'

import { getRequestDuration } from '../lib/getRequestDuration.js'

export const listener =
  ({ startTime, host, port }) =>
  () => {
    log.server.info(
      'Pid:',
      process.pid,
      'Listening to',
      `${host}:${port}`,
      'Startup needed:',
      getRequestDuration(startTime),
    )
  }

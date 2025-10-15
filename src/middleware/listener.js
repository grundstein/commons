import log from '../log.js'

import { getRequestDuration } from '../lib/getRequestDuration.js'

/**
 *
 * @param {object} args
 * @param {ReturnType<typeof process.hrtime>} args.startTime
 * @param {string} args.host
 * @param {number} args.port
 */
export const listener =
  ({ startTime, host, port }) =>
  () => {
    log.server.info(
      'Pid:',
      `${process.pid}`,
      'Listening to',
      `${host}:${port}`,
      'Startup needed:',
      getRequestDuration(startTime),
    )
  }

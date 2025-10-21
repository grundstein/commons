import log from '../log.js'

import { getRequestDuration } from '../lib/getRequestDuration.js'

/**
 * @typedef {Object} ListenerConfig
 * @property {[number, number]} startTime - Server start time
 * @property {string} host - Server host
 * @property {number} port - Server port
 */

/**
 * Creates a listener function for server startup
 * @param {ListenerConfig} config - Listener configuration
 * @returns {() => void}
 */
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

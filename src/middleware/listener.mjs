import log from '../log.mjs'

import { getRequestDuration } from '../lib/index.mjs'

export const listener = ({ startTime, host, port }) => () => {
  log.server.info(
    'Mainthread pid:',
    process.pid,
    '. listening to ',
    host,
    ':',
    port,
    '. startup needed: ',
    getRequestDuration(startTime),
  )
}

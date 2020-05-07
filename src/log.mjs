import log from '@magic/log'

import { formatLog } from './lib/formatLog.mjs'

log.request = formatLog

export default log

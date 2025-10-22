import { is, tryCatch } from '@magic/test'

import { getRequestDuration } from '../../src/lib/getRequestDuration.js'

export default [
  {
    fn: getRequestDuration(),
    expect: t => t.endsWith('s'),
    info: 'getRequestDuration without arguments returns a string ending with s',
  },
  {
    fn: getRequestDuration(process.hrtime()),
    expect: t => t.endsWith('ns'),
    info: 'getRequestDuration(process.hrtime()) returns nanoseconds',
  },
  {
    fn: () => {
      const hrtime = process.hrtime()
      hrtime[1] -= 20500
      return getRequestDuration(hrtime)
    },
    expect: t => t.endsWith('ms'),
    info: 'getRequestDuration(process.hrtime()) returns milliseconds',
  },
  {
    fn: tryCatch(getRequestDuration, new Date().getTime()),
    expect: is.error,
    info: 'getRequestDuration with number as argument errors',
  },
]

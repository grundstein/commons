import { is } from '@magic/test'

import { getRequestDuration } from '../../src/lib/getRequestDuration.mjs'

export default [
  {
    fn: getRequestDuration(),
    expect: is.str,
    info: 'getRequestDuration returns a string',
  },
  {
    fn: getRequestDuration(),
    expect: t => t.endsWith('s'),
    info: 'getRequestDuration returns a string that ends with s(seconds, ms or ns)',
  },
  {
    fn: getRequestDuration(process.hrtime()),
    expect: t => t.endsWith('ns'),
    info: 'getRequestDuration with current hrtime returns 0.9 to 1.1 nanoseconds',
  },

  {
    fn: () => {
      const oneSecondAgo = process.hrtime()
      oneSecondAgo[0] -= 1000
      return getRequestDuration(oneSecondAgo)
    },
    expect: t => t.endsWith('s') && t === '1s',
    info: 'getRequestDuration with hrtime -1000 returns 1s',
  },
  {
    fn: () => {
      const ago = process.hrtime()
      ago[0] -= 0.5
      return getRequestDuration(ago)
    },
    expect: t => t.endsWith('ms') && t === '500ms',
    info: 'getRequestDuration with hrtime 0.5 seconds ago returns milliseconds',
  },
]

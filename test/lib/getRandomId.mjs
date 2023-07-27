import { is } from '@magic/test'

import { getRandomId } from '../../src/lib/getRandomId.mjs'

export default [
  { fn: getRandomId, expect: is.str },
  { fn: getRandomId, expect: is.len.eq(24) },
]

import { is, tryCatch } from '@magic/test'
import { respond } from '../../src/lib/respond.js'

export default [
  { fn: tryCatch(respond), expect: is.error, info: 'respond without arguments throws' },
]

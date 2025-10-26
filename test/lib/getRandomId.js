import log from '../../src/log.js'

import { is } from '@magic/test'
import { getRandomId } from '../../src/lib/getRandomId.js'

const randomBytesMockWithError = (_num, cb) => {
  const err = new Error('testing')

  cb(err)
}

const randomBytesMockWithoutBuffer = (_num, cb) => {
  cb(undefined, undefined)
}

const before = () => {
  const originalErrorLog = log.server.error

  log.server.error = () => {}

  return () => {
    log.server.error = originalErrorLog
  }
}

export default [
  { fn: getRandomId(), expect: is.string, info: 'getRandomId returns a string' },
  { fn: getRandomId(), expect: is.len.eq(24), info: 'getRandomId returns a string with length 24' },
  {
    fn: getRandomId(12),
    expect: is.str,
    info: 'getRandomId without crypto.randomBytes returns a string',
  },
  {
    fn: getRandomId(12),
    expect: is.len.eq(24),
    info: 'getRandomId without crypto.randomBytes returns a string with length 24',
  },
  {
    fn: () => getRandomId(12, randomBytesMockWithError),
    expect: is.string,
    before,
    info: 'if randomBytes fails, we still get a pseudorandom value',
  },
  {
    fn: () => getRandomId(12, randomBytesMockWithError),
    expect: is.len.eq(24),
    before,
    info: 'if randomBytes fails, we still get a pseudorandom value',
  },
  {
    fn: () => getRandomId(12, randomBytesMockWithoutBuffer),
    expect: is.string,
    before,
    info: 'if randomBytes does not return a buffer, we still get a pseudorandom value',
  },
  {
    fn: () => getRandomId(12, randomBytesMockWithoutBuffer),
    expect: is.len.eq(24),
    before,
    info: 'if randomBytes does not return a buffer, we still get a pseudorandom value',
  },
]

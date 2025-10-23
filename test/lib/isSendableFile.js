import { is } from '@magic/test'

import { isSendableFile } from '../../src/lib/isSendableFile.js'

export default [
  {
    fn: isSendableFile(),
    expect: false,
    info: 'isSendableFile called without argument returns false',
  },
  {
    fn: isSendableFile({ buffer: 'has a buffer' }),
    info: 'isSendableFile called with buffer object returns true',
  },
  {
    fn: isSendableFile({ nobufferkey: 'has a buffer' }),
    expect: false,
    info: 'isSendableFile called with object without buffer key returns false',
  },
]

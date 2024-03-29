import path from 'path'

import { fs, is } from '@magic/test'

import { etags } from '../../src/lib/etags.mjs'

const indexHtmlPath = path.join(process.cwd(), 'src', 'index.mjs')
const stat = await fs.statSync(indexHtmlPath)
const indexHtmlExpect = (stat.size + stat.mtimeMs).toString(36)

export default [
  { fn: etags(), expect: is.fn, info: 'returns a function when called with empty argument' },
  {
    fn: async () => {
      const e = await etags('public')
      return e({ file: 'src/index.mjs', stat })
    },
    expect: indexHtmlExpect,
    info: 'returns a function when called with empty argument',
  },
]

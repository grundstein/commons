import path from 'node:path'
import { fs } from '@magic/test'

import { getProxies } from '../../src/lib/getProxies.js'

const proxyDir = path.join(process.cwd(), 'test', '.fixtures')
const proxyFile = path.join(proxyDir, 'proxies')

const proxyFileContent = 'proxy1\nproxy2\n\nproxy3'

export default [
  { fn: getProxies(), expect: [], info: 'getProxies without arguments returns []' },
  {
    fn: getProxies({ proxyFile }),
    expect: [],
    info: 'getProxies with non-existant proxy file returns []',
  },
  {
    fn: () => getProxies({ proxyFile }),
    expect: ['proxy1', 'proxy2', 'proxy3'],
    info: 'if proxyfile exists, return proxies as an array.',
    before: async () => {
      await fs.mkdirp(proxyDir)

      await fs.writeFile(proxyFile, proxyFileContent)

      return async () => {
        await fs.rmrf(proxyDir)
      }
    },
  },
]

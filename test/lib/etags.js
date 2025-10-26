import path from 'path'
import { fs, is } from '@magic/test'

import { getEtagKeyFromFilePath, getEtag, etags } from '../../src/lib/etags.js'

const tmpDir = path.join(process.cwd(), 'test', '.etags-tmp')

// Ensure temp dir exists and cleanup after
const before =
  (create = false) =>
  async () => {
    await fs.mkdirp(tmpDir)

    if (create) {
      const etagFile = path.join(tmpDir, 'etags.csv')
      const csvContent = 'file1.txt,etag1\nfile2.txt,etag2\n'
      await fs.writeFile(etagFile, csvContent)
    }

    return async () => {
      await fs.rmrf(tmpDir)
    }
  }

export default [
  {
    fn: () => {
      const dir = '/some/dir'
      const file = '/some/dir/file.txt'
      return getEtagKeyFromFilePath({ dir, file })
    },
    expect: 'file.txt',
    info: 'getEtagKeyFromFilePath returns file path without directory prefix',
  },

  {
    fn: () => {
      const dir = '/some/dir'
      const file = '/some/dir/file.txt.gz'
      return getEtagKeyFromFilePath({ dir, file })
    },
    expect: 'file.txt',
    info: 'getEtagKeyFromFilePath removes .gz extension when present',
  },

  {
    fn: () => {
      const stat = { size: 100, mtimeMs: 200 }
      const cache = {}
      const generator = getEtag({ dir: '/some/dir', cache })
      const result = generator({ file: '/some/dir/test.txt', stat })

      // Should generate base36 string and cache it
      return (
        typeof result === 'string' &&
        cache['test.txt'] === result &&
        result === (stat.size + stat.mtimeMs).toString(36)
      )
    },
    expect: true,
    info: 'getEtag generates and caches new etag values',
  },

  {
    fn: () => {
      const stat = { size: 100, mtimeMs: 200 }
      const cache = { 'test.txt': 'cachedetag' }
      const generator = getEtag({ dir: '/some/dir', cache })
      const result = generator({ file: '/some/dir/test.txt', stat })
      return result === 'cachedetag'
    },
    expect: true,
    info: 'getEtag returns cached value when present',
  },

  {
    fn: async () => {
      const fn = await etags()
      return is.fn(fn)
    },
    expect: true,
    info: 'etags() without dir returns a function',
  },

  {
    fn: async () => {
      const generator = await etags(tmpDir)

      // Should use the cache loaded from etags.csv
      const key = 'file1.txt'
      const stat = { size: 123, mtimeMs: 456 }
      const result = generator({ file: path.join(tmpDir, key), stat })
      // Confirm it used cached value
      return result === 'etag1'
    },
    before: before(true),
    expect: true,
    info: 'etags() loads cache from etags.csv when file exists',
  },

  {
    fn: async () => {
      const generator = await etags(tmpDir)
      const stat = { size: 10, mtimeMs: 20 }
      const result = generator({ file: path.join(tmpDir, 'newfile.txt'), stat })
      return typeof result === 'string'
    },
    before: before(false),
    expect: true,
    info: 'etags() creates new cache entry when no etags.csv exists',
  },
]

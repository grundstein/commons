import path from 'path'
import { fs, is } from '@magic/test'

import { getEtagKeyFromFilePath, getEtag, etags } from '../../src/lib/etags.js'

const tmpDir = path.join(process.cwd(), 'test-tmp', 'etags')

// Ensure temp dir exists and cleanup after
const before = async () => {
  await fs.mkdirp(tmpDir)
  return async () => {
    await fs.rmrf(tmpDir)
  }
}

export default [
  // --- getEtagKeyFromFilePath tests ---
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

  // --- getEtag tests ---
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

  // --- etags() tests ---
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
      // Prepare etags.csv
      const etagFile = path.join(tmpDir, 'etags.csv')
      const csvContent = 'file1.txt,etag1\nfile2.txt,etag2\n'
      await fs.writeFile(etagFile, csvContent)

      const generator = await etags(tmpDir)
      // Should use the cache loaded from etags.csv
      const key = 'file1.txt'
      const stat = { size: 123, mtimeMs: 456 }
      const result = generator({ file: path.join(tmpDir, key), stat })
      // Confirm it used cached value
      return result === 'etag1'
    },
    before,
    expect: true,
    info: 'etags() loads cache from etags.csv when file exists',
  },

  {
    fn: async () => {
      // Ensure no etags.csv file exists
      await fs.rmrf(tmpDir)
      await fs.mkdirp(tmpDir)
      const generator = await etags(tmpDir)
      const stat = { size: 10, mtimeMs: 20 }
      const result = generator({ file: path.join(tmpDir, 'newfile.txt'), stat })
      return typeof result === 'string'
    },
    before,
    expect: true,
    info: 'etags() creates new cache entry when no etags.csv exists',
  },
]

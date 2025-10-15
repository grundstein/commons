import path from 'path'
import { fs } from '@magic/fs'

/**
 * @typedef {Object} FileStat
 * @property {number} size
 * @property {number} mtimeMs
 */

/**
 * @typedef {Object} EtagOptions
 * @property {string} dir - Base directory
 * @property {Record<string, string>} [cache] - Optional cache object
 */

/**
 * @typedef {Object} FilePath
 * @property {string} file - Full file path
 * @property {FileStat} stat - File stat object
 */

/**
 * Get a key for ETag cache based on file path.
 *
 * @param {{ dir: string, file: string }} param0
 * @returns {string}
 */
export const getEtagKeyFromFilePath = ({ dir, file }) => {
  if (file.endsWith('.gz')) {
    file = file.substring(0, file.length - 3)
  }

  return file.replace(`${dir}/`, '')
}

/**
 * Returns a function that generates ETag for a file.
 *
 * @param {EtagOptions} param0
 * @returns {(arg: FilePath) => string}
 */
export const getEtag =
  ({ dir, cache = {} }) =>
  ({ file, stat }) => {
    const key = getEtagKeyFromFilePath({ dir, file })

    if (!cache[key]) {
      // this one function almost doubles response time
      cache[key] = (stat.size + stat.mtimeMs).toString(36)
    }

    return cache[key]
  }

/**
 * Create an ETag generator function from a directory.
 *
 * @param {string} dir
 * @returns {Promise<(arg: FilePath) => string>}
 */
export const etags = async dir => {
  /** @type {Record<string, string>} */
  let cache = {}

  if (dir) {
    const etagFile = path.join(dir, 'etags.csv')
    const exists = await fs.exists(etagFile)

    if (exists) {
      const contents = await fs.readFile(etagFile, 'utf8')
      const lines = contents.split('\n')

      // @ts-ignore: Object.fromEntries expects string[][], CSV parsing
      cache = Object.fromEntries(lines.map(line => line.split(',')))
    }
  }

  return getEtag({ dir, cache })
}

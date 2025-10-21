import path from 'path'

import { fs } from '@magic/fs'

/**
 * @typedef {import('fs').Stats} Stats
 */

/**
 * @typedef {Object} EtagFileInfo
 * @property {string} file - File path
 * @property {Stats} stat - File stats object
 */

/**
 * @typedef {Object} EtagConfig
 * @property {string} dir - Directory path
 * @property {Object.<string, string>} [cache={}] - ETag cache object
 */

/**
 * @typedef {Object} FilePathInfo
 * @property {string} dir - Directory path
 * @property {string} file - File path
 */

/**
 * Generates ETag key from file path by removing directory prefix and .gz extension
 * @param {FilePathInfo} params - File path information
 * @returns {string} ETag cache key
 */
export const getEtagKeyFromFilePath = ({ dir, file }) => {
  if (file.endsWith('.gz')) {
    file = file.substring(0, file.length - 3)
  }

  return file.replace(`${dir}/`, '')
}

/**
 * Creates an ETag generator function with caching
 * @param {EtagConfig} config - ETag configuration
 * @returns {function(EtagFileInfo): string} Function that generates ETags
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
 * Initializes ETag system with optional cache file
 * Reads existing ETags from etags.csv if available
 * @param {string} dir - Directory path for ETag cache file
 * @returns {Promise<function(EtagFileInfo): string>} ETag generator function
 */
export const etags = async dir => {
  /** @type {{[k: string]: string}} */
  let cache = {}

  if (dir) {
    const etagFile = path.join(dir, 'etags.csv')

    const exists = await fs.exists(etagFile)

    if (exists) {
      const contents = await fs.readFile(etagFile, 'utf8')

      const lines = contents.split('\n')
      cache = Object.fromEntries(lines.map(line => line.split(',')))
    }
  }

  return getEtag({ dir, cache })
}

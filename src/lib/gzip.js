import zlib from 'node:zlib'
import { promisify } from 'node:util'

const gzipAsync = promisify(zlib.gzip)

/**
 * Compress data using gzip
 * @param {string | Buffer} data - Data to compress
 * @param {object} options - Gzip options (optional)
 * @returns {Promise<Buffer>} Compressed data
 */
export const gzip = async (data, options = {}) => {
  try {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data)
    const compressed = await gzipAsync(buffer, options)
    return compressed
  } catch (e) {
    const err = /** @type {import('@magic/error').CustomError} */ (e)
    throw new Error(`Gzip compression failed: ${err.message}`)
  }
}

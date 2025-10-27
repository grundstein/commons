import zlib from 'node:zlib'
import { promisify } from 'node:util'

const brotliCompressAsync = promisify(zlib.brotliCompress)

/**
 * Compress data using brotli
 * @param {string | Buffer} data - Data to compress
 * @param {object} options - Brotli options (optional)
 * @returns {Promise<Buffer>} Compressed data
 */
export const brotli = async (data, options = {}) => {
  try {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data)
    const compressed = await brotliCompressAsync(buffer, options)
    return compressed
  } catch (e) {
    const err = /** @type {import('@magic/error').CustomError} */ (e)
    throw new Error(`Brotli compression failed: ${err.message}`)
  }
}

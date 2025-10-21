/**
 * @typedef {Object} EncodedFile
 * @property {Buffer} [br] - Brotli compressed buffer
 * @property {Buffer} [gzip] - Gzip compressed buffer
 * @property {Buffer} [deflate] - Deflate compressed buffer
 * @property {Buffer} buffer - Uncompressed buffer
 */

/**
 * Determines best file encoding based on Accept-Encoding header and available encodings
 * Priority: brotli (br) > gzip > deflate > buffer (uncompressed)
 * @param {EncodedFile} file - File object with various encoding buffers
 * @param {string} [acceptEncoding] - Accept-Encoding header value
 * @returns {'gzip' | 'br' | 'deflate' | 'buffer'} Best encoding to use ('br', 'gzip', 'deflate', or 'buffer')
 */
export const getFileEncoding = (file, acceptEncoding) => {
  /** @type {'gzip' | 'br' | 'deflate' | 'buffer'} */
  let encoding = 'buffer'

  if (acceptEncoding?.length) {
    if (acceptEncoding.includes('br') && file.br) {
      encoding = 'br'
    } else if (acceptEncoding.includes('gzip') && file.gzip) {
      encoding = 'gzip'
    } else if (acceptEncoding.includes('deflate') && file.deflate) {
      encoding = 'deflate'
    }
  }

  return encoding
}

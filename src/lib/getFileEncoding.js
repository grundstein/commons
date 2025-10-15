import is from '@magic/types'

/**
 * Determines which encoding to use for a file based on the client's accepted encodings.
 *
 * @param {import("./sendFile.js").FileDescriptor} file - Object containing possible encoded file variants
 * @param {string[] | string} [acceptEncoding=[]] - List of encodings the client supports
 * @returns {'buffer' | 'br' | 'gzip' | 'deflate'} The encoding to use
 */
export const getFileEncoding = (file, acceptEncoding = []) => {
  if (is.str(acceptEncoding)) {
    acceptEncoding = [acceptEncoding]
  }

  /** @type {'buffer' | 'br' | 'gzip' | 'deflate'} */
  let encoding = 'buffer'

  if (acceptEncoding.length) {
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

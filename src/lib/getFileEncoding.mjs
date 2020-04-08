export const getFileEncoding = (file, acceptEncoding) => {
  const encoding = 'buffer'

  if (Array.isArray(acceptEncoding) && acceptEncoding.length) {
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

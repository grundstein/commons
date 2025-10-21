export function getFileEncoding(
  file: EncodedFile,
  acceptEncoding?: string,
): 'gzip' | 'br' | 'deflate' | 'buffer'
export type EncodedFile = {
  /**
   * - Brotli compressed buffer
   */
  br?: Buffer<ArrayBufferLike> | undefined
  /**
   * - Gzip compressed buffer
   */
  gzip?: Buffer<ArrayBufferLike> | undefined
  /**
   * - Deflate compressed buffer
   */
  deflate?: Buffer<ArrayBufferLike> | undefined
  /**
   * - Uncompressed buffer
   */
  buffer: Buffer
}

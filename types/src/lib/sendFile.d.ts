export function sendFile(
  stream: import('http2').ServerHttp2Stream,
  headers: import('http2').IncomingHttpHeaders,
  options: SendFileOptions,
): void
export type FileDescriptor = {
  /**
   * - Absolute or relative file system path to the file.
   */
  path: string
  /**
   * - MIME type of the file (e.g. `text/html`, `image/png`).
   */
  mime: string
  /**
   * - File size in bytes.
   */
  size: number
  br?: Buffer<ArrayBufferLike> | undefined
  gzip?: Buffer<ArrayBufferLike> | undefined
  deflate?: Buffer<ArrayBufferLike> | undefined
}
export type SendFileOptions = {
  /**
   * - HTTP status code to respond with.
   */
  code?: number | undefined
  /**
   * - Additional headers to merge into the response.
   */
  head?: Record<string, string | number> | undefined
  /**
   * - File information (path, MIME type, size).
   */
  file: FileDescriptor
  /**
   * - Optional timestamp or high-resolution time for logging.
   */
  time?: [number, number] | undefined
}

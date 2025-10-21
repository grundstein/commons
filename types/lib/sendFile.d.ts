export function sendFile(req: IncomingMessage, res: ServerResponse, options: SendFileOptions): void
export type IncomingMessage = import('http').IncomingMessage
export type ServerResponse = import('http').ServerResponse
export type OutgoingHttpHeaders = import('http').OutgoingHttpHeaders
export type FileObject = {
  /**
   * - Uncompressed file buffer
   */
  buffer: Buffer
  /**
   * - MIME type
   */
  mime: string
  /**
   * - Gzip compressed buffer
   */
  gzip?: Buffer<ArrayBufferLike> | undefined
  /**
   * - Brotli compressed buffer
   */
  br?: Buffer<ArrayBufferLike> | undefined
  /**
   * - Deflate compressed buffer
   */
  deflate?: Buffer<ArrayBufferLike> | undefined
}
export type SendFileOptions = {
  /**
   * - File object to send
   */
  file: FileObject
  /**
   * - HTTP status code
   */
  code?: number | undefined
  /**
   * - Response type
   */
  type?: string | undefined
  /**
   * - Additional HTTP headers
   */
  headers?: import('http').OutgoingHttpHeaders | undefined
}

export function fileLog(
  name?: string,
  outputPath?: string,
): {
  request: Function
  info: Function
  error: Function
  warn: Function
}
export default fileLog
export type IncomingMessage = import('http').IncomingMessage
export type ServerResponse = import('http').ServerResponse
export type FileLogOptions = {
  /**
   * - High-resolution time tuple
   */
  time: [number, number]
  /**
   * - Type of request
   */
  type?: string | undefined
}

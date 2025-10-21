export default log
export type IncomingMessage = import('http').IncomingMessage
export type ServerResponse = import('http').ServerResponse
export type RequestLogOptions = {
  /**
   * - High-resolution time
   */
  time: [number, number]
  /**
   * - Type of request
   */
  type?: string | undefined
  /**
   * - Whether to get full IP address
   */
  getFullIp?: boolean | undefined
}
/**
 * @type {import('@magic/log').LogFunction & import('@magic/log').LogMethods & { server: { request: Function, info: Function, error: Function, warn: Function } }}
 */
declare const log: import('@magic/log').LogFunction &
  import('@magic/log').LogMethods & {
    server: {
      request: Function
      info: Function
      error: Function
      warn: Function
    }
  }

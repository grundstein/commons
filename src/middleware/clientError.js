/**
 * Handles client connection errors for an HTTP/1.1 or HTTP/2 server.
 *
 * This is a higher-order function that takes connection metadata and returns
 * an error handler suitable for use with Node’s `server.on('clientError', ...)`.
 *
 * @returns {(err: NodeJS.ErrnoException, socket: import('net').Socket) => void}
 * Returns a callback function that can be attached to an HTTP server's `clientError` event.
 *
 * @example
 * server.on('clientError', clientError({ startTime: process.hrtime.bigint(), host: 'localhost', port: 8080 }))
 */
export const clientError = () => (_err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
}

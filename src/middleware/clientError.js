/**
 * @typedef {import('net').Socket} Socket
 */

/**
 * Creates a client error handler
 * @returns {(err: Error, socket: Socket) => void}
 */
export const clientError = () => (_err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
}

export const clientError = ({ startTime, host, port }) => (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
}

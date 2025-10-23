import { is } from '@magic/test'
import { clientError } from '../../src/middleware/clientError.js'

// Helper: mock a socket
const makeSocket = () => {
  return {
    endedData: null,
    end(data) {
      this.endedData = data
    },
  }
}

export default [
  {
    fn: () => {
      const handler = clientError()
      const socket = makeSocket()

      // simulate error
      handler(new Error('test'), socket)

      return socket.endedData === 'HTTP/1.1 400 Bad Request\r\n\r\n'
    },
    expect: true,
    info: 'clientError calls socket.end with 400 response',
  },

  {
    fn: () => {
      const handler = clientError()
      const socket = makeSocket()

      // simulate different error
      handler({ message: 'another error' }, socket)

      return socket.endedData === 'HTTP/1.1 400 Bad Request\r\n\r\n'
    },
    expect: true,
    info: 'clientError works with any error object',
  },
]

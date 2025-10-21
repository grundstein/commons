export function clientError(): (err: Error, socket: Socket) => void
export type Socket = import('net').Socket

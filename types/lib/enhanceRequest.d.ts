export function enhanceRequest(req?: IncomingMessage): Message
export type IncomingMessage = import('http').IncomingMessage
export type Message = IncomingMessage & {
  startTime: [number, number]
}

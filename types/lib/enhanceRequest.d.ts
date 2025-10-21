export function enhanceRequest(req?: Message): Message
export type IncomingMessage = import('http').IncomingMessage
export type Message = IncomingMessage & {
  startTime: [number, number]
}

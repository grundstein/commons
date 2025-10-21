export function getClientIp(req: ExtendedIncomingMessage, full?: boolean): string
export type IncomingMessage = import('http').IncomingMessage
export type Socket = import('net').Socket
export type ConnectionLike = {
  remoteAddress?: string | undefined
  socket?: import('net').Socket | undefined
}
export type RequestInfo = {
  remoteAddress?: string | undefined
}
export type RequestIdentity = {
  sourceIp?: string | undefined
}
export type RequestContext = {
  identity?: RequestIdentity | undefined
}
export type ExtendedIncomingMessage = IncomingMessage & {
  info?: RequestInfo
  requestContext?: RequestContext
}

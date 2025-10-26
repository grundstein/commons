export function body(req: IncomingMessage): Promise<string | Object | CustomError>
export type IncomingMessage = import('http').IncomingMessage
export type CustomError = import('@magic/error').CustomError

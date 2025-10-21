export function body(req: IncomingMessage): Promise<string | Object>
export type IncomingMessage = import('http').IncomingMessage

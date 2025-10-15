export function wrapHandler({
  flags,
  handler,
  headers,
  stream,
}: {
  stream: Http2Stream
  headers: Http2Headers
  flags?: number | undefined
  handler?: HandlerFunction | undefined
}): Promise<void>
export type Http2Stream = import('node:http2').ServerHttp2Stream
export type Http2Headers = import('node:http2').IncomingHttpHeaders
export type HandlerFunction = (
  stream: Http2Stream,
  headers: Http2Headers,
  flags?: number,
) => void | Promise<void>

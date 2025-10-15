export function body(stream: Http2Stream, headers: Http2Headers): Promise<string | any>
export type Http2Stream = import('node:http2').ServerHttp2Stream
export type Http2Headers = import('node:http2').IncomingHttpHeaders

export function enhanceRequest(stream: EnhancedHttp2Stream): EnhancedHttp2Stream
export type EnhancedHttp2Stream = import('node:http2').ServerHttp2Stream & {
  startTime?: ReturnType<typeof process.hrtime>
}

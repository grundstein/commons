export function enhanceRequest(stream?: import('node:http2').ServerHttp2Stream | object):
  | EnhancedHttp2Stream
  | {
      startTime?: ReturnType<typeof process.hrtime>
    }
export type EnhancedHttp2Stream = import('node:http2').ServerHttp2Stream & {
  startTime?: ReturnType<typeof process.hrtime>
}

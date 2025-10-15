export function findFavicon(): Promise<
  | false
  | {
      code: number
      body: Buffer<ArrayBufferLike>
      headers: {
        [constants.HTTP2_HEADER_CONTENT_TYPE]: string
      }
    }
>
declare const constants: typeof http2.constants
import http2 from 'node:http2'
export {}

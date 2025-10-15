export function getClientIp(stream?: StreamLike, headers?: Headers, full?: boolean): string
export type StreamLike = {
  connection?:
    | {
        remoteAddress?: string | undefined
        socket?:
          | {
              remoteAddress?: string | undefined
            }
          | undefined
      }
    | undefined
  socket?:
    | {
        remoteAddress?: string | undefined
      }
    | undefined
  info?:
    | {
        remoteAddress?: string | undefined
      }
    | undefined
  requestContext?:
    | {
        identity?:
          | {
              sourceIp?: string | undefined
            }
          | undefined
      }
    | undefined
  session?:
    | {
        socket?:
          | {
              remoteAddress?: string | undefined
            }
          | undefined
      }
    | undefined
}
export type Headers = Record<string, string | string[] | undefined>

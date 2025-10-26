export function getRandomId(
  byteLength?: number,
  randomBytes?: (
    byteLength: number,
    callback: (err: Error | null, buf: Buffer<ArrayBufferLike>) => void,
  ) => void,
): Promise<string>

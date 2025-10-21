import zlib from 'node:zlib'

/** @type {(input: string) => Promise<Buffer<ArrayBuffer>>} */
export const gzip = async input =>
  await new Promise((resolve, reject) => {
    zlib.gzip(input, (err, buffer) => (err ? reject(err) : resolve(buffer)))
  })

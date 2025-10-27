import { is, tryCatch } from '@magic/test'
import { gzip, brotli } from '../../src/lib/compress.js'
import zlib from 'node:zlib'
import { promisify } from 'node:util'

const brotliDecompressAsync = promisify(zlib.brotliDecompress)

export default [
  {
    fn: async () => {
      const result = await brotli('Hello, Brotli!')
      return result
    },
    expect: is.buffer,
    info: 'brotli returns a Buffer',
  },
  {
    fn: tryCatch(brotli),
    expect: is.error,
    info: 'brotli without argument errors',
  },
  {
    fn: async () => {
      const data = 'Brotli test data'
      const compressed = await brotli(data)
      const decompressed = await brotliDecompressAsync(compressed)
      return decompressed.toString()
    },
    expect: 'Brotli test data',
    info: 'brotli produces valid compressed data',
  },
  {
    fn: async () => {
      const data = Buffer.from('Buffer brotli test')
      const compressed = await brotli(data)
      const decompressed = await brotliDecompressAsync(compressed)
      return data.equals(decompressed)
    },
    expect: true,
    info: 'brotli handles Buffer input',
  },
  {
    fn: async () => {
      const data = 'B'.repeat(1000)
      const compressed1 = await brotli(data, {
        params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 1 },
      })
      const compressed11 = await brotli(data, {
        params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
      })
      return compressed11.length <= compressed1.length
    },
    expect: true,
    info: 'brotli respects quality option',
  },
  {
    fn: async () => {
      const compressed = await brotli('')
      const decompressed = await brotliDecompressAsync(compressed)
      return decompressed.toString()
    },
    expect: '',
    info: 'brotli handles empty string',
  },

  // Compression efficiency tests
  {
    fn: async () => {
      const data = 'Repeat this! '.repeat(100)
      const original = Buffer.from(data)
      const compressed = await brotli(data)
      return compressed.length < original.length
    },
    expect: true,
    info: 'brotli reduces size for repetitive data',
  },
]

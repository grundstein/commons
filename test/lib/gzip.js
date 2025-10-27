import { is, tryCatch } from '@magic/test'
import { gzip } from '../../src/lib/compress.js'
import zlib from 'node:zlib'
import { promisify } from 'node:util'

const gunzipAsync = promisify(zlib.gunzip)

export default [
  // Gzip async tests
  {
    fn: async () => {
      const result = await gzip('Hello, World!')
      return Buffer.isBuffer(result)
    },
    expect: true,
    info: 'gzip returns a Buffer',
  },
  {
    fn: tryCatch(gzip),
    expect: is.error,
    info: 'gzip without args errors',
  },
  {
    fn: async () => {
      const data = 'Test data'
      const compressed = await gzip(data)
      const decompressed = await gunzipAsync(compressed)
      return decompressed.toString()
    },
    expect: 'Test data',
    info: 'gzip produces valid compressed data',
  },
  {
    fn: async () => {
      const data = Buffer.from('Buffer test')
      const compressed = await gzip(data)
      const decompressed = await gunzipAsync(compressed)
      return data.equals(decompressed)
    },
    expect: true,
    info: 'gzip handles Buffer input',
  },
  {
    fn: async () => {
      const data = 'A'.repeat(1000)
      const compressed1 = await gzip(data, { level: 1 })
      const compressed9 = await gzip(data, { level: 9 })
      return compressed9.length <= compressed1.length
    },
    expect: true,
    info: 'gzip respects compression level option',
  },
  {
    fn: async () => {
      const compressed = await gzip('')
      const decompressed = await gunzipAsync(compressed)
      return decompressed.toString()
    },
    expect: '',
    info: 'gzip handles empty string',
  },

  // Compression efficiency tests
  {
    fn: async () => {
      const data = 'Repeat this! '.repeat(100)
      const original = Buffer.from(data)
      const compressed = await gzip(data)
      return compressed.length < original.length
    },
    expect: true,
    info: 'gzip reduces size for repetitive data',
  },
]

import { getFileEncoding } from '../../src/lib/getFileEncoding.mjs'

const brFile = {
  br: 'testing',
}

const gzipFile = {
  gzip: 'testing',
}
const deflateFile = {
  deflate: 'testing',
}

const acceptBr = ['br']
const acceptGzip = ['gzip']
const acceptDeflate = ['deflate']

const allFile = {
  br: 'testing',
  gzip: 'testing',
  deflate: 'testing',
}
const acceptAll = ['br', 'gzip', 'deflate']

export default [
  {
    fn: getFileEncoding,
    expect: 'buffer',
    info: 'getFileEncoding without arguments returns "buffer"',
  },
  {
    fn: getFileEncoding(brFile, acceptBr),
    expect: 'br',
    info: 'getFileEncoding with br file will return "br"',
  },
  {
    fn: getFileEncoding(gzipFile, acceptGzip),
    expect: 'gzip',
    info: 'getFileEncoding with gzip file will return "gzip"',
  },
  {
    fn: getFileEncoding(deflateFile, acceptDeflate),
    expect: 'deflate',
    info: 'getFileEncoding with deflate file will return "deflate"',
  },
  {
    fn: getFileEncoding(allFile, acceptAll),
    expect: 'br',
    info: 'getFileEncoding with all options will return "br"',
  },
]

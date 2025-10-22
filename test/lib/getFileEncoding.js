import { getFileEncoding } from '../../src/lib/getFileEncoding.js'

export default [
  {
    fn: getFileEncoding(),
    expect: 'buffer',
    info: 'getFileEncoding with empty argument returns buffer',
  },
  {
    fn: getFileEncoding({ gzip: 'gzip content' }, ['gzip']),
    expect: 'gzip',
    info: 'getFileEncoding with gzip arguments returns gzip',
  },
  {
    fn: getFileEncoding({ gzip: 'gzip content', br: 'br content' }, ['gzip', 'br']),
    expect: 'br',
    info: 'getFileEncoding with gzip and br returns br',
  },
  {
    fn: getFileEncoding({ deflate: 'deflate content' }, ['gzip', 'br', 'deflate']),
    expect: 'deflate',
    info: 'getFileEncoding with gzip, br and deflate acceptance but only deflate content returns deflate',
  },
  {
    fn: getFileEncoding({ deflate: 'deflate content', gzip: 'gzip content' }, [
      'gzip',
      'br',
      'deflate',
    ]),
    expect: 'gzip',
    info: 'getFileEncoding with gzip and deflate acceptance returns gzip',
  },
  {
    fn: getFileEncoding({ deflate: 'deflate content', gzip: 'gzip content', br: 'br content' }, [
      'gzip',
      'br',
      'deflate',
    ]),
    expect: 'br',
    info: 'getFileEncoding with gzip, br and deflate acceptance returns br',
  },
]

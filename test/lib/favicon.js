import { is, tryCatch } from '@magic/test'
import { shouldServeFavicon, getFaviconContent } from '../../src/lib/favicon.js'
import fs from '@magic/fs'
import constants from '@magic/http1-constants'

const { CONTENT_ENCODING, CONTENT_TYPE, CONTENT_LENGTH } = constants.headers

const mockFaviconName = 'favicon.ico'

/**
 * Utility to temporarily mock fs.exists
 */
const resetExists =
  (returnValue = false) =>
  () => {
    const originalExists = fs.exists
    fs.exists = async () => returnValue
    return () => {
      fs.exists = originalExists
    }
  }

/**
 * Utility to temporarily mock fs.exists + fs.readFile
 */
const mockFsWithFavicon =
  (data = 'ICONDATA') =>
  () => {
    const originalExists = fs.exists
    const originalReadFile = fs.readFile

    fs.exists = async () => true
    fs.readFile = async () => Buffer.from(data)

    return () => {
      fs.exists = originalExists
      fs.readFile = originalReadFile
    }
  }

export default [
  {
    fn: () => shouldServeFavicon('/favicon.ico', 'favicon.ico'),
    expect: true,
    info: 'returns true when url matches favicon name',
  },
  {
    fn: () => shouldServeFavicon('/favicon.ico', false),
    expect: false,
    info: 'returns false when favicon is disabled',
  },
  {
    fn: () => shouldServeFavicon('/other.ico', 'favicon.ico'),
    expect: false,
    info: 'returns false when url does not match favicon',
  },

  {
    fn: async () => {
      const result = await getFaviconContent(mockFaviconName)
      return result
    },
    before: resetExists(false),
    expect: undefined,
    info: 'returns undefined when favicon does not exist',
  },
  {
    fn: async () => {
      const result = await getFaviconContent(false)
      return result
    },
    expect: undefined,
    info: 'returns undefined when favicon disabled',
  },
  {
    fn: async () => {
      const result = await getFaviconContent(mockFaviconName)
      return result.headers
    },
    before: mockFsWithFavicon(),
    expect: {
      [CONTENT_TYPE]: 'image/x-icon',
      [CONTENT_ENCODING]: 'gzip',
      [CONTENT_LENGTH]: 8,
    },
    info: 'returns valid favicon content and headers when file exists',
  },
  {
    fn: async () => {
      const result = await getFaviconContent(mockFaviconName)
      return result.body
    },
    before: mockFsWithFavicon(),
    expect: is.buffer,
    info: 'returns valid favicon content and headers when file exists',
  },
  {
    fn: async () => {
      const result = await getFaviconContent(mockFaviconName)
      return result.headers
    },
    before: () => {
      const originalExists = fs.exists
      const originalReadFile = fs.readFile

      fs.exists = async p => p.endsWith('.gz') // only gz file exists
      fs.readFile = async () => Buffer.from('COMPRESSEDDATA')

      return () => {
        fs.exists = originalExists
        fs.readFile = originalReadFile
      }
    },
    expect: {
      [CONTENT_TYPE]: 'image/x-icon',
      [CONTENT_ENCODING]: 'gzip',
      [CONTENT_LENGTH]: 14,
    },
    info: 'returns gzip favicon when .gz file exists',
  },
  {
    fn: getFaviconContent('nonexistent.ico'),
    expect: is.undefined,
    info: 'nonexistent favicon path returns undefined',
  },
]

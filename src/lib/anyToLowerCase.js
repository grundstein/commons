import is from '@magic/types'

/**
 * converts a string or all strings in an array into lowercase
 * @param {string | string[]} a
 * @returns {string | string[]}
 */
export const anyToLowerCase = a => {
  if (is.arr(a)) {
    return a.map(a => anyToLowerCase(a)).flat(2000)
  } else if (is.fn(a?.toLowerCase)) {
    return a.toLowerCase()
  }

  return a
}

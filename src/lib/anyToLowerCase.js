import is from '@magic/types'

/**
 * converts a string or all strings in an array into lowercase
 * @param {unknown | unknown[]} a
 * @returns {string | unknown | (string | unknown)[]}
 */
export const anyToLowerCase = a => {
  if (is.arr(a)) {
    return a.map(a => anyToLowerCase(a))
  } else if (is.str(a)) {
    return a.toLowerCase()
  } else {
    return a
  }
}

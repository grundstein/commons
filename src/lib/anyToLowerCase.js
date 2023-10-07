import { is } from '@grundstein/commons'

/*
 * converts a string or all strings in an array into lowercase
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

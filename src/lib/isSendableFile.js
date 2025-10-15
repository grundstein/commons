import is from '@magic/types'

/**
 * @param {unknown} file
 */
export const isSendableFile = file => file && is.object(file) && 'buffer' in file

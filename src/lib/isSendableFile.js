import { is } from '../is.js'

/**
 * @typedef {import('./sendFile.js').FileObject} FileObject
 */

/**
 * Checks if a file object can be sent as HTTP response
 * Validates that file exists and has a buffer property
 * @param {FileObject} file - File object to check
 * @returns {boolean} True if file is sendable, false otherwise
 */
export const isSendableFile = file => !is.undefined(file) && 'buffer' in file

/**
 *
 * @param {string} [file='/home/grundstein/environment.js']
 * @returns
 */
export const addEnv = async (file = '/home/grundstein/environment.js') => {
  /*
   * copy process.env to make sure we do not pollute bash env vars
   */
  const env = { ...process.env }

  /*
   * add file contents to the env variables
   */
  try {
    const environment = await import(file)

    return {
      ...environment,
      ...env,
    }
  } catch (e) {
    const err = /** @type {import('@magic/error').CustomError} */ (e)
    if (err.code !== 'ERR_MODULE_NOT_FOUND') {
      console.log('error importing env', e)
    }
  }

  return env
}

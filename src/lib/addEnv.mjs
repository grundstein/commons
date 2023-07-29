export const addEnv = async file => {
  /*
   * copy process.env to make sure we do not pollute bash env vars
   */
  const env = { ...process.env }

  /*
   * add file contents to the env variables
   */
  try {
    const { env: environment } = await import(file)

    return {
      ...environment,
      ...env,
    }
  } catch (e) {
    if (e.code !== 'ERR_MODULE_NOT_FOUND') {
      console.log('error importing env', e)
    }
  }

  return env
}

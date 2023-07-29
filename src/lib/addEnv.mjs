export const addEnv = async file => {
  /*
   * copy process.env to make sure we do not pollute bash env vars
   */
  let env = { ...process.env }

  /*
   * add file contents to the env variables
   */
  try {
    const { env: environment } = await import(file)
    env = {
      ...environment,
      ...env,
    }

    return env
  } catch (e) {
    if (e.code !== 'ERR_MODULE_NOT_FOUND') {
      console.log('error importing env', e)
    }
  }
}

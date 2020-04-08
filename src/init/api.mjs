import path from 'path'

import fs from '@magic/fs'
import log from '@magic/log'

export const initApi = async dir => {
  // some servers might have no api.
  if (!dir) {
    return {}
  }

  const startTime = log.hrtime()

  const cwd = process.cwd()

  const apiDir = path.join(dir, 'api')

  log.info(`gs-server/api: serving static files from ${apiDir}`)

  const files = await fs.getFiles(apiDir)

  const api = {}

  await Promise.all(
    files.map(async file => {
      const relativePath = file.replace(apiDir, '')
      const [_, version, ...pathParts] = relativePath.split(path.sep)

      // initialize this api version if it does not exist yet
      api[version] = api[version] || {}

      // get absolute path for import
      const absPath = path.join(cwd, file)

      const { default: lambda } = await import(absPath)

      // remove the extension from the lambdapath
      const ext = path.extname(file)
      const lambdaPath = pathParts.join('/').replace(ext, '')

      api[version][`/${lambdaPath}`] = lambda
    }),
  )

  log.timeTaken(startTime, 'api init took')

  return api
}

export default initApi

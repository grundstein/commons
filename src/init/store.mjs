import path from 'path'

import log from '@magic/log'
import defaultStore from '@grundstein/file-store'

export const initStore = async (dir, fileStore = defaultStore) => {
  const startTime = log.hrtime()

  const cwd = process.cwd()

  const staticDir = path.join(cwd, dir, 'static')

  log.info(`gs-server/static: serving static files from ${staticDir}`)

  const store = await fileStore(staticDir)

  log.timeTaken(startTime, 'fileStore init took')

  return store
}

export default initStore

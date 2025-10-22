import constants from '@magic/http1-constants'
import { getHostname } from '../../src/lib/getHostname.js'

export default [
  {
    fn: getHostname(),
    expect: '',
    info: 'getHostname without arguments returns empty string',
  },
  {
    fn: getHostname({}),
    expect: '',
    info: 'getHostname without host and X_FORWARDED_FOR in the headers returns empty string',
  },
  {
    fn: getHostname({ headers: { host: 'localhorst' } }),
    expect: 'localhorst',
    info: 'getHostname with host localhorst returns localhorst',
  },
  {
    fn: getHostname({ headers: { [constants.headers.X_FORWARDED_FOR]: 'localhorst' } }),
    expect: 'localhorst',
    info: 'getHostname with X_FORWARDED_FOR of localhorst returns localhorst',
  },
  {
    fn: getHostname({
      headers: { [constants.headers.X_FORWARDED_FOR]: ['localhorst', 'localhans'] },
    }),
    expect: 'localhorst',
    info: 'getHostname with X_FORWARDED_FOR of [localhorst, localhans] returns localhorst',
  },
  {
    fn: getHostname({
      headers: { [constants.headers.X_FORWARDED_FOR]: ['localhorst:2323', 'localhans'] },
    }),
    expect: 'localhorst',
    info: 'getHostname with X_FORWARDED_FOR of [localhorst:2323, localhans] returns localhorst without the port number',
  },
  {
    fn: getHostname({
      headers: { host: 'localhorst', [constants.headers.X_FORWARDED_FOR]: ['localhans'] },
    }),
    expect: 'localhorst',
    info: 'getHostname with X_FORWARDED_FOR of [localhans] and host of localhorst returns localhorst',
  },
]

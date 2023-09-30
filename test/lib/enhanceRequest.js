import { is } from '@magic/test'

import { enhanceRequest } from '../../src/lib/enhanceRequest.js'

export default [
  {
    fn: enhanceRequest(),
    expect: t => is.array(t.startTime),
    info: 'enhancerequest sets the req.startTime property',
  },
  {
    fn: enhanceRequest(),
    expect: t => is.number(t.startTime[0]) && is.number(t.startTime[1]),
    info: 'enhanceRequest sets req.starttime to an array consisting of two numbers',
  },
]

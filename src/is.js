import net from 'net'

import types from '@magic/types'

export const is = types

is.ip = a => net.isIP(a) > 0
is.ip.v4 = a => net.isIP(a) === 4
is.ip.v6 = a => net.isIP(a) === 6

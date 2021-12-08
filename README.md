## @grundstein/commons

### WIP. NOT FULLY AUTOMATED, TESTED AND BENCHMARKED YET!

### features:

this is the commonly shared codebase for all [grundstein](https://grundstein.it) servers.

#### installation

```
npm i --save-exact @grundstein/commons
```

#### usage

Below are all imports possible from this library.

TODO: Add usage examples.

```
import commons, { fs, is, lib, log, middleware } from '@grundstein/commons'

import lib from '@grundstein/commons/lib.mjs'
import middleware from '@grundstein/commons/middleware.mjs'

commons.log.info('commons are usable now.')
```

#### commons.fs

exports [@magic/fs](https://magic.github.io/fs/), a promisified version of fs with some added functionality.

#### commons.is

exports [@magic/is](https://magic/github.io/is/), a comprehensive runtime type checking library.

#### commons.log

serverside logging functionality, basically a fancy wrapper around console.log that outputs a json object.
those logs get collected by systemd and can be viewed and managed using journalctl.

#### commons.lib

various utility functions

##### lib.createServer
Looks for a directory with https certificates,
and starts a nodejs https or http server depending on the existence of said certificates.

```js
import { lib, log } from '@grundstein/commons'

const listener = lib.createServer({
  // this directory has to be readable by the executing user (in prod, this is "grundstein")
  certDir: '/absolute/dir/to/certs',
  host: '1.2.3.4',
  port: '3000',
  startTime: log.hrtime(),
})

```

##### createSecureContext
used by lib.createServer to get the https context set up.

##### denyRequest
tests if req.url is empty, includes ://, or does not start with '/',
calls req.socket.destroy if malicious request is detected.

##### enhanceRequest
adds req.startTime field.

##### etags
used to check etag values against a cache of files to use 304 headers for cached content.
cache is either built on-demand or using the pre-built etags.csv file that
[@grundstein/prepare-static-files](https://github.com/grundstein/prepare-static-files)
generates.

##### getClientIp
returns the ip address of a request.
by default, this function will replace the last block of the ip address by xxx.

##### getCurrentDate
get a formatted date and time string

##### getFileEncoding
returns 'br', 'gzip', 'deflate', 'buffer' in that order,
depending on contents of req.headers['accept-encoding']

##### getRequestDuration
returns the time elapsed between two hrtime values,
as a string, normalized to *s*econds, *m*illi*s*econds or *n*ano*s*econds,
and ending with the unit.

##### getProxies
reads config.proxyFile using fs, splits it at newlines and returns the resulting array

##### isSendableFile
checks if file is truthy and has a file.buffer key.

##### formatLog
collects data from request, response and headers, then returns a one-line json string that can be console.log(ged).

##### respond
prepares the headers and body of a response, then sends it to the client and logs it.

##### sendFile
sets Content-Type and Content-Encoding headers,
checks if compressed file exists and accept-encoding accepts it,
then sends the correct content with correct headers using lib.respond

##### sendStream
sends a file as a stream.

#### changelog

##### 0.0.1
first release

##### 0.0.2
* add lib.etags
* lib.createServer now wraps the handler function to use denyRequest
* update dependencies

##### 0.0.3
* getClientIp is much more sophisticated, looking for the ip in multiple headers and request subfields.

##### 0.0.4
update dependencies

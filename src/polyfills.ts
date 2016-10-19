declare const __PROD__: boolean

import 'json3'
import 'es5-shim'
import 'es6-shim'
import 'ts-helpers'
import 'reflect-metadata'
import 'zone.js/dist/zone'

if (!__PROD__)
  Error['stackTraceLimit'] = Infinity

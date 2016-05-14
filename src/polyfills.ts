declare const __IS_BUILD__: boolean

import 'json3'
import 'es5-shim'
import 'es6-shim'
import 'babel-polyfill'
import 'reflect-metadata'
import 'zone.js/dist/zone'
import 'ts-helpers'

if (__IS_BUILD__) {
  // Production

} else {
  // Development

  Error['stackTraceLimit'] = Infinity

  require('zone.js/dist/long-stack-trace-zone')
}

import path from 'path'

import runWebpack from './run-webpack'
import context from './get-root-path'

const WEBPACK_DEV_SERVER = path.resolve(context, 'node_modules/.bin/webpack-dev-server')

export default function() {
  return runWebpack(WEBPACK_DEV_SERVER, [
    '--config', CONFIG_PATH,
    '--inline',
    '--hot',
    '--history-api-fallback'
  ])
}

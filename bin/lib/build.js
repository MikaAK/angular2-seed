import path from 'path'

import context from './get-root-path'
import runWebpack from './run-webpack'

const WEBPACK = path.resolve(context, 'node_modules/.bin/webpack')

export default function() {
  return runWebpack(WEBPACK)
}

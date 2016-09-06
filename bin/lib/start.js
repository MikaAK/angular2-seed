import path from 'path'
import {spawnSync} from 'child_process'
import context from './get_root_path'


const WEBPACK_DEV_SERVER = path.resolve(context, 'node_modules/.bin/webpack-dev-server'),
      WEBPACK_DASHBOARD = path.resolve(context, 'node_modules/.bin/webpack-dashboard'),
      CONFIG_PATH = path.resolve(context, 'webpack.config.babel.js'),
      stdio = 'inherit'

export default function() {
  return spawnSync(WEBPACK_DEV_SERVER, [
    '--config', CONFIG_PATH,
    '--inline',
    '--hot',
    '--history-api-fallback'
  ], {stdio, cwd: context, env: process.env})
}

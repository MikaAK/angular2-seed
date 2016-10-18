import path from 'path'
import {spawnSync} from 'child_process'
import cwd from './get-root-path'

const {NODE_ENV} = process.env,
      WEBPACK_DASHBOARD = path.resolve(cwd, 'node_modules/.bin/webpack-dashboard'),
      CONFIG_PATH = path.resolve(cwd, 'webpack.config.babel.js'),
      stdio = 'inherit'

export default function(command, params = []) {
  const config = {stdio, cwd, env: process.env}

  if (!NODE_ENV || NODE_ENV === 'development')
    return spawnSync(WEBPACK_DASHBOARD, [
      command,
      ...params
    ], config)
  else
    return spawnSync(command, params, config)
}

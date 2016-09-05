import path from 'path'
import {spawnSync} from 'child_process'
import CONTEXT from './get_root_path'

const WEBPACK = path.resolve(CONTEXT, 'node_modules/.bin/webpack'),
      stdio = 'inherit'

export default function() {
  const {NODE_ENV} = process.env
  const IS_BUILD = NODE_ENV === 'production' || NODE_ENV === 'staging'

  return spawnSync(WEBPACK, IS_BUILD ? ['--optimize-minimize'] : [], {stdio})
}

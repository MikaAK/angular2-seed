import path from 'path'
import {spawnSync} from 'child_process'
import CONTEXT from './get_root_path'

const WEBPACK = path.resolve(CONTEXT, 'node_modules/.bin/webpack'),
      stdio = 'inherit'

export default function() {
  return spawnSync(WEBPACK, [
    '--colors',
    '--progress'
  ], {stdio})
}

import path from 'path'
import {spawnSync} from 'child_process'
import CONTEXT from './get_root_path'

const KARMA = path.resolve(CONTEXT, 'node_modules/.bin/karma')

export default function() {
  process.env.NODE_ENV = 'test'

  spawnSync(KARMA, ['start'], {stdio: 'inherit', cwd: CONTEXT})
}

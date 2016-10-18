import path from 'path'
import {spawnSync} from 'child_process'
import CONTEXT from './get-root-path'

const KARMA = path.resolve(CONTEXT, 'node_modules/.bin/karma')

export default function({singleRun} = {}) {
  process.env.NODE_ENV = 'test'

  const COMMANDS = ['start']

  spawnSync(KARMA, singleRun ? COMMANDS.concat('--single-run') : COMMANDS, {stdio: 'inherit', cwd: CONTEXT})
}

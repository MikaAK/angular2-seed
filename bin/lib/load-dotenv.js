import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import CONTEXT from './get-root-path'

export default function() {
  const ENV_FILE = path.resolve(CONTEXT, '.env')

  return new Promise(function(resolve) {
    if (fs.existsSync(ENV_FILE, fs.F_OK))
      dotenv.load({path: ENV_FILE})

    resolve()
  })
}

import meow from 'meow'
import chalk from 'chalk'
import loadDotenv from './lib/load-dotenv'
import HELP_TEXT from './lib/help-text'
import FLAG_COMMANDS from './lib/flag-commands'
import build from './lib/build'
import start from './lib/start'
import test from './lib/test'

var CLI = {
  COMMAND_TABLE: {build, start, test},
  program: meow(HELP_TEXT, {
    alias: {
      p: 'production',
      d: 'development',
      s: 'staging',
      aot: 'aheadOfTime',
      '-1': 'singleRun'
    }
  }),

  main() {
    var {program} = CLI,
        command = CLI.COMMAND_TABLE[program.input[0]]

    for (let opt of Object.keys(program.flags))
      if (FLAG_COMMANDS[opt])
        FLAG_COMMANDS[opt]()

    if (!process.env.NODE_ENV)
      FLAG_COMMANDS.development()

    /* eslint-disable */
    console.log(`${chalk.green('ENV')}: ${chalk.magenta(process.env.NODE_ENV)}`)

    if (program.flags.aot)
      console.log(`${chalk.green('AOT Mode')}: Active`)
    /* eslint-enable */

    if (!command)
      program.showHelp()
    else
      command(program.flags)
  }
}

export default () => loadDotenv()
  .then(CLI.main)

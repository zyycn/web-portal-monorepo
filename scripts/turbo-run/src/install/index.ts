import { cac } from 'cac'
import { consola } from 'consola'

import install from './install'

try {
  const cli = cac('turbo-run')

  cli
    .command('[script]')
    .usage(`Run turbo interactively.`)
    .action(async (command: string) => {
      install({ command })
    })

  cli.on('command:*', () => {
    consola.error('Invalid command!')
    process.exit(1)
  })

  cli.help()
  cli.parse()
} catch (error) {
  consola.error(error)
  process.exit(1)
}

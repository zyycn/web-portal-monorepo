import { cancel, isCancel, note, select } from '@clack/prompts'
import { getFilteredPackages } from '@internal/node-utils'
import { execSync } from 'child_process'

interface RunOptions {
  command?: string
}

async function run(options: RunOptions) {
  note('🚀 Running turbo...')

  const { command } = options

  if (!command) {
    cancel('❌ No command found')
    return
  }

  const pkgs = getFilteredPackages('@app')

  if (!pkgs.length) {
    cancel('❌ No app found')
    return
  }

  const selectPkg = await select({
    message: `Select the app you need to run [${command}]:`,
    options: pkgs.map(packageName => ({
      label: packageName,
      value: packageName
    }))
  })

  if (isCancel(selectPkg)) {
    cancel('👋 Has cancelled')
    return
  }

  if (!selectPkg) {
    cancel('❌ No app selected')
    return
  }

  execSync(`pnpm --filter=${selectPkg} run ${command}`, {
    stdio: 'inherit'
  })
}

export default run

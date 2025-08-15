import { cancel, isCancel, note, select } from '@clack/prompts'
import { execSync } from 'child_process'

type FilterType = (RegExp | string)[] | RegExp | string

interface RunOptions {
  command?: string
}

/**
 * 获取 monorepo 中所有匹配指定模式的包名
 * @param filter 过滤模式 (字符串、正则表达式或数组或空)
 * @returns 匹配的包名数组
 */
function getFilteredPackages(filter?: FilterType): string[] {
  try {
    const output = execSync('pnpm turbo ls --output=json', { encoding: 'utf-8' })
    const packages: string[] = []

    // 标准化过滤器为数组
    const filters = Array.isArray(filter) ? filter : [filter]

    for (const item of JSON.parse(output).packages.items) {
      const packageName = item.name

      if (!filter) {
        packages.push(packageName)
        continue
      }

      // 检查是否匹配任一过滤器
      for (const f of filters) {
        if (typeof f === 'string' && packageName.startsWith(f)) {
          packages.push(packageName)
          break
        } else if (f instanceof RegExp && f.test(packageName)) {
          packages.push(packageName)
          break
        }
      }
    }

    return packages
  } catch (error) {
    throw new Error(`获取包列表失败: ${error instanceof Error ? error.message : error}`)
  }
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

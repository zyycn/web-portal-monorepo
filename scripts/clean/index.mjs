import { execSync } from 'child_process'

try {
  console.log('🚀 Cleaning cache...')

  // Clean the dist directory
  execSync('pnpm -r exec pnpx rimraf dist', { stdio: 'inherit' })

  // Clean node_modules directories
  execSync('pnpx rimraf node_modules && pnpm -r exec pnpx rimraf node_modules', { stdio: 'inherit' })

  // Clean turbo cache
  execSync('pnpx rimraf .turbo && pnpm -r exec pnpx rimraf .turbo', { stdio: 'inherit' })

  console.log('🎉 Cache cleaned successfully.')
} catch (error) {
  console.error('❌ Error cleaning cache:', error)
  process.exit(1)
}

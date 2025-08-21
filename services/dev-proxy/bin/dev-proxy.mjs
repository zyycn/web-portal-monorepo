#!/usr/bin/env node

import { execSync } from 'child_process'

execSync('pnpm --filter @services/dev-proxy dev', { stdio: 'inherit' })

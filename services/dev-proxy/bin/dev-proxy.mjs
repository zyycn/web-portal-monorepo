#!/usr/bin/env node

import { spawn } from 'child_process'

spawn('pnpm --filter @services/dev-proxy dev', {
  shell: true,
  stdio: 'inherit'
})

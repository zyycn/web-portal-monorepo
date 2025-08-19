<script setup lang="ts">
import { generateRandomId } from '@packages/utils'

import { test } from '@/api'
import HelloWorld from '@/components/HelloWorld.vue'

console.log(generateRandomId())

const login = async () => {
  const res = await test.loginUsername({
    password: '123456',
    username: 'test'
  })
  console.log(res)
}
</script>

<template>
  <el-button type="primary" class="h-30" @click="login">test</el-button>
  <div class="text-[40px] text-[#42b883]">TTTTTTTTTTT</div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style lang="scss" scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  transition: filter 300ms;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

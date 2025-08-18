<script setup lang="ts">
import { generateRandomId } from '@packages/utils'

import { test } from '@/api'
import HelloWorld from '@/components/HelloWorld.vue'

console.log(generateRandomId())

const login = async () => {
  const res = await test.getDbList({
    password: '123456789',
    username: 'test'
  })
  console.log(res)
}
</script>

<template>
  <button @click="login">test</button>
  <div class="columns-2">
    <p>Well, let me tell you something, ...</p>
    <p class="break-inside-avoid-column">Sure, go ahead, laugh...</p>
    <p>Maybe we can live without...</p>
    <p>Look. If you think this is...</p>
  </div>
  <!-- <div class="grid h-500 grid-cols-3 content-stretch gap-3 border">
    <div v-for="item in 7" :key="item" class="border bg-red-500">
      {{ item }}
    </div>
  </div> -->
  <div class="flex items-center justify-center truncate">
    <span class="w-100 truncate"
      >Vite + VueVite + VueVite + VueVite + VueVite + VueVite + VueVite + VueVite + VueVite + VueVite + VueVite + VueVite + VueVite + VueVite + VueVite +
      VueVite + VueVite + VueVite + VueVite + VueVite + Vue</span
    >
    <a href="https://vite.dev" target="_blank">
      <img src="/favicon.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
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

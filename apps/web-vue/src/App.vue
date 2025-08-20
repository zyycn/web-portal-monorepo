<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <div class="text-[88px] text-[red]">AAA</div>
    <img alt="Vue logo" class="text" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <div class="flex items-start justify-start">
        <el-button type="primary" class="mr-2">
          <RouterLink to="/">Home</RouterLink>
        </el-button>
        <el-button type="primary">
          <RouterLink to="/about">About</RouterLink>
        </el-button>
      </div>
    </div>
  </header>

  <RouterView />
</template>

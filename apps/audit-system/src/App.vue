<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { test } from '@/api'

import HelloWorld from './components/HelloWorld.vue'

const login = async () => {
  const res = await test.loginUsername({
    password: '123456',
    username: 'test'
  })

  console.log(res)
  localStorage.setItem('token', JSON.stringify(res.token))
}

const handleOpenTab = () => {
  window.open('/login')
}
</script>

<template>
  <header>
    <el-button type="primary" @click="login">LOGIN</el-button>
    <el-button type="primary" @click="handleOpenTab">打开新标签页</el-button>
    <div>
      <el-link href="https://element-plus.org" target="_blank" class="mr-2">default</el-link>
      <el-link type="primary">primary</el-link>
      <el-link type="success">success</el-link>
      <el-link type="warning">warning</el-link>
      <el-link type="danger">danger</el-link>
      <el-link type="info">info</el-link>
    </div>

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

<script setup lang="ts">
import { test } from '@/api'

const login = async () => {
  await test.loginUsername({
    password: '123456',
    username: 'test'
  })

  sessionStorage.setItem('login', '123')
}
</script>

<template>
  <div class="m-10 text-[20px]">
    <el-button @click="login">登录1</el-button>
  </div>
</template>

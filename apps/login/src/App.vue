<script setup lang="ts">
import { test } from '@/api'

const login = async () => {
  await test.loginUsername({
    password: '123456',
    username: 'test'
  })

  window.location.href = '/portal'
}
</script>

<template>
  <el-button @click="login">登录</el-button>
</template>

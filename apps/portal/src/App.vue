<script setup lang="ts">
import { test } from '@/api'

const login = async () => {
  const res = await test.loginUsername({
    password: '123456',
    username: 'test'
  })

  console.log(res)
  // sessionStorage.setItem('token', res)
}
</script>

<template>
  <div class="m-30">
    <el-button @click="login">门户</el-button>
  </div>
</template>

<script setup lang="ts">
import { test } from '@/api'

const login = () => {
  test.loginUsername({
    password: '123456',
    username: 'test'
  })
}
</script>

<template>
  <button @click="login">门户</button>
</template>

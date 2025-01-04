<script setup lang="ts">
import { RouterView } from 'vue-router'

const ipcHandle = () => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

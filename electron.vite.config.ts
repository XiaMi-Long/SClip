import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    // 配置scss 2.0版本过期标识，使用新的api
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // 或 "modern"，"legacy"
          importers: [
            // ...
          ]
        }
      }
    },

    plugins: [vue()]
  }
})

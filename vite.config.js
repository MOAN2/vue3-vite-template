import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],
      // 自动导入 ElementPlus 组件
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    // ↓路径别名
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  // 本地代理调试
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})

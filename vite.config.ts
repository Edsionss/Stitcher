import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 确保你安装了 @types/node 来获得类型提示
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // @ 指向 src 目录
      '@': path.resolve(__dirname, './src'),
      // 配置你需要的别名
      '@design': path.resolve(__dirname, './src/views/design'),
      '@preview': path.resolve(__dirname, './src/views/preview'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@config': path.resolve(__dirname, './src/config'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@stores': path.resolve(__dirname, './src/stores')
    }
  },
  server: {
    port: 3000, // 使用端口3000代替默认的5173
    host: true // 允许外部访问
  }
})

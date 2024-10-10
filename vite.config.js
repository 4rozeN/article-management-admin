import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js', // 指定 JS 文件的输出路径及命名规则
        chunkFileNames: 'js/[name]-[hash].js', // 指定分片文件的输出路径及命名规则
        assetFileNames: (assetInfo) => {
          // 设置不同类型文件的输出路径及命名规则
          if (assetInfo.type === 'asset' && /\.(jpe?g|png|gif|svg)$/i.test(assetInfo.name)) {
            return 'img/[name].[hash].[ext]' // 图像文件输出路径及命名规则
          }
          if (assetInfo.type === 'asset' && /\.(ttf|woff|woff2|eot)$/i.test(assetInfo.name)) {
            return 'fonts/[name].[hash].[ext]' // 字体文件输出路径及命名规则
          }
          return '[ext]/name1-[hash].[ext]' // 其他资源文件输出路径及命名规则
        }
      }
    }
  }
})

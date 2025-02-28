/**
 * @format
 * @Author: wqsong2
 * @Date: 2025/2/26 11:52
 * @Description:配置文件
 */
import { defineConfig, loadEnv, ConfigEnv  } from 'vite'
import vue from '@vitejs/plugin-vue'
import path  from 'path';
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';
import viteCompression from 'vite-plugin-compression';
import requireTransform from 'vite-plugin-require-transform';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import AutoImport from 'unplugin-auto-import/vite'
import { buildConfig } from './src/utils/build';
// https://vite.dev/config/
const pathResolve = (dir: string) => {
  return path.join(__dirname, dir)
};

const alias: Record<string, string> = {
  '@': pathResolve('src'),
  '~@': pathResolve('src'),
  '$public': pathResolve('public'),
  '@assets': pathResolve('src/assets'),
  '@components': pathResolve('src/components'),
  '@store': pathResolve('src/store'),
};
// 根据环境配置相对路径
const baseUrl = process.env.NODE_ENV === 'production' ? '/bxxtpt' : '';
const viteConfig = defineConfig((mode:ConfigEnv)=> {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    define:{'process.env':env},
    base: process.env.NODE_ENV === 'production' ? '/bxxtpt' : '/',
    plugins: [
      vue(),
      vueSetupExtend(),
      // viteCompression(),
      JSON.parse(env.VITE_OPEN_CDN) ? buildConfig.cdn() : null,
      requireTransform({
        fileRegex: /.js$|.vue$/
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: false
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    root: process.cwd(),
    resolve: { alias },
    optimizeDeps: { exclude: ['vue-demi'] },
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT as unknown as number,
      hot: 'only', // 热更新替换，更新页面
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      },
      proxy: {
        '/bx_xtpt': {
          target: 'http://172.30.93.230:8899',
          //target:'http://10.1.203.5:7766',
          // target:'http://36.140.107.198:28080',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/bx_xtpt': ''
          },
        },
        // ...require('./proxy.config')
      },
      devMiddleware: {
        writeToDisk: true
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ` $baseUrl: "${baseUrl}";@import "@/assets/styles/base.scss";`,
        },
        less: {
          javascriptEnabled: true,
          modifyVars: {
            hack: 'true; @import "@/assets/styles/element.less";' // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          },
          // additionalData: `$baseUrl: "${baseUrl}";`
        }
      }
    },
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'scss',
        patterns: [
          path.resolve(__dirname, './src/assets/styles/color.scss'),
        ]
      }
    },
    build: {
      outDir: 'dist',
      target: 'es2022',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//)?.groups!.moduleName ?? 'vender';
            }
          },
        },
        ...(JSON.parse(env.VITE_OPEN_CDN) ? { external: buildConfig.external } : {}),
      },
    },
    chainWebpack:(config)=>{
      // 引用vue-dompurify-html 代替v-html  防止xss攻击
      config.module.rule('js')
        .test(/\.m?jsx?$/)
        .exclude.clear() // exclude 优先级高于 include,
        .end()
        .include.add(
        path.resolve(__dirname, 'node_modules', 'vue-dompurify-html')
      )
    }
  }
});
export default viteConfig
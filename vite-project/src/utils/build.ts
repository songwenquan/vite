/**
 * @format
 * @Author: wqsong2
 * @Date: 2025/2/26
 * @Description:配置文件
 */
import importToCDN from 'vite-plugin-cdn-import';
/**
 * 打包相关
 * 注意 prodUrl：使用的是 jsdelivr 还是 unpkg。它们的 path 可能不一致
 * 文章链接：https://blog.csdn.net/qq_34450741/article/details/129766676，使用的是 jsdelivr
 * @description importToCDN https://github.com/mmf-fe/vite-plugin-cdn-import
 * @description cdn 在线引入的 cdn 地址配置。path：https://www.jsdelivr.com/ || https://unpkg.com/
 * @description external 打包时，过滤包导入。参考：https://rollupjs.org/configuration-options/#external
 */
export const buildConfig = {
	cdn() {
		return importToCDN({
			prodUrl: 'https://unpkg.com/{name}@{version}/{path}',
			modules: [
				{
					name: 'vue',
					var: 'Vue',
					path: 'dist/vue.global.js',
				},
				{
					name: 'vue-demi',
					var: 'VueDemi',
					path: 'lib/index.iife.js',
				},
				{
					name: 'vue-router',
					var: 'VueRouter',
					path: 'dist/vue-router.global.js',
				},
				{
					name: 'element-plus',
					var: 'ElementPlus',
					path: 'dist/index.full.js',
				},
				{
					name: '@element-plus/icons-vue',
					var: 'ElementPlusIconsVue',
					path: 'dist/index.iife.min.js',
				},
				{
					name: 'echarts',
					var: 'echarts',
					path: 'dist/echarts.min.js',
				},
				{
					name: 'vue-i18n',
					var: 'VueI18n',
					path: 'dist/vue-i18n.global.min.js',
				},
			],
		});
	},
	external: ['vue', 'vue-router', 'element-plus', '@element-plus/icons-vue', 'echarts', 'vue-i18n'],
};

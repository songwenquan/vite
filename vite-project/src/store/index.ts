/*
 * @Author: wqsong2
 * @Date: 2023/10/10 17:21
 * @Desciption:vuex 总入口
 */
import { createStore } from 'vuex';
import { createApp } from 'vue';
import { RootState } from '@/store/types';
const app = createApp({});
// 使用 import.meta.glob 来获取所有匹配的文件
const files:Record<any, any> = import.meta.glob('./modules/*.ts', { eager: true });
const modules: any = {};
// 收集模块
Object.keys(files).forEach((key) => {
	// 文件名为 key
	const moduleName = key.replace(/(\.\/modules\/|\.ts)/g, '');
	modules[moduleName] = files[key].default;
});

// 设置命名空间属性
Object.keys(modules).forEach((key) => {
	modules[key].namespaced = true;
});
const store = createStore<RootState>({ modules });
/**
 * 安装vuex
 * @param {*} app
 */
Object.defineProperty(app.config.globalProperties, '$store', {
	enumerable: true,
	get() {
		return store;
	},
});
export default store;

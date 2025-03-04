/*
 * @Author: wqsong2
 * @Date: 2023/10/10 17:21
 * @Desciption:请求service封装总入口
 */
import { camelCase } from 'lodash';
// 使用 Vite 的 import.meta.glob 来匹配所有的 .ts 文件
const modules = import.meta.glob('./**/*.ts');

async function loadModules() {
	const services = {}; // 假设这是你的全局服务对象
	for (const path in modules) {
		const module: any = await modules[path]();
		const moduleDefinition = module.default || module;
		const modulePath: any = path
			.replace(/^\.\/modules\//, '')
			.replace(/(\.service)?\.\w+$/, '')
			.split('/')
			.map(camelCase);
		const leafService = getNamespace(services, modulePath);
		leafService[modulePath.pop()] = {
			...moduleDefinition,
		};
	}
	return services;
}

export default {
	async install(app: any) {
		const services = await loadModules();
		Object.defineProperty(app.config.globalProperties, '$api', {
			enumerable: true,
			get() {
				return services;
			},
		});
	},
};
function getNamespace(subtree: any, path: any): any {
	if (path.length === 1) {
		return subtree;
	}
	const namespace = path.shift();
	subtree[namespace] = {
		...subtree[namespace],
	};
	return getNamespace(subtree[namespace], path);
}

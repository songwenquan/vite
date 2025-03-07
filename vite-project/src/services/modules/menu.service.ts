/*
 * @Author: wqsong2
 * @Date: 2025/2/25 18:59
 * @Desciption:
 */
import HttpClient from '@/utils/http-client';
import { config } from '@/configs/index';
const http1$ = new HttpClient(config.baseUrl);
export default {
	// 菜单列表
	menuList(data:any) {
		return http1$.request({
			url: 'system/menu/list',
			method: 'get',
			params: data
		});
	},
	// 菜单详情
	getMenu(data:any) {
		return http1$.request({
			url: 'system/menu/' + data,
			method: 'get',
		});
	},
	// 新增菜单
	addMenu(data:any) {
		return http1$.request({
			url: 'system/menu',
			method: 'post',
			data: data,
			isJson:true
		});
	},
	// 修改菜单
	updateMenu(data:any) {
		return http1$.request({
			url: 'system/menu',
			method: 'put',
			data: data,
			isJson:true
		});
	},
	// 删除菜单
	delMenu(data:any) {
		return http1$.request({
			url: 'system/menu/' + + data,
			method: 'delete'
		});
	},
	// 查询字典类型列表
	listType(data:any) {
		return http1$.request({
			url: '/system/dict/type/list' + data,
			method: 'get',
		})
	}
};

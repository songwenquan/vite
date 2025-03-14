/*
 * @Author: wqsong2
 * @Date: 2023/10/17 15:15
 * @Desciption:路由  keepAlive:是否缓存 fullScreen:页面布局类型  requireAuth:是否需要登录 nobread:是否显示面包屑导航  isHideAside: 是否显示侧边栏,
 * fullScreen   TCB 左侧列表布局   TCB-TOP 顶部菜单列表布局  currency 自定义布局  noTagsView 是否展示已点击菜单序列  affix 是否支持删除
 * 严格按照写法编写路由
 */
const Layout = import('@/views/index.vue')
export const constantRoutes = [
	{
		path: '/:pathMatch(.*)*',
		component: () => import('@/views/error/404.vue'),
	},
	{
		path: '/system/dict-data',
		component: ()=> Layout,
		redirect: '/system/dict',
		meta: {
			title: '字典管理',
		},
		children: [
			{
				path: 'index',
				component: () => import('@/views/system/dict/data.vue'),
				name: 'Data',
				meta: {
					title: '字典数据',
					fullScreen:'TCB',
					keepAlive:false,
					requireAuth:true,
					nobread:true,
					noTagsView:true,
					isHideAside:true,
					affix:true,
					activeMenu: '/system/dict'
				}
			}
		]
	},
];
export default constantRoutes;

/*
 * @Author: wqsong2
 * @Date: 2024/10/30 17:47
 * @Desciption:
 */
export default [
	{
	  path: '/login',
	  name: 'login',
	  meta: {
	    title: '扫码登录',
	    keepAlive: false,
	    fullScreen: 'CUSTOM',
	    requireAuth: false,
	  },
	  component: () => import('@/views/login/index.vue'),
	},
];

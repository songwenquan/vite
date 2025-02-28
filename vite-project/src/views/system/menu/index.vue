/* * @Author: wqsong2 * @Date: 2025/2/25 17:04 * @Desciption:菜单管理 */
<template>
	<div id="system-menu-page" class="system-manage-page">
		<SearchForm
			ref="searchForm"
			:list="list"
			@update:list="updateList"
			:more-button="moreButton"
			:Initialize="Initialize"
			@search="onSearch"
		></SearchForm>
		<div class="list-wrap">
			<tableTitle :matched="matched" show-right-btn class="top_content">
				<template v-slot:rightBtn>
					<el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
					<el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
				</template>
			</tableTitle>
			<TableList
				ref="tableList"
				:showExpand="true"
				:key-list="keyList"
				:params="params"
				service="menu"
				:border="true"
				api="menuList"
				:handle-data="handleData"
				heights="100%"
			></TableList>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useStoreState, useStoreActions } from '@/store/vuex';
import SearchForm from '@/components/search-form/index.vue';
import tableTitle from '@/components/table/tableTitle.vue';
import TableList from '@/components/table/tableList.vue';
const { list, moreButton, params, keyList } = toRefs(
	reactive({
		moreButton: false as boolean, // 是否展示更多按钮
		params: {}, // 搜索参数
		list: [
			{
				code: 'ssqdName',
				name: '菜单名称',
				span: 6,
				type: 1,
			},
			{
				code: 'itemType',
				name: '办件类型',
				span: 6,
				type: 2,
				dictKey: 'sys_normal_disable',
			},
		],
		keyList: [
			{
				name: '菜单名称',
				code: 'menuName',
			},
			{
				name: '图标',
				code: 'icon',
				svgShow: true,
			},
		],
	})
);
// 获取当前页面的列表标题
const { matched } = toRefs(reactive(useStoreState('menu', ['matched'])));
// 调用store-dictList-actions接口获取当前页面依赖字典值
const storeActions = useStoreActions('dictList', ['getDicListUrl']);
storeActions.getDicListUrl({ url: '', type: 'sys_normal_disable' });

// 查询
const tableList = ref(null);
const onSearch = () => {
	(tableList.value as any).init();
};
// 处理列表数据
const handleData = (data: any) => {
	return [data.data, data.data.length];
};
// 初始化执行方法
const Initialize = (data: any) => {
	params.value = data;
};
// 数据更新修改list value数据源
const updateList = (data: any) => {
	(list as any).value.forEach((item: any) => {
		item.value = data[item.code];
	});
};
onMounted(() => {
	onSearch();
});
</script>
<style scoped lang="scss">
.system-manage-page {
	display: flex;
	flex-direction: column;
	height: 100%;
	box-sizing: border-box;
	.list-wrap {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
	}
}
</style>

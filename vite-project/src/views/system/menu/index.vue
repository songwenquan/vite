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
      <el-table v-if="refreshTable" border :data="menuList" row-key="menuId" :default-expand-all="isExpandAll"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="icon" label="图标" align="center">
          <template #default="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="90" align="center"></el-table-column>
        <el-table-column prop="perms" label="权限标识" width="200" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column prop="component" label="组件路径" width="200" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template #default="scope">
            <span>{{ (scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" >修改</el-button>
            <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)">新增</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useStoreState, useStoreActions } from '@/store/vuex';
import SearchForm from '@/components/search-form/index.vue';
import tableTitle from '@/components/table/tableTitle.vue';
import {handleTree} from "@/utils/utils";
const { proxy } = getCurrentInstance();
const { list, moreButton, params,refreshTable,isExpandAll,menuList} = toRefs(
	reactive({
		moreButton: false as boolean, // 是否展示更多按钮
		params: {}, // 搜索参数
		list: [
			{
				code: 'menuName',
				name: '菜单名称',
				span: 6,
				type: 1,
			},
			{
				code: 'status',
				name: '状态',
				span: 6,
				type: 2,
				dictKey: 'sys_normal_disable',
			},
		],
    refreshTable:true,
    isExpandAll:false,
    menuList:[],
	})
);
// 获取当前页面的列表标题
const { matched } = toRefs(reactive(useStoreState('menu', ['matched'])));
// 调用store-dictList-actions接口获取当前页面依赖字典值
const storeActions = useStoreActions('dictList', ['getDicListUrl']);
storeActions.getDicListUrl({ url: '', type: 'sys_normal_disable' });
const { sys_normal_disable } = toRefs(reactive(useStoreState('dictList', ['sys_normal_disable'])));

// 查询
const onSearch = async () => {
  const {code,data} = await proxy.$api.menu.menuList(params.value);
  if(code === '200'){
    menuList.value = handleTree(data,'menuId');
  }else {
    menuList.value = []
  }
};
// 展开/折叠操作
const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
};
// 修改
const handleUpdate = (item:any) => {
  console.log(item);
}
// 新增
const handleAdd = (item:any) => {
  console.log(item);
}
// 删除
const handleDelete = (item:any) => {
  console.log(item);
}
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

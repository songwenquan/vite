/*
* @Author: wqsong2
* @Date: 2025/3/10 15:08
* @Desciption:字典数据
*/
<template>
  <div class="data">
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
          <el-button type="primary" plain icon="Edit" @click="handleUpdate">修改</el-button>
          <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
          <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
          <el-button type="danger" plain icon="Close" @click="handleClose">关闭</el-button>
        </template>
      </tableTitle>
      <TableList ref="tableList" :multiple="true" :border="true" :params="params" service="menu" :show-page="true"
                 api="listData" :paramsFn="paramsFn" :key-list="keyList" 	:btnObj="btnObj" row-key="dictCode" :handle-data="handleData">
      </TableList>
    </div>
  </div>
</template>
<script setup lang="ts">
import SearchForm from "@/components/search-form/index.vue";
import { useStoreState, useStoreActions } from '@/store/vuex';
import { useRoute } from 'vue-router';
import tableTitle from '@/components/table/tableTitle.vue';
import TableList from "@/components/table/tableList.vue";
import {tansParams} from "@/utils/utils";
const { proxy } = getCurrentInstance() as any; // this
const route = useRoute();
const tableList = ref(null);
// 调用store-dictList-actions接口获取当前页面依赖字典值
const storeActions = useStoreActions('dictList', ['getDicListUrl2','getDicListUrl']);
storeActions.getDicListUrl2({ url: '', type: 'optionselect' });
storeActions.getDicListUrl({ url: '', type: 'sys_normal_disable' });
const { optionselect,sys_normal_disable } = toRefs(reactive(useStoreState('dictList', ['optionselect','sys_normal_disable'])));
const {list, params, moreButton,multiple,keyList,btnObj} = toRefs(
    reactive({
      moreButton: false as boolean, // 是否展示更多按钮
      params: {}, // 搜索参数
      list: [
        {
          code: 'dictType',
          name: '字典名称',
          span: 6,
          type: 2,
          dictKey:'optionselect',
        },
        {
          code: 'dictLabel',
          name: '字典标签',
          span: 6,
          type: 1,
        },
        {
          code: 'status',
          name: '状态',
          span: 6,
          type: 2,
          dictKey:'sys_normal_disable',
        },
      ],
      multiple:true,
      keyList:[
        {
          code: 'dictCode',
          name: '字典编码',
          span: 6,
          type: 1,
        },
        {
          code: 'dictLabel',
          name: '字典标签',
          type:'dictTag',
          itemTag:true
        },
        {
          code: 'dictValue',
          name: '字典键值',
        },
        {
          code: 'dictSort',
          name: '字典排序',
        },
        {
          code: 'status',
          name: '状态',
          type:'dictTag',
          options:sys_normal_disable
        },
        {
          code: 'remark',
          name: '备注',
        },
        {
          code: 'createTime',
          name: '创建时间',
        },
      ],
      btnObj: {
        name: '操作',
        fiexd: false,
      }
    })
);
// 入参二次处理
const paramsFn = (data:any) => {
  delete data.pageNo;
  data = tansParams(data)
  return '?' + data
}
const handleData = (row:any)=>{
  row.data.rows.forEach((item:any)=>{
    item.value = item.dictLabel
    item.label = item.dictLabel
    item.elTagType = item.listClass
    item.elTagClass = item.listClass
  })
  return [row.data.rows,row.data.total]
}
// 获取当前页面的列表标题
const { matched } = toRefs(reactive(useStoreState('menu', ['matched'])));
// 新增
const handleAdd = () => {

}
// 修改
const handleUpdate = () => {

}
// 删除
const handleDelete = () => {

}
// 导出
const handleExport = () => {

}
// 关闭
const handleClose = () => {

}
// 查询菜单列表
const onSearch = () => {
  (tableList.value as any).init();
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
const getTypes = async (dictId:string)=>{
  const {code,data} = await proxy.$api.menu.getType(dictId)
  if(code === '200'){
    params.value.dictType = data.dictType
    onSearch();
  }
}
watch(()=>tableList.value?.select,(newV)=>{
  multiple.value = newV.length > 0 ? false : true
},{deep:true})
onMounted(() => {
  getTypes(history.state && history.state.dictId)
});
</script>
<style scoped lang="scss">
.data {
}
</style>
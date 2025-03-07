/*
* @Author: wqsong2
* @Date: 2025/3/7 14:54
* @Desciption:字典管理
*/
<template>
  <div class="system-dict-page">
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
          <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
          <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
          <el-button type="danger" plain icon="Refresh" @click="handleRefreshCache">刷新缓存</el-button>
        </template>
      </tableTitle>
      <TableList ref="tableList" :multiple="true" :border="true" :params="params" service="menu" :show-page="true"
                 api="listType" :paramsFn="paramsFn" :key-list="keyList">
      </TableList>
    </div>
  </div>
</template>
<script setup lang="ts">
import SearchForm from "@/components/search-form/index.vue";
import { useStoreState,useStoreActions} from '@/store/vuex';
import {time} from "@/utils/utils";
import tableTitle from "@/components/table/tableTitle.vue";
import TableList from "@/components/table/tableList.vue";
// 点击字典类型详情
const routerPush = (item:any) => {
  console.log(item)
}
// 调用store-dictList-actions接口获取当前页面依赖字典值
const storeActions = useStoreActions('dictList', ['getDicListUrl']);
storeActions.getDicListUrl({ url: '', type: 'sys_normal_disable' });
const { sys_normal_disable } = toRefs(reactive(useStoreState('dictList', ['sys_normal_disable'])));

const { list,params, moreButton,multiple,keyList} = toRefs(
    reactive({
      moreButton: false as boolean, // 是否展示更多按钮
      params: {}, // 搜索参数
      list: [
        {
          code: 'dictName',
          name: '字典名称',
          span: 6,
          type: 1,
        },
        {
          code: 'dictType',
          name: '字典类型',
          span: 6,
          type: 1,
        },
        {
          code: 'status',
          name: '状态',
          span: 6,
          type: 2,
          dictKey:'sys_normal_disable'
        },
        {
          code: 'dateRange',
          name: '创建时间',
          span: 6,
          type: 4,
          func: time,
          codeType:['beginTime', 'endTime'],
        },
      ],
      multiple:true,
      keyList:[
        {
          code: 'dictId',
          name: '字典编号',
        },
        {
          code: 'dictName',
          name: '字典名称',
        },
        {
          code: 'dictType',
          name: '字典类型',
          click:routerPush
        },
        {
          code: 'status',
          name: '状态',
          type:'dictTag',
          options:sys_normal_disable
        },
      ]
    })
);
// 入参二次处理
const tansParams = (params) => {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    let part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            let params = propName + '[' + key + ']'
            let subPart = encodeURIComponent(params) + '='
            result = result === '' ? subPart + encodeURIComponent(value[key]) : result + '&' + subPart + encodeURIComponent(value[key])
          }
        }
      } else {
        result = result === '' ? part + encodeURIComponent(value) : result + '&' + part + encodeURIComponent(value)
      }
    }
  }
  return result
}
const paramsFn = (data:any) => {
  data.params = {
    beginTime:data.beginTime,
    endTime:data.endTime,
  }
  delete data.pageNo;
  delete data.dateRange
  delete data.beginTime
  delete data.endTime
  console.log('1')
  data = tansParams(data)
  return '?' + data
}
// 获取当前页面的列表标题
const { matched } = toRefs(reactive(useStoreState('menu', ['matched'])));
// 新增
const handleAdd = () => {
}
// 删除
const handleDelete = () => {
}
// 导出
const handleExport = () => {
}
// 刷新缓存
const handleRefreshCache = () => {
}

// 查询菜单列表
const tableList = ref(null);
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
onMounted(() => {
  onSearch();
});
</script>
<style scoped lang="scss">
.system-dict-page {
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
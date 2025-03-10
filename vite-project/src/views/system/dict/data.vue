/*
* @Author: wqsong2
* @Date: 2025/3/10 15:08
* @Desciption:
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
  </div>
</template>
<script setup lang="ts">
import SearchForm from "@/components/search-form/index.vue";

const {list, params, moreButton} = toRefs(
    reactive({
      moreButton: false as boolean, // 是否展示更多按钮
      params: {}, // 搜索参数
      list: [],
    })
);
// 查询菜单列表
const onSearch = () => {
  console.log('111')
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
.data {
}
</style>
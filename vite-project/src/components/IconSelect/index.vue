/*
* @Author: wqsong2
* @Date: 2025/3/6 16:41
* @Desciption:
*/
<template>
  <div class="icon-body">
    <el-input v-model="iconName" class="icon-search" clearable placeholder="请输入图标名称" @clear="filterIcons" @input="filterIcons">
      <template #suffix><el-icon><Search /></el-icon></template>
    </el-input>
    <div class="icon-list">
      <div class="list-container">
        <div v-for="(item, index) in iconList" class="icon-item-wrapper" :key="index" @click="selectedIcon(item)">
          <div :class="['icon-item', { active: activeIcon === item }]">
            <svg-icon :icon-class="item" class-name="icon" style="height: 25px; width: 16px" />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import icons from './requireIcons'
const props = defineProps({
  activeIcon: {
    type: String
  }
})
const {iconName} = toRefs(reactive({
  iconName:''
}))
const emit = defineEmits(['selected'])
const iconList = ref(icons)
const filterIcons = () => {
  iconList.value = icons
  if (iconName.value) {
    iconList.value = icons.filter(item => item.indexOf(iconName.value) !== -1)
  }
}
const selectedIcon = (name) => {
  emit('selected', name)
  document.body.click()
}
const reset = () => {
  iconName.value = ''
  iconList.value = icons
}
defineExpose({
  reset
})
</script>
<style scoped lang="scss">
.icon-body {
  padding: 10px;
  .el-icon-search {
    position: relative;
    margin-bottom: 5px;
  }
  .icon-list {
    height: 200px;
    overflow: auto;
    .list-container {
      display: flex;
      flex-wrap: wrap;
      .icon-item-wrapper {
        width: calc(100% / 3);
        height: 25px;
        line-height: 25px;
        cursor: pointer;
        .icon-item {
          display: flex;
          max-width: 100%;
          height: 100%;
          padding: 0 5px;
          &:hover {
            background: #ececec;
            border-radius: 5px;
          }
          .icon {
            flex-shrink: 0;
          }
          span {
            fill: currentColor;
            padding-left: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .icon-item.active {
          background: #ececec;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
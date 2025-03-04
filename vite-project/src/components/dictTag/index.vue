/*
* @Author: wqsong2
* @Date: 2025/3/3 18:28
* @Desciption:字典值转化为中文标签
*/
<template>
  <template v-for="(item, index) in options">
    <template v-if="values.includes(item.value)">
      <span v-if="item.elTagType == 'default' || item.elTagType == ''" :key="item.value" :index="index" :class="item.elTagClass">{{ item.label + ' ' }}</span>
      <el-tag v-else :disable-transitions="true" :key="item.value + ''" :index="index" :type="item.elTagType === 'primary' ? 'primary' : item.elTagType" :class="item.elTagClass">{{ item.label + ' ' }}</el-tag>
    </template>
  </template>
  <template v-if="unmatch && showValue">
    {{ unmatchArray}}
  </template>
</template>
<script setup lang="ts">
const props = defineProps({
  // 数据
  options: {
    type: Array,
    default: null
  },
  // 当前的值
  value: [Number, String, Array],
  // 当未找到匹配的数据时，显示value
  showValue: {
    type: Boolean,
    default: true
  }
})
const {options} = toRefs(props);
const {unmatchArray} = toRefs(reactive({
  unmatchArray:[] // 记录未匹配的项
}))
const values = computed(() => {
  if (props.value !== null && typeof props.value !== 'undefined') {
    return Array.isArray(props.value) ? props.value : [String(props.value)]
  } else {
    return []
  }
})
const unmatch = computed(() => {
  unmatchArray.value = []
  if (props.value !== null && typeof props.value !== 'undefined') {
    // 传入值为非数组
    if (!Array.isArray(props.value)) {
      if (props.options.some(v => v.value == props.value)) return false
      unmatchArray.value.push(props.value)
      return true
    }
    // 传入值为Array
    props.value.forEach(item => {
      if (!props.options.some(v => v.value == item)) unmatchArray.value.push(item)
    })
    return true
  }
  // 没有value不显示
  return false
})
watch(unmatchArray,(newVal:any)=>{
  if (newVal.length === 0) return ''
  return newVal.reduce((pre, cur) => {
    return pre + ' ' + cur
  })
})
</script>
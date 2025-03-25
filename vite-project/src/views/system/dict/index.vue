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
                 api="listType" :paramsFn="paramsFn" :key-list="keyList" 	:btnObj="btnObj" row-key="dictId" @handleClick="handleClick">
      </TableList>
    </div>
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dictRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import SearchForm from "@/components/search-form/index.vue";
import { useStoreState,useStoreActions} from '@/store/vuex';
import {time, tansParams, exportExcel} from "@/utils/utils";
import tableTitle from "@/components/table/tableTitle.vue";
import TableList from "@/components/table/tableList.vue";
import router from "@/router";
const { proxy } = getCurrentInstance();
// 调用store-dictList-actions接口获取当前页面依赖字典值
const storeActions = useStoreActions('dictList', ['getDicListUrl','cleanDict']);
storeActions.getDicListUrl({ url: '', type: 'sys_normal_disable' });
const { sys_normal_disable } = toRefs(reactive(useStoreState('dictList', ['sys_normal_disable'])));
const tableList = ref(null);
const { list,params, moreButton,multiple,keyList,btnObj,open,form,rules,title} = toRefs(
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
          click:(item:any) => {
            router.push(
                { path: '/system/dict-data/index', state: {dictId: item.dictId}}
            );
          }
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
      btnObj:{
        name: '操作',
        fiexd: false,
        list: [
          {
            name: '修改',
            callBackName: 'handleUpdate',
          },
          {
            name: '删除',
            callBackName: 'handleDelete',
          },
        ],
      },
      open:false,
      form: {
        status: '0',
      },
      rules: {
        dictName: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
        dictType: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }]
      },
      title:''
    })
);
// 入参二次处理
const paramsFn = (data:any) => {
  data.params = {
    beginTime:data.beginTime,
    endTime:data.endTime,
  }
  delete data.pageNo;
  delete data.dateRange
  delete data.beginTime
  delete data.endTime
  data = tansParams(data)
  return '?' + data
}
// 获取当前页面的列表标题
const { matched } = toRefs(reactive(useStoreState('menu', ['matched'])));
// 新增
const handleAdd = () => {
  open.value = true
  title.value = '添加字典类型'
}
// 操作按钮list
const buttonList = {
  // 修改
  handleUpdate(row:any){
    form.value = row
    open.value = true
    title.value = '修改字典类型'
  },
  // 删除
  handleDelete(row:any){
    proxy.$ElMessage.confirm('是否确认删除名称为"' + row.dictName + '"的数据项?',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        })
        .then(async ()=>{
          const {code} = await proxy.$api.menu.delType(row.dictId);
          if(code === '200'){
            proxy.$message.success('删除成功')
            await onSearch()
          }
        })
        .catch(() => {})
  }
};
// 取消按钮
const cancel = () => {
  open.value = false
  reset()
}
// 提交保存
const dictRef = ref(null)
const submitForm = () => {
  dictRef.value.validate(async valid => {
    if (valid) {
      if (form.value.dictId != undefined) {
        const {code,msg} = await proxy.$api.menu.updateType(form.value);
        if(code === '200'){
          proxy.$message.success('修改成功')
          cancel()
          await onSearch()
        }else {
          proxy.$message.error(msg)
        }
      } else {
        const {code,msg} = await proxy.$api.menu.addType(form.value);
        if(code === '200'){
          proxy.$message.success('新增成功')
          cancel()
          await onSearch()
        }else {
          proxy.$message.error(msg)
        }
      }
    }
  })
}
// 表单重置
const reset = () => {
  form.value = {
    status: '0',
  }
  dictRef.value.resetFields()
}
// 删除
const handleDelete = () => {
  let ids = (tableList.value as any).select.map(item => item.dictId)
  let name = (tableList.value as any).select.map(item => item.dictName)
  proxy.$ElMessage.confirm('是否确认删除名称为"' + name + '"的数据项?',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
      .then(async ()=>{
        const {code} = await proxy.$api.menu.delType(ids);
        if(code === '200'){
          proxy.$message.success('删除成功')
          await onSearch()
        }
      })
      .catch(() => {})
}
// 导出
const handleExport = () => {
  exportExcel({...params.value,pageNum:1,pageSize:10}, 'menu', 'export',
      `dict_${new Date().getTime()}.xlsx`, proxy, 'application/x-www-form-urlencoded');
}
// 刷新缓存
const handleRefreshCache = async () => {
  const {code} = await proxy.$api.menu.refreshCache();
  proxy.$message.success('刷新成功');
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
// 列表按钮点击
const handleClick = (item: any, callBackName: any, index: any, scope: any) => {
  (buttonList as any)[callBackName](item, index, scope);
};
// 监听列表勾选
watch(()=>tableList.value?.select,(newV)=>{
  multiple.value = newV.length > 0 ? false : true
},{deep:true})
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
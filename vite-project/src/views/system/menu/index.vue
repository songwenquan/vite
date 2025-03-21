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
            <el-button link type="primary" @click="handleUpdate(scope.row)" >修改</el-button>
            <el-button link type="primary" @click="handleAdd(scope.row)">新增</el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
		</div>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="open" width="680px" append-to-body>
      <el-form ref="menuRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <Treeselect v-model:searchForm="form" :keyValue="keyValue" :departmentData="menuOptions" :placeholder="'请选择'"
                          :getChildListFunc="dataChild" @change="changeFn"></Treeselect>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio value="M">目录</el-radio>
                <el-radio value="C">菜单</el-radio>
                <el-radio value="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24"  v-if="form.menuType != 'F'">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover placement="bottom-start" :width="540" v-model:visible="showChooseIcon" trigger="click" @show="showSelectIcon">
                <template #reference>
                  <el-input v-model="form.icon" placeholder="点击选择图标" @blur="showSelectIcon" v-click-outside="hideSelectIcon" readonly>
                    <template #prefix>
                      <svg-icon v-if="form.icon" :icon-class="form.icon" class="el-input__icon" style="height: 32px; width: 16px" />
                      <el-icon v-else style="height: 32px; width: 16px"><search /></el-icon>
                    </template>
                  </el-input>
                </template>
                <IconSelect ref="iconSelectRef" @selected="selected" :active-icon="form.icon" />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                    <el-icon><question-filled /></el-icon> </el-tooltip>是否外链
                </span>
              </template>
              <el-radio-group v-model="form.isFrame">
                <el-radio value="0">是</el-radio>
                <el-radio value="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <template #label>
                <span>
                  <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由地址
                </span>
              </template>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="component">
              <template #label>
                <span>
                  <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  组件路径
                </span>
              </template>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item>
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
              <template #label>
                <span>
                  <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  权限字符
                </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item>
              <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
              <template #label>
                <span>
                  <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由参数
                </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  是否缓存
                </span>
              </template>
              <el-radio-group v-model="form.isCache">
                <el-radio value="0">缓存</el-radio>
                <el-radio value="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  显示状态
                </span>
              </template>
              <el-radio-group v-model="form.visible">
                <el-radio v-for="dict in sys_show_hide" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  菜单状态
                </span>
              </template>
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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
import { ClickOutside as vClickOutside } from 'element-plus'
import { useStoreState, useStoreActions } from '@/store/vuex';
import SearchForm from '@/components/search-form/index.vue';
import tableTitle from '@/components/table/tableTitle.vue';
import IconSelect from '@/components/IconSelect/index.vue';
import {handleTree, recursion} from "@/utils/utils";
import Treeselect from "@/components/Treeselect/index.vue";
const { proxy } = getCurrentInstance();
const { list, moreButton, params,refreshTable,isExpandAll,menuList,title,open,form,rules,menuOptions,keyValue,showChooseIcon} = toRefs(
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
    title:'',
    open:false,
    form: {
      menuId: undefined,
      parentId: 0,
      parentIdName:'主类目',
      menuName: undefined,
      icon: undefined,
      menuType: 'M',
      orderNum: undefined,
      isFrame: '1',
      isCache: '0',
      visible: '0',
      status: '0'
    },
    rules: {
      menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
      orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
      path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }]
    },
    menuOptions:[],
    keyValue:['parentId','parentIdName'],
    showChooseIcon:false
	})
);
// 获取当前页面的列表标题
const { matched } = toRefs(reactive(useStoreState('menu', ['matched'])));
// 调用store-dictList-actions接口获取当前页面依赖字典值
const storeActions = useStoreActions('dictList', ['getDicListUrl']);
storeActions.getDicListUrl({ url: '', type: 'sys_normal_disable,sys_show_hide' });
const { sys_normal_disable,sys_show_hide } = toRefs(reactive(useStoreState('dictList', ['sys_normal_disable','sys_show_hide'])));
// 查询菜单列表
const onSearch = async () => {
  const {code,data} = await proxy.$api.menu.menuList(params.value);
  if(code === '200'){
    menuList.value = handleTree(data,'menuId');
  }else {
    menuList.value = []
  }
};
// 查询菜单下拉树结构
const getTreeselect = async () => {
  menuOptions.value = []
  const {code,data} = await proxy.$api.menu.menuList();
  data.map((item)=>{
    item.id = item.menuId
    item.code = item.menuId
    item.areaName = item.menuName
  })
  if(code === '200'){
    const menu = { id:0,code:0,areaName:'主类目',menuId: 0, menuName: '主类目', children: [] }
    menu.children = handleTree(data, 'menuId')
    menuOptions.value.push(menu)
  }
}
const dataChild = (node) => {
  console.log(node.data.children)
  node.data.children.forEach(item=>{
    if(item.children && item.children.length > 0){
      item.hasChildren = '1'
    }
  })
  return node.data.children
}
const changeFn = (val:any) => {
  form.value.parentId = val.code
  form.value.parentIdName = val.areaName
}
const iconSelectRef = ref(null)
// 展示下拉图标
const showSelectIcon = () => {
  iconSelectRef.value.reset()
  showChooseIcon.value = true
}
// 选择图标
const selected = (name:any) => {
  form.value.icon = name
  showChooseIcon.value = false
}
// 图标外层点击隐藏下拉列表
const hideSelectIcon = (event) => {
  let elem = event.relatedTarget || event.srcElement || event.target || event.currentTarget
  let className = elem.className
  if (className !== 'el-input__inner') {
    showChooseIcon.value = false
  }
}
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
  getTreeselect().then(async ()=>{
    const {code,data} = await proxy.$api.menu.getMenu(item.menuId);
    if(code === '200'){
      if(data.parentId === '0'){
        data.parentIdName = '主类目'
      }else {
        data.parentIdName = recursion(menuList.value,data.parentId,['menuId','menuName'])
      }
      form.value = data
      open.value = true
      title.value = '修改菜单'
    }
  })
}
// 新增
const handleAdd = (item:any) => {
  getTreeselect().then(()=>{
    if (item != null && item.menuId) {
      form.value.parentId = item.menuId
    } else {
      form.value.parentId = 0
    }
    open.value = true
    title.value = '添加菜单'
  })
}
// 删除
const handleDelete = (item:any) => {
  proxy.$ElMessage.confirm(
      '是否确认删除名称为"' + item.menuName + '"的数据项?',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
      .then(async ()=>{
        const {code} = await proxy.$api.menu.delMenu(item.menuId);
        if(code === '200'){
          proxy.$message.success('删除成功')
          await onSearch()
        }
      })
      .catch(() => {})
}
// 取消按钮
const cancel = () => {
  open.value = false
  reset()
}
// 表单重置
const menuRef = ref(null)
const reset = () => {
  form.value = {
    menuId: undefined,
    parentId: 0,
    parentIdName:'主类目',
    menuName: undefined,
    icon: undefined,
    menuType: 'M',
    orderNum: undefined,
    isFrame: '1',
    isCache: '0',
    visible: '0',
    status: '0'
  }
  menuRef.value.resetFields()
}
// 提交保存
const submitForm = () => {
  proxy.$refs['menuRef'].validate(async valid => {
    if (valid) {
      if (form.value.menuId != undefined) {
        const param = JSON.parse(JSON.stringify(form.value))
        delete param.parentIdName
        const {code} = await proxy.$api.menu.updateMenu(param);
        if(code === '200'){
          proxy.$message.success('修改成功')
          open.value = false
          await onSearch()
        }
      } else {
        const param = JSON.parse(JSON.stringify(form.value))
        delete param.parentIdName
        const {code} = await proxy.$api.menu.addMenu(param);
        if(code === '200'){
          proxy.$message.success('新增成功')
          open.value = false
          await onSearch()
        }
      }
    }
  })
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

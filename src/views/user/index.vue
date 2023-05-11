<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { type IGetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { IUser } from "@/api/login/types/login"
import { delUser, geUserList, registerUser } from "@/api/login/index"

defineOptions({
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const imgBase = reactive(import.meta.env.VITE_IMAGE_BASE_API)
// const uploadApi = reactive(import.meta.env.VITE_IMAGE_UPLOAD_API)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  username: "",
  password: ""
})
//#region 校验
const validatePassword = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入密码"))
  }
  if (value.length < 6 || value.length > 16) {
    return callback(new Error("密码长度应为6-16位"))
  }
  callback()
}
const formRules: any = reactive({
  username: [
    { required: true, trigger: "blur", message: "请输入手机号" },
    { pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }
  ],
  password: [
    { required: true, trigger: "blur", message: "请输入密码" },
    { validator: validatePassword, trigger: "blur" }
  ]
})
//#endregion
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        registerUser({
          username: formData.username,
          password: formData.password
        }).then((res) => {
          if (res.data) {
            ElMessage.success("新增成功")
            dialogVisible.value = false
            getTableData()
          } else {
            ElMessage.error("新增失败")
          }
        })
      } else {
        //
        console.log("TODO")
      }
    } else {
      return false
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.username = ""
  formData.password = ""
}
//#endregion

//#region 删
const handleDelete = (row: IUser) => {
  ElMessageBox.confirm(`正在删除用户：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    delUser(row.id).then((res) => {
      if (res.data) {
        ElMessage.success("删除成功")
        getTableData()
      } else {
        ElMessage.error("删除失败")
      }
    })
  })
}
//#endregion

//#region 改
const editFormData = ref<IUser>()
const editFormRules = reactive({
  mail: [{ required: true, trigger: "blur", message: "请输入邮箱" }],
  name: [{ required: true, trigger: "blur", message: "请输入昵称" }]
})
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: IGetTableData) => {
  currentUpdateId.value = row.id
  formData.username = row.username
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<IUser[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  username: "",
  phone: ""
})
const getTableData = () => {
  loading.value = true
  geUserList().then((res) => {
    const users = res.data
    paginationData.total = users.length
    tableData.value = users
  })
  loading.value = false
}
const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const handleRefresh = () => {
  getTableData()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="searchData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增用户</el-button>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="头像" align="center">
            <template #default="scope">
              <el-image type="success" :src="imgBase + scope.row.avatar" effect="plain" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="用户名" align="center" />
          <el-table-column prop="roleId" label="角色" align="center" />
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="mail" label="邮箱" align="center" />
          <!-- <el-table-column prop="status" label="等级" align="center">
            <template #default="scope">
              <el-tag>LV{{ scope.row.level }}</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column prop="message" label="留言" align="center" />
          <el-table-column prop="balance" label="余额(￥)" align="center" />
          <el-table-column prop="createDate" label="创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
      @close="resetForm"
      width="30%"
    >
      <!-- 新增 -->
      <el-form
        v-if="currentUpdateId === undefined"
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item prop="username" label="手机号">
          <el-input v-model="formData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formData.password" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <!-- 修改 -->
      <el-form
        v-else
        ref="editFormRef"
        :model="editFormData"
        :rules="editFormRules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item prop="mail" label="昵称">
          <el-input v-model="editFormData.name" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item prop="mail" label="邮箱">
          <el-input v-model="editFormData.mail" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item prop="password" label="个人签名">
          <el-input v-model="editFormData.message" placeholder="请输入个人签名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>

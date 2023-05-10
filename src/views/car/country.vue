<script lang="ts" setup>
import { reactive, ref } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, RefreshRight } from "@element-plus/icons-vue"
import * as CountryApi from "@/api/car/country"
import { ICountry } from "@/api/car/types"

defineOptions({
  name: "ElementPlus"
})

const loading = ref<boolean>(false)

//#region 提交表单
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  countryId: "",
  countryName: ""
})
const formRules: FormRules = reactive({
  countryName: [{ required: true, trigger: "blur", message: "请输入国家名称" }]
})
const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentCountryId.value === undefined) {
        // 新增
        CountryApi.addCountry(formData).then((res) => {
          if (res.data) {
            getTableData()
            resetForm()
            dialogVisible.value = false
            ElMessage.success("新增成功")
          } else {
            ElMessage.error("新增失败")
          }
        })
      } else {
        // 修改
        CountryApi.editCountry(formData).then((res) => {
          if (res.data) {
            getTableData()
            resetForm()
            dialogVisible.value = false
            ElMessage.success("修改成功")
          } else {
            ElMessage.error("修改失败")
          }
        })
      }
    } else {
      return false
    }
  })
}
const resetForm = () => {
  currentCountryId.value = undefined
  formData.countryName = ""
  formData.countryId = ""
}
//#endregion

//#region 删
const handleDelete = (row: ICountry) => {
  if (!row.countryId) {
    ElMessage.error("无法删除该国家！")
    return
  }
  ElMessageBox.confirm(`您确定删除【${row.countryName}】吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    CountryApi.delCountry(row.countryId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentCountryId = ref<undefined | string>(undefined)
const handleUpdate = (row: ICountry) => {
  currentCountryId.value = row.countryId
  formData.countryName = row.countryName
  formData.countryId = row.countryId
  dialogVisible.value = true
}
//#endregion

//#region 查
const countryList = ref<ICountry[]>([])

const getTableData = async () => {
  loading.value = true
  try {
    const res = await CountryApi.getCountrys()
    countryList.value = res.data
  } catch (error) {
    console.error(error)
    countryList.value = []
  } finally {
    loading.value = false
  }
}
getTableData()
//#endregion
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增国家</el-button>
        </div>
        <div>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <el-table :data="countryList" style="width: 100%" row-key="id" border>
        <el-table-column prop="countryId" label="国家ID" />
        <el-table-column prop="countryName" label="国家名称" />
        <el-table-column fixed="right" label="操作" width="170" align="center">
          <template #default="scope">
            <el-button type="primary" text bg size="small" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button type="danger" text bg size="small" icon="Delete" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentCountryId === undefined ? '新增国家' : '修改国家'"
      @close="resetForm"
    >
      <el-form
        :model="formData"
        ref="formRef"
        :rules="formRules"
        label-position="left"
        label-width="80px"
        size="default"
        @submit.prevent
      >
        <div class="card-container">
          <el-form-item label="国家 ID" v-if="currentCountryId">
            <el-text>{{ currentCountryId }}</el-text>
          </el-form-item>
          <el-form-item label="国家名" prop="countryName" class="required">
            <el-input v-model="formData.countryName" type="text" clearable placeholder="请输入国家名" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
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

<script lang="ts" setup>
import { reactive, ref } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, RefreshRight } from "@element-plus/icons-vue"
import * as BrandApi from "@/api/car/brand"
import * as SeriesApi from "@/api/car/series"
import { IBrand, ICarSeries } from "@/api/car/types"

defineOptions({
  name: "ElementPlus"
})

const loading = ref<boolean>(false)

//#region 提交表单
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  brandId: "",
  seriesName: "",
  seriesId: ""
})
const formRules: FormRules = reactive({
  seriesName: [{ required: true, trigger: "blur", message: "请输入车系名称" }],
  brandId: [{ required: true, trigger: "blur", message: "请选择车系所属品牌" }]
})
const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (!formData.seriesId) {
        // 新增
        SeriesApi.addSeries(formData).then((res) => {
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
        SeriesApi.editSeries(formData).then((res) => {
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
  formData.seriesName = ""
  formData.brandId = ""
  formData.seriesId = ""
}
//#endregion

//#region 删
const handleDelete = (row: ICarSeries) => {
  if (!row.brandId) {
    ElMessage.error("无法删除该车系！")
    return
  }
  ElMessageBox.confirm(`您确定删除【${row.seriesName}】吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    SeriesApi.delSeries(row.seriesId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: ICarSeries) => {
  formData.seriesName = row.seriesName
  formData.brandId = row.brandId
  formData.seriesId = row.seriesId
  dialogVisible.value = true
}
//#endregion

//#region 查
const seriesList = ref<ICarSeries[]>([])
const brandList = ref<IBrand[]>([])
BrandApi.getBrands().then((res) => (brandList.value = res.data))
const getTableData = async () => {
  loading.value = true
  try {
    const res = await SeriesApi.getSeries()
    seriesList.value = res.data
  } catch (error) {
    console.error(error)
    seriesList.value = []
  } finally {
    loading.value = false
  }
}
const getBrandNameById = (id) => {
  // 后端给的 brand 为 number，这里临时转换下
  if (typeof id === "number") {
    id = id.toString()
  }
  for (const c of brandList.value) {
    if (c.brandId === id) {
      return c.brandName
    }
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增车系</el-button>
        </div>
        <div>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <el-table :data="seriesList" style="width: 100%" row-key="id" border>
        <el-table-column prop="seriesId" label="车系ID" />
        <el-table-column prop="seriesName" label="车系名称" />
        <el-table-column label="所属品牌">
          <template #default="scope">
            {{ getBrandNameById(scope.row.brandId) }}
          </template>
        </el-table-column>
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
    <el-dialog v-model="dialogVisible" :title="!formData.seriesId ? '新增车系' : '修改车系'" @close="resetForm">
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
          <el-form-item label="车系 ID" v-if="formData.seriesId">
            <el-text>{{ formData.seriesId }}</el-text>
          </el-form-item>
          <el-form-item label="车系名称" prop="seriesName" class="required">
            <el-input v-model="formData.seriesName" type="text" clearable placeholder="请输入车系名" />
          </el-form-item>
          <el-form-item label="所属品牌" prop="brandId" class="required">
            <el-select v-model="formData.brandId" class="full-width-input" placeholder="请选择车系所属品牌">
              <el-option v-for="item in brandList" :key="item.brandId" :label="item.brandName" :value="item.brandId"
            /></el-select>
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

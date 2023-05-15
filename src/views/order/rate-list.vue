<script lang="ts" setup>
import { defineComponent, getCurrentInstance, reactive, ref, watch } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { Delete, RefreshRight, Plus } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

import OrderStatusTag from "./components/order-status-tag.vue"
import { IRate } from "@/api/rate/types/rate"
import * as RateApi from "@/api/rate/index"
import { fileListToPictureField, pictureFieldToFileList } from "@/utils/image"

defineOptions({
  name: "ElementPlus"
})

defineComponent({ OrderStatusTag })

const loading = ref<boolean>(false)
const imgBase = reactive(import.meta.env.VITE_IMAGE_BASE_API)
const uploadApi = reactive(import.meta.env.VITE_IMAGE_UPLOAD_API)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const dialogVisible = ref<boolean>(false)

const resetForm = () => {
  // editFormData.value = undefined
}

//#region 删
const selectionRates = ref<IRate[]>([])
const handleDelete = (row: IRate) => {
  ElMessageBox.confirm(`确定删除该评论吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    RateApi.delOne(row.id).then((res) => {
      if (res.data) {
        ElMessage.success("删除成功")
        getTableData()
      } else {
        ElMessage.error("删除失败")
      }
    })
  })
}

const handleSelectionChange = (e) => {
  selectionRates.value = e
}
const batchDelete = () => {
  const ids: string[] = []
  selectionRates.value.forEach((element) => {
    ids.push(element.id)
  })
  RateApi.delMany(ids.join(",")).then((res) => {
    if (res.data) {
      ElMessage.success("删除成功")
      getTableData()
    } else {
      ElMessage.error("删除失败")
    }
  })
}
//#endregion

//#region 改
const editFormData = ref<IRate>()
const editFormRules = reactive({
  reviewContent: [{ required: true, trigger: "blur", message: "请输入评论内容" }]
})
const handleUpdate = (row: IRate) => {
  editFormData.value = row
  pictureFileList.value = pictureFieldToFileList(row.images)
  dialogVisible.value = true
}
const instance: any = getCurrentInstance()
const handleConfirm = () => {
  instance.proxy.$refs["editFormRef"].validate((valid) => {
    if (!valid) return
    const data: any = editFormData.value
    data.srcList = undefined
    data.images = fileListToPictureField(pictureFileList.value)
    RateApi.edit(data).then((res) => {
      if (res.data) {
        dialogVisible.value = false
        getTableData()
        ElMessage.success("修改成功")
      } else {
        ElMessage.error("修改失败")
      }
    })
  })
}
// #region 图片上传
const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
const pictureFileList = ref([])

const beforeImageUpload = (rawFile) => {
  const { type, size } = rawFile
  if (!allowedTypes.includes(type)) {
    ElMessage.error("图片格式不支持！")
    return false
  }

  if (size > 2 * 1024 * 1024) {
    ElMessage.error("图片必须小于2MB")
    return false
  }

  return true
}
// #endregion
//#endregion

//#region 查
const tableData = ref<IRate[]>([])
const getTableData = () => {
  loading.value = true
  RateApi.getList(paginationData.currentPage, paginationData.pageSize).then((res) => {
    tableData.value = res.data.records
    paginationData.total = res.data.total
    // 处理图片
    tableData.value.forEach((v: any) => {
      v.srcList = v.images.split(",")
      for (let i = 0; i < v.srcList.length; i++) {
        v.srcList[i] = imgBase + v.srcList[i]
      }
    })
  })
  loading.value = false
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
    <!-- <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="searchData.status" class="full-width-input" placeholder="无" @change="handleSearch">
            <el-option
              v-for="item in statusListForSearch"
              :key="item.status"
              :label="item.means"
              :value="item.status!"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card> -->
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="danger" :icon="Delete" @click="batchDelete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="评论 ID" prop="id" align="center" />

          <el-table-column prop="orderId" label="订单 ID" align="center" />
          <el-table-column prop="productId" label="productId" align="center" />
          <el-table-column label="商品评分" align="center" min-width="120px">
            <template #default="scope">
              <el-rate
                v-model="scope.row.productStar"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}分"
              />
            </template>
          </el-table-column>
          <el-table-column label="服务评分" align="center" min-width="120px">
            <template #default="scope">
              <el-rate
                v-model="scope.row.serviceStar"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}分"
              />
            </template>
          </el-table-column>
          <el-table-column prop="reviewContent" label="评论内容" align="center" />
          <el-table-column label="评论图片" align="center" min-width="160px">
            <template #default="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.srcList[0]"
                :zoom-rate="1.2"
                :preview-src-list="scope.row.srcList"
                :initial-index="4"
                fit="cover"
                :preview-teleported="true"
              />
              <div>共{{ scope.row.srcList.length }}张(点击图片查看)</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="250" align="center">
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
    <el-dialog v-model="dialogVisible" title="修改评论" @close="resetForm" width="500px">
      <!-- 修改 -->
      <el-form ref="editFormRef" :model="editFormData" :rules="editFormRules" label-width="100px" label-position="left">
        <el-form-item label="评论 ID">
          {{ editFormData.id }}
        </el-form-item>
        <el-form-item label="商品 ID">
          {{ editFormData.productId }}
        </el-form-item>
        <el-form-item label="订单 ID">
          {{ editFormData.orderId }}
        </el-form-item>
        <el-form-item label="商品评分">
          <el-rate v-model="editFormData.productStar" />
        </el-form-item>
        <el-form-item label="服务评分">
          <el-rate v-model="editFormData.serviceStar" />
        </el-form-item>
        <el-form-item label="评论内容" prop="reviewContent">
          <el-input type="textarea" v-model="editFormData.reviewContent" />
        </el-form-item>
        <el-form-item label="评论图片">
          <el-upload
            :action="uploadApi"
            v-model:file-list="pictureFileList"
            :before-upload="beforeImageUpload"
            list-type="picture-card"
            show-file-list
            :limit="5"
          >
            <template #default
              ><el-icon><Plus /></el-icon></template
          ></el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认修改</el-button>
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

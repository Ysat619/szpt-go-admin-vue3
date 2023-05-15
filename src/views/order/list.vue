<script lang="ts" setup>
import { defineComponent, reactive, ref, watch } from "vue"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, Delete, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

import * as OrderApi from "@/api/order/index"
import { IOrderStatusArray, OrderStatusArray, OrderStatusArrayForSearch } from "@/api/order/types/order"
import { IOrder } from "@/api/order/types/order"
import OrderStatusTag from "./components/order-status-tag.vue"

defineOptions({
  name: "ElementPlus"
})

defineComponent({ OrderStatusTag })

const loading = ref<boolean>(false)
const imgBase = reactive(import.meta.env.VITE_IMAGE_BASE_API)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const dialogVisible = ref<boolean>(false)

const resetForm = () => {
  // editFormData.value = undefined
}

//#region 删
const selectionOrders = ref<IOrder[]>([])
const handleDelete = (row: IOrder) => {
  ElMessageBox.confirm(`确定删除该订单吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    OrderApi.delOrder(row.id).then((res) => {
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
  selectionOrders.value = e
}
const batchDelete = () => {
  const ids: string[] = []
  selectionOrders.value.forEach((element) => {
    ids.push(element.id)
  })
  OrderApi.delOrders(ids.join(",")).then((res) => {
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
const editFormData = ref<IOrder>()
const statusListForEdit = ref<IOrderStatusArray[]>(OrderStatusArray)
const editFormRules = reactive({
  price: [{ required: true, trigger: "blur", message: "请输入价格" }],
  status: [{ required: true, trigger: "blur", message: "请选择状态" }]
})
const handleUpdate = (row: IOrder) => {
  editFormData.value = row
  dialogVisible.value = true
}
const handleConfirm = () => {
  const data: any = {
    id: editFormData.value.id,
    price: editFormData.value.price,
    status: editFormData.value.status
  }
  OrderApi.editOrder(editFormData.value.id, data).then((res) => {
    if (res.data) {
      dialogVisible.value = false
      getTableData()
      ElMessage.success("修改成功")
    } else {
      ElMessage.error("修改失败")
    }
  })
}
//#endregion

//#region 查
const tableData = ref<IOrder[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const statusListForSearch = ref<IOrderStatusArray[]>(OrderStatusArrayForSearch)
const searchData = reactive({
  status: "-1"
})
const getTableData = () => {
  loading.value = true
  OrderApi.getList(paginationData.currentPage, paginationData.pageSize, searchData.status).then((res) => {
    tableData.value = res.data
    paginationData.total = res.data.length
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
    </el-card>
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
          <el-table-column label="订单 ID" prop="id" align="center" />
          <el-table-column label="订单状态" align="center">
            <template #default="scope">
              <order-status-tag :status="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="买家头像" align="center">
            <template #default="scope">
              <el-image type="success" :src="imgBase + scope.row.user.avatar" effect="plain" />
            </template>
          </el-table-column>
          <el-table-column prop="address.phone" label="买家手机号" align="center" />
          <el-table-column prop="address.address" label="买家地址" align="center" />
          <el-table-column prop="price" label="订单价格(￥)" align="center" />
          <el-table-column prop="createDate" label="下单时间" align="center" />
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
    <el-dialog v-model="dialogVisible" title="修改订单" @close="resetForm" width="300px">
      <!-- 修改 -->
      <el-form ref="editFormRef" :model="editFormData" :rules="editFormRules" label-width="100px" label-position="left">
        <el-form-item label="订单 ID">
          {{ editFormData.id }}
        </el-form-item>
        <el-form-item label="下单时间">
          {{ editFormData.createDate }}
        </el-form-item>
        <el-form-item label="订单价格" prop="price">
          <el-input v-model="editFormData.price" type="number" min="0">
            <template #prefix> ￥</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="status" label="订单状态">
          <el-select v-model="editFormData.status" class="full-width-input" placeholder="请选择" @change="handleSearch">
            <el-option v-for="item in statusListForEdit" :key="item.status" :label="item.means" :value="item.status!" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
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

<script lang="ts" setup>
import { getCurrentInstance, reactive, ref, watch } from "vue"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, RefreshRight, EditPen, Goods } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import GoodsAddForm from "./add.vue"
import SkuDialog from "./sku.vue"
import { deleteGoods, getAllGoods, searchGoodsByName } from "@/api/goods"
import { IGoods } from "@/api/goods/types/goods"
import { pictureFieldToFileList } from "@/utils/image"
import { cateIdToCascaderData } from "@/utils/category"

defineOptions({
  name: "goods-list",
  components: {
    GoodsAddForm,
    SkuDialog
  },
  methods: {}
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const imgBase = reactive(import.meta.env.VITE_IMAGE_BASE_API)
const instance: any = getCurrentInstance()
const currentGoods = ref<IGoods>()

//#region 改

const handleUpdate = (row: IGoods) => {
  // eslint-disable-next-line
  instance.proxy.$refs.goodsAddForm.formData = row
  instance.proxy.$refs.goodsAddForm.dialogVisible = true
  instance.proxy.$refs.goodsAddForm.isEdit = true
  // 图片处理
  instance.proxy.$refs.goodsAddForm.pictureFileList = pictureFieldToFileList(row.picture)
  const cates = instance.proxy.$refs.goodsAddForm.cateOptions
  instance.proxy.$refs.goodsAddForm.formData.cate = cateIdToCascaderData(cates, row.cateId)
}
const handleSku = (row: IGoods) => {
  console.log(instance.proxy.$refs.sku)
  instance.proxy.$refs.sku.openDialog(row)
}
//#endregion

//#region 分页
const pageData = (list: Array<IGoods>, currentPage = 1, pageSize = 10) => {
  if (currentPage < 1) currentPage = 1
  if (pageSize < 1) pageSize = 1
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize
  return list.slice(start, end)
}
//#endregion

//#region 删
const handleDelete = (row: IGoods) => {
  ElMessageBox.confirm(`您确定删除【${row.goodName}】吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteGoods(row.id)?.then(() => {
      ElMessage.success("删除成功！")
    })
  })
}
//#endregion

//#region 查
const currentTableData = ref<IGoods[]>([])
const tableData = ref<IGoods[]>([])
const tableDataBySearch = ref<IGoods[]>([])

const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  goodName: ""
})
const loadData = () => {
  loading.value = true
  getAllGoods().then((res) => {
    tableData.value = res.data
    paginationData.total = tableData.value.length
    currentTableData.value = tableData.value
    loading.value = false
  })
}
loadData()
const getTableData = () => {
  loading.value = true
  if (searchData.goodName) {
    searchGoodsByName(searchData.goodName).then((res) => {
      tableDataBySearch.value = res.data
      currentTableData.value = pageData(tableDataBySearch.value, paginationData.currentPage, paginationData.pageSize)
    })
  } else {
    currentTableData.value = pageData(tableData.value, paginationData.currentPage, paginationData.pageSize)
  }
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
  loadData()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="goodName" label="商品名称">
          <el-input v-model="searchData.goodName" placeholder="请输入" />
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
          <el-button type="primary" :icon="CirclePlus" @click="instance.proxy.$refs.goodsAddForm.dialogVisible = true"
            >新增商品</el-button
          >
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="刷新数据">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="currentTableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="商品ID" width="180" align="center" />
          <el-table-column prop="goodName" label="商品" min-width="100" align="center">
            <template #default="scope">
              <el-row v-if="scope.row.picture" justify="center">
                <el-image
                  style="width: 80px; height: 80px; border-radius: 5px; margin-bottom: 5px"
                  :src="imgBase + scope.row.picture.split(',')[0]"
                />
              </el-row>
              <el-text>{{ scope.row.goodName }}</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="goodInfo" label="商品简介" align="center" />
          <el-table-column prop="status" min-width="160px" align="left" label="价格">
            <template #default="scope">
              <el-row> <el-tag type="info">原价</el-tag>￥{{ scope.row.otPrice }}/{{ scope.row.unitName }} </el-row>
              <el-row style="margin-top: 5px"
                ><el-tag type="success">现价</el-tag>￥{{ scope.row.price }}/{{ scope.row.unitName }}</el-row
              >
              <el-row style="margin-top: 5px"
                ><el-tag type="danger">会员价</el-tag>￥{{ scope.row.vipPrice }}/{{ scope.row.unitName }}</el-row
              >
            </template>
          </el-table-column>
          <el-table-column prop="sales" label="销售额" align="center" />
          <el-table-column prop="stock" label="库存" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.isShow" type="success">已上架</el-tag>
              <el-tag v-else type="danger" effect="light">已下架</el-tag>
              <el-tag v-if="scope.row.isNew" type="info" style="margin-left: 5px">新品</el-tag>
              <el-tag v-if="scope.row.isHot" type="danger" style="margin-left: 5px">热销</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="260" align="center">
            <template #default="scope">
              <el-button type="success" text bg size="small" :icon="Goods" @click="handleSku(scope.row)"
                >管理SKU</el-button
              >

              <el-button type="primary" text bg size="small" :icon="EditPen" @click="handleUpdate(scope.row)"
                >修改</el-button
              >
              <el-button type="danger" text bg size="small" :icon="Delete" @click="handleDelete(scope.row)"
                >删除</el-button
              >
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
    <!-- 新增/修改 -->
    <goods-add-form @afterSuccess="handleRefresh" ref="goodsAddForm" />
    <sku-dialog :goods="currentGoods" ref="sku" />
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

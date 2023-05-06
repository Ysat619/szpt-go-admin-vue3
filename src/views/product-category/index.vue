<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi } from "@/api/table"
import {
  getCategoryType,
  addCategoryType,
  addCategory,
  editCategoryType,
  editCategory,
  deleteCategory,
  deleteCategoryType
} from "@/api/category"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, UploadProps } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { ICategory, ICategoryType } from "@/api/category/types/category"

defineOptions({
  name: "ElementPlus"
})

const loading = ref<boolean>(false)

const imgBase = reactive(import.meta.env.VITE_IMAGE_BASE_API)
const updateApi = reactive(import.meta.env.VITE_IMAGE_UPLOAD_API)

// 判断当前是否是在父分类
function isParentCat() {
  return currentCatId.value === formData.parentCatId || !formData.parentCatId
}

//#region 提交表单
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  catName: "",
  parentCatId: "",
  imageUrl: ""
})
const formRules: FormRules = reactive({
  catName: [{ required: true, trigger: "blur", message: "请输入分类名" }],
  parentCat: [{ required: false, trigger: "blur", message: "请选择" }]
})
const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentCatId.value === undefined) {
        // 新增
        if (!isParentCat()) {
          // 新增子分类
          addCategory({
            categoryTypeId: formData.parentCatId,
            name: formData.catName,
            picture: formData.imageUrl
          }).then(() => {
            ElMessage.success("新增成功")
            dialogVisible.value = false
            getTableData()
          })
        } else {
          // 新增父分类
          addCategoryType(formData.catName).then(() => {
            ElMessage.success("新增成功")
            dialogVisible.value = false
            getTableData()
          })
        }
      } else {
        // 修改
        if (isParentCat()) {
          // 修改父分类
          editCategoryType(currentCatId.value, formData.catName).then(() => {
            ElMessage.success("修改成功")
            dialogVisible.value = false
            getTableData()
          })
        } else {
          // 修改子分类
          editCategory({
            id: currentCatId.value,
            categoryTypeId: formData.parentCatId,
            name: formData.catName,
            picture: formData.imageUrl
          }).then(() => {
            ElMessage.success("修改成功")
            dialogVisible.value = false
            getTableData()
          })
        }
      }
    } else {
      return false
    }
  })
}
const resetForm = () => {
  currentCatId.value = undefined
  formData.catName = ""
  formData.parentCatId = ""
  formData.imageUrl = ""
}
//#endregion

// #region 图片上传
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]

const handleAvatarSuccess: UploadProps["onSuccess"] = (response) => {
  formData.imageUrl = response.data
}

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
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

//#region 删
const handleDelete = (row: ICategory | ICategoryType) => {
  if (!row.id) {
    ElMessage.error("无法删除该分类！")
    return
  }
  if ("categoryTypeId" in row) {
    // 删除子分类
    ElMessageBox.confirm(`您确定删除【${row.name}】分类吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      deleteCategory(row.id!).then(() => {
        ElMessage.success("删除成功")
        getTableData()
      })
    })
  } else {
    // 删除父分类
    ElMessageBox.confirm(`您确定删除【${row.name}】父分类吗？删除后该分类下的所有子分类也会删除！`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      deleteCategoryType(row.id!).then(() => {
        ElMessage.success("删除成功")
        getTableData()
      })
    })
  }
}
//#endregion

//#region 改
const currentCatId = ref<undefined | string>(undefined)
const handleUpdate = (row: any) => {
  console.log(row)

  currentCatId.value = row.id
  formData.catName = row.name
  if (row.categoryTypeId) {
    // 是子分类则需要把categoryTypeId转为 string 后放入id
    formData.parentCatId = row.categoryTypeId
    // 放图片
    formData.imageUrl = row.picture
  } else {
    // 是父分类，直接放 id
    formData.parentCatId = row.id
  }
  dialogVisible.value = true
}
//#endregion

//#region 查
const parentCategoryList = ref<ICategoryType[]>([])
const categorieList = ref<ICategoryType[]>([])

const getTableData = async () => {
  loading.value = true
  try {
    const res = await getCategoryType()
    const list: ICategoryType[] = res.data
    // 数据清洗
    list.forEach((e) => {
      e.categories?.forEach((ee, ii) => {
        if (!ee.id) {
          e.categories?.splice(ii, 1)
        }
        ee.categoryTypeId = e.id!
      })
    })
    categorieList.value = list
    parentCategoryList.value = list.map((c) => ({ id: c.id, name: c.name }))
  } catch (error) {
    console.error(error)
    categorieList.value = []
    parentCategoryList.value = []
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增分类</el-button>
        </div>
        <div>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <el-table
        :data="categorieList"
        style="width: 100%"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'categories' }"
      >
        <el-table-column prop="id" label="id" width="200" />
        <el-table-column prop="name" label="分类">
          <template #default="scope1">
            <el-image v-if="scope1.row.picture" style="width: 50px; height: 50px" :src="imgBase + scope1.row.picture" />
            <el-text>
              {{ scope1.row.name }}
            </el-text>
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
    <el-dialog v-model="dialogVisible" :title="currentCatId === undefined ? '新增分类' : '修改分类'" @close="resetForm">
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
          <el-form-item label="分类名" prop="catName" class="required">
            <el-input v-model="formData.catName" type="text" clearable placeholder="请输入分类名" />
          </el-form-item>
          <el-form-item
            label="父分类(不选则为新增父分类)"
            label-width="200"
            prop="parentCat"
            v-if="currentCatId === undefined || !isParentCat()"
          >
            <el-select v-model="formData.parentCatId" class="full-width-input" clearable placeholder="无">
              <el-option v-for="item in parentCategoryList" :key="item.id" :label="item.name" :value="item.id!" />
            </el-select>
          </el-form-item>

          <el-form-item v-if="!isParentCat()" label="图片" prop="imgUpload">
            <el-upload
              class="upload-demo"
              drag
              :action="updateApi"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <div>
                <el-image
                  v-if="formData.imageUrl"
                  :src="imgBase + formData.imageUrl"
                  style="width: 100px; height: 100px"
                />
              </div>

              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">拖拽文件上传或<em>点击上传</em></div>
              <template #tip>
                <div class="el-upload__tip">仅支持JPG/PNG/JPEG格式的图片(且小于2MB)</div>
              </template>
            </el-upload>
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

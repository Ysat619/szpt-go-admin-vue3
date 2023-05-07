<template>
  <el-dialog
    v-model="dialogVisible"
    :before-close="resetFormConfirm"
    :title="isEdit ? '修改商品' : '新增商品'"
    width="1024px"
  >
    <el-form
      :model="formData"
      ref="vForm"
      :rules="rules"
      label-position="left"
      label-width="80px"
      size="default"
      @submit.prevent
    >
      <el-form-item v-if="formData.id" label="商品ID">
        <el-text>{{ formData.id }}</el-text>
      </el-form-item>
      <el-form-item label="商品名称" prop="goodName" class="required">
        <el-input v-model="formData.goodName" type="text" placeholder="请输入商品名称" clearable />
      </el-form-item>
      <el-row>
        <el-col :span="12" class="grid-cell">
          <el-form-item label="商品分类" prop="cate" class="required">
            <el-cascader
              v-model="formData.cate"
              class="full-width-input"
              :options="cateOptions"
              clearable
              filterable
              :props="{ children: 'categories', label: 'name', value: 'id' }"
              placeholder="请选择商品分类"
            />
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="11" class="grid-cell">
          <el-form-item label="商品关键词" label-width="100px" prop="keyword" class="required">
            <el-input v-model="formData.keyword" type="text" placeholder="请输入商品关键词(keyword)" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="商品简介" prop="goodInfo" class="required">
        <el-input v-model="formData.goodInfo" type="text" placeholder="请输入商品简介" clearable />
      </el-form-item>
      <el-row>
        <el-col :span="8" class="grid-cell">
          <el-form-item label="原价" prop="otPrice" class="required">
            <el-input v-model="formData.otPrice" type="number" placeholder="请输入商品原价" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1" class="grid-cell">
          <el-form-item label="现价" prop="price" class="required">
            <el-input v-model="formData.price" type="number" placeholder="请输入商品现价" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1" class="grid-cell">
          <el-form-item label="会员价" prop="vipPrice" class="required">
            <el-input v-model="formData.vipPrice" type="number" placeholder="请输入会员价" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="grid-cell">
          <el-form-item label="库存数" prop="stock" class="required">
            <el-input-number
              v-model="formData.stock"
              class="full-width-input"
              controls-position="right"
              :min="0"
              :max="100000000000"
              :precision="0"
              :step="10"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" class="grid-cell" :offset="1">
          <el-form-item label="库存单位" prop="unitName" class="required">
            <el-input v-model="formData.unitName" type="text" placeholder="请输入库存单位(如：台)" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="3" class="grid-cell" :offset="1">
          <el-form-item label="是否热门" prop="isHot">
            <el-switch v-model="formData.isHot" />
          </el-form-item>
        </el-col>
        <el-col :span="3" class="grid-cell" :offset="1">
          <el-form-item label="是否上架" prop="isShow">
            <el-switch v-model="formData.isShow" />
          </el-form-item>
        </el-col>
        <el-col :span="3" class="grid-cell" :offset="1">
          <el-form-item label="是否新品" prop="isNew">
            <el-switch v-model="formData.isNew" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="商品图片" prop="picture" class="required">
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
      <QuillEditor
        contentType="html"
        theme="snow"
        v-model:content="formData.description"
        placeholder="请输入商品详情"
      />
    </el-form>
    <template #footer>
      <el-button @click="resetFormConfirm">取消</el-button>
      <el-button type="primary" @click="submitForm">确认{{ isEdit ? "修改" : "新增" }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, toRefs, reactive, getCurrentInstance } from "vue"
import { QuillEditor } from "@vueup/vue-quill"
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import { Plus } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { getCategoryType } from "@/api/category/index"
import { addGoods, editGoods } from "@/api/goods"
import { fileListToPictureField } from "@/utils/image"

export default defineComponent({
  components: { QuillEditor },
  props: [],
  setup() {
    const state = reactive({
      uploadApi: import.meta.env.VITE_IMAGE_UPLOAD_API,
      dialogVisible: false,
      isEdit: false,
      formData: {
        goodName: "",
        cate: [],
        keyword: "",
        goodInfo: "",
        otPrice: "",
        price: "",
        vipPrice: "",
        stock: 0,
        unitName: "",
        isHot: true,
        isShow: true,
        isNew: true,
        picture: "",
        description: ""
      },
      rules: {
        goodName: [
          {
            required: true,
            message: "请输入商品名称"
          }
        ],
        cate: [
          {
            required: true,
            message: "请选择商品分类"
          }
        ],
        keyword: [
          {
            required: true,
            message: "请输入商品关键词"
          }
        ],
        goodInfo: [
          {
            required: true,
            message: "请输入商品信息"
          }
        ],
        otPrice: [
          {
            required: true,
            message: "字段值不可为空"
          },
          {
            pattern: /^[-]?\d+(\.\d+)?$/,
            trigger: ["blur", "change"],
            message: "请输入商品原价"
          }
        ],
        price: [
          {
            required: true,
            message: "请输入商品原价"
          },
          {
            pattern: /^[-]?\d+(\.\d+)?$/,
            trigger: ["blur", "change"],
            message: "请输入商品现价"
          }
        ],
        vipPrice: [
          {
            required: true,
            message: "字段值不可为空"
          },
          {
            pattern: /^[-]?\d+(\.\d+)?$/,
            trigger: ["blur", "change"],
            message: "请输入会员价"
          }
        ],
        stock: [
          {
            required: true,
            message: "字段值不可为空"
          },
          {
            pattern: /^[-]?\d+(\.\d+)?$/,
            trigger: ["blur", "change"],
            message: ""
          }
        ],
        unitName: [
          {
            required: true,
            message: "字段值不可为空"
          },
          {
            pattern: /^[一-龥]+$/,
            trigger: ["blur", "change"],
            message: "请输入库存单位(如：台)"
          }
        ],
        picture: [
          {
            required: false,
            message: "请上传商品图片"
          }
        ],
        description: [
          {
            required: true,
            message: "请输入商品详情"
          }
        ]
      },
      cateOptions: [],
      pictureFileList: [],
      pictureUploadHeaders: {},
      pictureUploadData: {}
    })
    const instance = getCurrentInstance()
    const submitForm = () => {
      instance.proxy.$refs["vForm"].validate((valid) => {
        if (!valid) return
        state.formData.picture = fileListToPictureField(state.pictureFileList)
        const goodsData = { ...state.formData }
        goodsData.cateId = goodsData.cate[1]
        goodsData.cate = undefined
        if (!state.isEdit) {
          addGoods(goodsData).then(() => {
            ElMessage.success("新增成功")
            resetForm()
            instance.proxy.$emit("afterSuccess")
          })
        } else {
          addGoods(goodsData).then(() => {
            ElMessage.success("修改成功")
            resetForm()
            instance.proxy.$emit("afterSuccess")
          })
        }
      })
    }
    const resetForm = () => {
      instance.proxy.$refs["vForm"].resetFields()
      state.isEdit = false
      state.dialogVisible = false
    }
    const resetFormConfirm = async () => {
      const res = await ElMessageBox.confirm(`确认取消吗？取消后您所填写的内容将会消失`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      if (res === "confirm") {
        resetForm()
      }
    }

    async function loadData() {
      const res = await getCategoryType()
      state.cateOptions = res.data
    }
    loadData()

    // #region 图片上传
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]

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

    return {
      ...toRefs(state),
      submitForm,
      resetFormConfirm,
      resetForm,
      beforeImageUpload,
      Plus
    }
  }
})
</script>

<style lang="scss">
.el-input-number.full-width-input,
.el-cascader.full-width-input {
  width: 100% !important;
}

.el-form-item--medium {
  .el-radio {
    line-height: 36px !important;
  }

  .el-rate {
    margin-top: 8px;
  }
}

.el-form-item--small {
  .el-radio {
    line-height: 32px !important;
  }

  .el-rate {
    margin-top: 6px;
  }
}

.el-form-item--mini {
  .el-radio {
    line-height: 28px !important;
  }

  .el-rate {
    margin-top: 4px;
  }
}

.clear-fix:before,
.clear-fix:after {
  display: table;
  content: "";
}

.clear-fix:after {
  clear: both;
}

.float-right {
  float: right;
}
</style>

<style lang="scss" scoped>
div.table-container {
  table.table-layout {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;

    td.table-cell {
      display: table-cell;
      height: 36px;
      border: 1px solid #e1e2e3;
    }
  }
}

div.tab-container {
}

.label-left-align :deep(.el-form-item__label) {
  text-align: left;
}

.label-center-align :deep(.el-form-item__label) {
  text-align: center;
}

.label-right-align :deep(.el-form-item__label) {
  text-align: right;
}

.custom-label {
}

.static-content-item {
  min-height: 20px;
  display: flex;
  align-items: center;

  :deep(.el-divider--horizontal) {
    margin: 0;
  }
}
</style>

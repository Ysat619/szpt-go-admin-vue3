<template>
  <el-dialog v-model="dialogVisible" :title="`SKU 管理(${currentGoods?.goodName})`" width="700">
    <el-empty v-if="!skuTypes.length" />
    <el-scrollbar height="600px" :always="true" v-else>
      <div class="main">
        <!-- 追加sku-type -->
        <el-card
          class="box-card"
          v-for="(v, i) in skuTypes"
          :key="v.id"
          style="margin-top: 20px; width: 100%"
          shadow="hover"
        >
          <el-row align="middle">
            <el-col :span="2">
              <el-popconfirm title="确认删除吗？" @confirm="delSkuType(i)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" bg text />
                </template>
              </el-popconfirm>
            </el-col>
            <el-col :span="21" :offset="1">
              <el-input
                placeholder="请输入商品规格类型（如：颜色、尺寸）"
                class="no-border"
                v-model="v.name"
                :ref="`input${i}`"
                maxlength="12"
              >
                <template #prefix>商品规格类型： </template>
                <template #suffix>
                  <el-button type="primary" size="small" :icon="Check" @click="handleSkuType(v)">确认</el-button>
                </template>
              </el-input>
            </el-col>
          </el-row>

          <el-divider />

          <!-- #region sku -->
          <el-row align="middle" v-for="(vv, ii) in v.skus" :key="vv.id" style="margin-bottom: 5px">
            <el-col :span="1">
              <el-popconfirm title="确认删除吗？" @confirm="delSku(i, ii, vv.id)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" circle bg text />
                </template>
              </el-popconfirm>
            </el-col>
            <el-col :span="7" :offset="1"><el-input :placeholder="'请输入' + v.name" v-model="vv.name" /></el-col>
            <el-col :span="7" :offset="1"
              ><el-input :placeholder="'请输入价格'" v-model="vv.price" type="number">
                <template #prefix>单价：￥</template>
              </el-input></el-col
            >
            <el-col :span="2" :offset="1">
              <el-upload
                class="avatar-uploader"
                :action="uploadApi"
                :show-file-list="false"
                :on-success="(response) => handleImageSuccess(response, i, ii)"
                :before-upload="beforeImageUpload"
              >
                <el-image v-if="vv.picture" :src="imgBase + vv.picture" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Upload /></el-icon>
              </el-upload>
            </el-col>
            <el-col :span="2" :offset="1">
              <el-button type="primary" size="small" :icon="Check" @click="handleSku(v, vv)">确认</el-button>
            </el-col>
          </el-row>
          <!-- #endregion -->

          <el-row justify="center">
            <el-button type="primary" :icon="CirclePlus" size="large" @click="addSku(v, i)" :circle="true" />
          </el-row>
        </el-card>
      </div>
    </el-scrollbar>

    <el-row class="sku-typeadd" justify="center" style="margin-top: 20px">
      <el-button type="primary" :icon="CirclePlus" @click="insertSkuType">新增商品规格类型</el-button>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
// import { addSkuType, editSkuType, getGoods } from "@/api/goods"
import * as GoodsApi from "@/api/goods"
import type { IGoods, ISku, ISkuType } from "@/api/goods/types/goods"
import { Check, CirclePlus, Delete, Plus, Upload } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import { reactive, ref, defineComponent, toRefs } from "vue"

export default defineComponent({
  components: { Upload },
  props: [],
  setup() {
    const state = reactive({
      dialogVisible: false,
      loading: false,
      imgBase: import.meta.env.VITE_IMAGE_BASE_API,
      uploadApi: import.meta.env.VITE_IMAGE_UPLOAD_API,
      formData: [],
      inputValue: "test",
      isEditing: false
    })

    const skuList = ref<ISku[]>([])
    const skuTypes = ref<ISkuType[]>([])
    const currentGoods = ref<IGoods>()
    const resetFormConfirm = () => {
      state.dialogVisible = false
    }

    const insertSkuType = () => {
      skuTypes.value.push({ id: "", name: "" })
    }

    const addSku = (v: ISkuType, i: number) => {
      if (!v.id) {
        ElMessage.error("请先确认商品规格类型")
        return
      }
      const newSku = {
        id: "",
        name: "",
        picture: "",
        price: 0.0,
        productId: currentGoods.value?.id || "",
        skuTypeId: v.id
      }
      if (!skuTypes.value[i].skus) skuTypes.value[i].skus = [newSku]
      else skuTypes.value[i].skus?.push(newSku)
    }

    const delSku = (skuTypeIdx: number, skuIdx: number, id: string) => {
      if (id) {
        GoodsApi.delSku(id).then((res) => {
          if (res.data) {
            ElMessage.success("删除 Sku 成功")
            skuTypes.value[skuTypeIdx].skus?.splice(skuIdx, 1)
          } else {
            ElMessage.error("删除 Sku 失败")
          }
        })
      } else {
        skuTypes.value[skuTypeIdx].skus?.splice(skuIdx, 1)
      }
    }

    const delSkuType = (i: number) => {
      if (skuTypes.value[i].id) {
        GoodsApi.delSkuType(skuTypes.value[i].id).then((res) => {
          if (res.data) {
            ElMessage.success("删除 Sku Type 成功")
          } else {
            ElMessage.error("删除 Sku Type 失败")
            return
          }
        })
      }
      skuTypes.value.splice(i, 1)
    }
    const loadData = () => {
      GoodsApi.getGoods(currentGoods.value?.id).then((res) => {
        skuTypes.value = res.data.skuTypes
      })
    }

    const openDialog = (goods: IGoods) => {
      state.dialogVisible = true
      currentGoods.value = goods
      loadData()
    }

    const handleSkuType = (v: ISkuType) => {
      if (!v.name) {
        ElMessage.error("不能为空")
        return
      }
      if (v.id) {
        // 有 id，进行修改
        GoodsApi.editSkuType(v.name, v.id).then((res) => {
          if (res.data) {
            ElMessage.success("skuType修改成功")
          } else {
            ElMessage.error("skuType修改失败")
          }
        })
      } else {
        // 新增
        GoodsApi.addSkuType(v.name).then((res) => {
          if (res.data) {
            v.id = res.data
            ElMessage.success("skuType新增成功")
          } else {
            ElMessage.error("skuType新增失败")
          }
        })
      }
    }

    const handleImageSuccess = (response, i: number, ii: number) => {
      if (response.data && response.code === "200") {
        skuTypes.value[i].skus[ii].picture = response.data
      }
    }

    const handleSku = (v: ISkuType, vv: ISku) => {
      if (!vv.name || !vv.price) {
        ElMessage.error("不能为空")
        return
      }
      if (vv.id) {
        // 修改
        GoodsApi.editSku(vv).then((res) => {
          if (res.data) {
            ElMessage.success("sku修改成功")
          } else {
            ElMessage.error("sku修改失败")
          }
        })
      } else {
        // 增加
        vv.productId = currentGoods.value.id
        vv.skuTypeId = v.id
        GoodsApi.addSku(vv).then((res) => {
          if (res.data) {
            vv.id = res.data
            ElMessage.success("sku新增成功")
          } else {
            ElMessage.error("sku新增失败")
          }
        })
      }
    }

    return {
      ...toRefs(state),
      resetFormConfirm,
      CirclePlus,
      insertSkuType,
      skuList,
      skuTypes,
      Plus,
      Delete,
      delSku,
      addSku,
      currentGoods,
      delSkuType,
      Check,
      loadData,
      openDialog,
      handleSkuType,
      handleSku,
      handleImageSuccess
    }
  }
})
</script>

<style lang="scss" scoped>
.avatar-uploader {
  .el-icon {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  .el-icon:hover {
    border-color: var(--el-color-primary);
  }
}

.avatar {
  border: 1px dashed var(--el-border-color);
  width: 60px;
  height: 60px;
  border-radius: 10px;
}

.avatar:hover {
  border: 2px solid var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  text-align: center;
}
.no-border {
  .el-input__inner {
    border: none;
  }

  .el-input {
    --el-input-focus-border-color: none;
  }
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>

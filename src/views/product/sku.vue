<template>
  <el-dialog v-model="dialogVisible" :title="`SKU 管理(${currentGoods?.goodName})`" width="500">
    <div class="main">
      <!-- 追加sku-type -->
      <el-empty v-if="!skuTypes.length" />
      <el-card
        class="box-card"
        v-for="(v, i) in skuTypes"
        :key="v.id"
        style="margin-top: 20px; width: 100%"
        shadow="hover"
      >
        <el-row align="middle">
          <el-col :span="2">
            <el-button type="danger" :icon="Delete" bg text @click="delSkuType(i)" />
          </el-col>
          <el-col :span="21" :offset="1">
            <el-input
              placeholder="请输入商品规格类型（如：颜色）"
              class="no-border"
              v-model="v.name"
              :ref="`input${i}`"
            >
              <template #prefix> 商品规格类型： </template>
            </el-input>
          </el-col>
        </el-row>

        <el-divider />

        <!-- #region sku -->
        <el-row align="middle" v-for="(vv, ii) in v.skus" :key="vv.id" style="margin-bottom: 5px">
          <el-col :span="2">
            <el-button type="danger" :icon="Delete" circle bg text @click="delSku(i, ii)" />
          </el-col>
          <el-col :span="8" :offset="1"><el-input :placeholder="'请输入' + v.name" v-model="vv.name" /></el-col>
          <el-col :span="8" :offset="1"
            ><el-input :placeholder="'请输入价格'" v-model="vv.price" type="number">
              <template #prefix>单价：￥</template>
            </el-input></el-col
          >
          <el-col :span="3" :offset="1">
            <el-upload
              class="avatar-uploader"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-image v-if="vv.picture" :src="imgBase + vv.picture" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Upload /></el-icon>
            </el-upload>
          </el-col>
        </el-row>
        <!-- #endregion -->

        <el-row justify="center">
          <el-button type="primary" :icon="CirclePlus" size="large" @click="addSku(v, i)" :circle="true" />
        </el-row>
      </el-card>
    </div>
    <el-row class="sku-typeadd" justify="center" style="margin-top: 20px">
      <el-button type="primary" :icon="CirclePlus" @click="addSkuType">新增商品规格类型</el-button>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { getGoods } from "@/api/goods"
import type { IGoods, ISku, ISkuType } from "@/api/goods/types/goods"
import { CirclePlus, Delete, Plus, Upload } from "@element-plus/icons-vue"
import { reactive, ref, defineComponent, toRefs, PropType } from "vue"

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

    const addSkuType = () => {
      skuTypes.value.push({ id: "", name: "" })
    }

    const addSku = (v: ISkuType, i: number) => {
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

    const delSku = (skuTypeIdx: number, skuIdx: number) => {
      skuTypes.value[skuTypeIdx].skus?.splice(skuIdx, 1)
    }

    const delSkuType = (i: number) => {
      skuTypes.value.splice(i, 1)
    }
    const loadData = () => {
      getGoods(currentGoods.value?.id).then((res) => {
        skuTypes.value = res.data.skuTypes
      })
    }

    const openDialog = (goods: IGoods) => {
      state.dialogVisible = true
      currentGoods.value = goods
      loadData()
    }

    return {
      ...toRefs(state),
      resetFormConfirm,
      CirclePlus,
      addSkuType,
      skuList,
      skuTypes,
      Plus,
      Delete,
      delSku,
      addSku,
      currentGoods,
      delSkuType,
      loadData,
      openDialog
    }
  },
  methods: {}
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

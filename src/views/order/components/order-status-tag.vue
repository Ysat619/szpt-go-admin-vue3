<template>
  <div>
    <el-tag :type="tagType(status)">
      {{ OrderStatusArray[parseInt(status)] }}
    </el-tag>
  </div>
</template>

<script>
import { defineComponent } from "vue"

export default defineComponent({
  name: "OrderStatusTag",
  props: {
    status: { type: String, required: true }
  },
  data() {
    return {
      OrderStatusArray: ["未确认", "取消", "未评价", "完成评价", "完成"]
    }
  },
  methods: {
    tagType(status) {
      switch (status) {
        case "0":
          return "warning"
        case "1":
          return "danger"
        case "2":
          return "primary"
        case "3":
          return "success"
        case "4":
          return "success"
        default:
          return "default"
      }
    }
  }
})
</script>

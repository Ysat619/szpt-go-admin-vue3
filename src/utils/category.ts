import { ICategoryType } from "@/api/category/types/category"

export const cateIdToCascaderData = (list: ICategoryType[], targetId: string) => {
  for (const e of list) {
    if (!e.categories) continue
    for (const ee of e.categories) {
      if (ee.id === targetId) {
        return [e.id, ee.id]
      }
    }
  }
}

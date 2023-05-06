import { request } from "@/utils/service"
import type * as Category from "./types/category"
import { Responce } from "../type"

//#region 父分类

// 获取全部分类和子分类
export function getCategoryType() {
  return request<Responce<Category.ICategoryType[]>>({
    url: "TbCategoryType",
    method: "get"
  })
}

export function addCategoryType(name: string) {
  return request<Responce<Boolean>>({
    url: "TbCategoryType",
    method: "post",
    data: { name }
  })
}

export function editCategoryType(id: string, name: string) {
  return request<Responce<Boolean>>({
    url: `TbCategoryType/${id}`,
    method: "put",
    data: { name }
  })
}

export function deleteCategoryType(id: string) {
  return request<Responce<Boolean>>({
    url: `TbCategoryType/${id}`,
    method: "delete"
  })
}
//#endregion

//#region 子分类
export function addCategory(data: Category.ICategory) {
  return request<Responce<Boolean>>({
    url: "TbCategory",
    method: "post",
    data: data
  })
}

export function editCategory(data: Category.ICategory) {
  return request<Responce<Boolean>>({
    url: `TbCategory/${data.id}`,
    method: "put",
    data: data
  })
}

export function deleteCategory(id: string) {
  return request<Responce<Boolean>>({
    url: `TbCategory/${id}`,
    method: "delete"
  })
}
//#endregion

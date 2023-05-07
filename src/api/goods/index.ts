import { request } from "@/utils/service"
import { Responce } from "../type"
import type * as Goods from "./types/goods"
import { ElMessage } from "element-plus"

export function addGoods(goods: Goods.IGoods) {
  goods.isDel = false
  goods.sales = 0
  return request<Responce<boolean>>({
    url: "TbGood",
    method: "post",
    data: goods
  })
}

export function editGoods(goods: Goods.IGoods) {
  return request<Responce<boolean>>({
    url: "TbGood",
    method: "put",
    data: goods
  })
}

export function getAllGoods(current = 1, size = 99999, total = 99999) {
  return request<Responce<Goods.IGoods[]>>({
    url: `TbGood/getList/${current}/${size}/${total}`,
    method: "get"
  })
}

export function searchGoodsByName(name: string, current = 1, size = 99999, total = 99999) {
  return request<Responce<Goods.IGoods[]>>({
    url: `TbGood/getListByName/${current}/${size}/${total}/${name}`,
    method: "get"
  })
}

export function deleteGoods(id: string | undefined) {
  if (!id) {
    ElMessage.error("删除失败！")
    return
  }
  return request<Responce<boolean>>({
    url: `TbGood/${id}`,
    method: "delete"
  })
}

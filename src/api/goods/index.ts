import { request } from "@/utils/service"
import { Responce } from "../type"
import type * as Goods from "./types/goods"

export function addGoods(goods: Goods.IGoods) {
  goods.isDel = false
  goods.sales = 0
  return request<Responce<boolean>>({
    url: "TbGood",
    method: "post",
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

import { request } from "@/utils/service"
import { Responce } from "../type"
import type * as Goods from "./types/goods"

export function addGoods(goods: Goods.IGoodsAdd) {
  goods.isDel = false
  return request<Responce<boolean>>({
    url: "TbGood",
    method: "post",
    data: goods
  })
}

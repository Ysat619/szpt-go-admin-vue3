import { request } from "@/utils/service"
import { Responce } from "../type"
import { CreateOrderParam, IOrder } from "./types/order"

export function getList(current = 1, size = 10, status: string) {
  return request<Responce<IOrder[]>>({
    url: `TbOrder/getListAll/${current}/${size}/${status}`,
    method: "get"
  })
}

export function editOrder(id: string, order: IOrder) {
  return request<Responce<boolean>>({
    url: `TbOrder/${id}`,
    method: "put",
    data: order
  })
}

export function delOrder(id: string) {
  return request<Responce<boolean>>({
    url: `TbOrder/${id}`,
    method: "delete"
  })
}
export function delOrders(ids: string) {
  return request<Responce<boolean>>({
    url: `TbOrder/batch`,
    method: "delete",
    params: {
      ids
    }
  })
}

export function createOrder(param: CreateOrderParam) {
  return request<Responce<boolean>>({
    url: `TbOrder/createOrder`,
    method: "post",
    data: param
  })
}

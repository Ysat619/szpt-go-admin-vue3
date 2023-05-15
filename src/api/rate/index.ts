import { request } from "@/utils/service"
import { PageRecordData, Responce } from "../type"
import { IRate } from "./types/rate"

export function getList(current = 1, size = 10) {
  return request<Responce<PageRecordData<IRate>>>({
    url: `/TbRate/getListAdmin/${current}/${size}`,
    method: "get"
  })
}

export function delOne(id: string) {
  return request<Responce<boolean>>({
    url: `/TbRate/${id}`,
    method: "delete"
  })
}

export function delMany(ids: string) {
  return request<Responce<boolean>>({
    url: `/TbRate/batch`,
    method: "delete",
    params: {
      ids
    }
  })
}

export function edit(rate: IRate) {
  return request<Responce<boolean>>({
    url: `/TbRate/${rate.id}`,
    method: "put",
    data: rate
  })
}

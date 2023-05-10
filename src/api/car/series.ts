import { request } from "@/utils/service"
import { Responce } from "../type"
import { ICarSeries } from "./types"

export function getSeries(current = 1, size = 9999) {
  return request<Responce<ICarSeries[]>>({
    url: `TbCarSeries/getList/${current}/${size}`,
    method: "get"
  })
}

export function addSeries(series: ICarSeries) {
  return request<Responce<boolean>>({
    url: `TbCarSeries`,
    method: "post",
    data: series
  })
}

export function delSeries(id: string) {
  return request<Responce<boolean>>({
    url: `TbCarSeries/${id}`,
    method: "delete"
  })
}

export function editSeries(series: ICarSeries) {
  return request<Responce<boolean>>({
    url: `TbCarSeries/${series.brandId}`,
    method: "put",
    data: series
  })
}

import { request } from "@/utils/service"
import { Responce } from "../type"
import { ICarType } from "./types"

export function getCarTypes(current = 1, size = 9999) {
  return request<Responce<ICarType[]>>({
    url: `TbCarType/getList/${current}/${size}`,
    method: "get"
  })
}

export function addCarType(carType: ICarType) {
  return request<Responce<boolean>>({
    url: `TbCarType`,
    method: "post",
    data: carType
  })
}

export function delCarType(id: string) {
  return request<Responce<boolean>>({
    url: `TbCarType/${id}`,
    method: "delete"
  })
}

export function editCarType(carType: ICarType) {
  return request<Responce<boolean>>({
    url: `TbCarType/${carType.typeId}`,
    method: "put",
    data: carType
  })
}

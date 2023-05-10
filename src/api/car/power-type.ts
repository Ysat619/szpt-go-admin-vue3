import { request } from "@/utils/service"
import { Responce } from "../type"
import { IPowerType } from "./types"

export function getPowerTypes(current = 1, size = 9999) {
  return request<Responce<IPowerType[]>>({
    url: `TbCarPowerType/getList/${current}/${size}`,
    method: "get"
  })
}

export function addPowerType(powerType: IPowerType) {
  return request<Responce<boolean>>({
    url: `TbCarPowerType`,
    method: "post",
    data: powerType
  })
}

export function delPowerType(id: string) {
  return request<Responce<boolean>>({
    url: `TbCarPowerType/${id}`,
    method: "delete"
  })
}

export function editPowerType(powerType: IPowerType) {
  return request<Responce<boolean>>({
    url: `TbCarPowerType`,
    method: "put",
    data: powerType
  })
}

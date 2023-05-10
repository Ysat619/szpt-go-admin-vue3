import { request } from "@/utils/service"
import { Responce } from "../type"
import { ICountry } from "./types"

export function getCountrys(current = 1, size = 9999) {
  return request<Responce<ICountry[]>>({
    url: `TbCarCountry/getList/${current}/${size}`,
    method: "get"
  })
}

export function addCountry(country: ICountry) {
  return request<Responce<boolean>>({
    url: `TbCarCountry`,
    method: "post",
    data: country
  })
}

export function delCountry(id: string) {
  return request<Responce<boolean>>({
    url: `TbCarCountry/${id}`,
    method: "delete"
  })
}

export function editCountry(country: ICountry) {
  return request<Responce<boolean>>({
    url: `TbCarCountry`,
    method: "put",
    data: country
  })
}

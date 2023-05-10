import { request } from "@/utils/service"
import { Responce } from "../type"
import { IBrand } from "./types"

export function getBrands() {
  return request<Responce<IBrand[]>>({
    url: `TbCarBrand/getList/`,
    method: "get"
  })
}

export function addBrand(brand: IBrand) {
  return request<Responce<boolean>>({
    url: `TbCarBrand`,
    method: "post",
    data: brand
  })
}

export function delBrand(id: string) {
  return request<Responce<boolean>>({
    url: `TbCarBrand/${id}`,
    method: "delete"
  })
}

export function editBrand(brand: IBrand) {
  return request<Responce<boolean>>({
    url: `TbCarBrand/${brand.brandId}`,
    method: "put",
    data: brand
  })
}

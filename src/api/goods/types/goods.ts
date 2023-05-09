export interface ISku {
  id: string
  name: string
  picture: string
  price: number
  productId: string
  skuTypeId: string
}

export interface ISkuType {
  id: string
  name: string
  skus?: ISku[]
}

export interface IGoods {
  id?: string
  cateId: string
  description: string
  goodInfo: string
  goodName: string
  isHot: boolean
  isNew: boolean
  isShow: boolean
  isDel: boolean
  keyword: string
  otPrice: number
  picture: string
  price: number
  sales: number
  shopId: number
  stock: number
  unitName: string
  updateTime: string
  vipPrice: number
  skuTypes: ISkuType[]
}

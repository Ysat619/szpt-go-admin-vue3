export interface ISku {
  id: number
  name: string
  picture: string
  price: number
  productId: string
  skuTypeId: string
}

export interface IGoodsAdd {
  cateId: BigInt
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
}

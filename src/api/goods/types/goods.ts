export interface ISku {
  id: number
  name: string
  picture: string
  price: number
  productId: string
  skuTypeId: string
}

export interface IGoods {
  cateId: BigInt
  createTime?: string
  description: string
  goodInfo: string
  goodName: string
  id?: number
  isDel: boolean
  isHot: boolean
  isNew: boolean
  isShow: boolean
  keyword: string
  otPrice: number
  picture: string
  price: number
  sales: number
  shopId: number
  skuTypes: TbSkuType[]
  skus: TbSku[]
  sort?: boolean
  stock: number
  unitName: string
  updateTime: string
  vipPrice: number
}

import { IGoods, ISku } from "@/api/goods/types/goods"
import { IUser } from "@/api/login/types/login"

export interface IOrder {
  address: IAddress
  addressId: string
  createDate: string
  good: IGoods
  goodId: string
  id: string
  isDel: boolean
  price: number
  skuIds: string
  skus: ISku[]
  status: OrderStatus
  updateDate: string
  userId: string
  user: IUser
}

export interface CreateOrderParam {
  addressId: string
  goodId: string
  skuIds: string[]
  userId: string
}

export interface IAddress {
  address: string
  areaCode: string
  createDate: string
  id: string
  isDefault: boolean
  isDel: boolean
  phone: string
  updateDate: string
  userId: string
}

export enum OrderStatus {
  ALL = "-1",
  UNDEFINED = "0", // 未确认
  CANCELLED = "1", // 取消
  UNRATED = "2", // 未评价
  EVALUATED = "3", // 完成评价
  REVIEWED = "4" // 完成
}

export interface IOrderStatusArray {
  status: string
  means: string
}

export const OrderStatusArray: IOrderStatusArray[] = [
  { status: "0", means: "未确认" },
  { status: "1", means: "取消" },
  { status: "2", means: "未评价" },
  { status: "3", means: "完成评价" },
  { status: "4", means: "完成" }
]

export const OrderStatusArrayForSearch: IOrderStatusArray[] = [{ status: "-1", means: "所有" }, ...OrderStatusArray]

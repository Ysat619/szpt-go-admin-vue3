export interface Responce<T> {
  code: string
  msg: string
  data: T
}

export interface Page {
  current: number
  size: number
  total: number // 无用
}

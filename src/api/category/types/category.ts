export interface ICategoryType {
  id?: string
  name: string
  categories?: Array<ICategory>
  hasChildren?: boolean
}

export interface ICategory {
  id?: string
  categoryTypeId: string
  name: string
  picture: string
  rank?: string
}

export interface AdminProduct {
  id: string
  title: string
  description?: string
  price: number
  main_category_id: string
  sub_category_id: string
  sub_group_id: string
  colors: string[]
  sizes: number[]
  assets: string[]
  main_category?: {
    id: string
    name: string
  }
  sub_category?: {
    id: string
    name: string
  }
  sub_group?: {
    id: string
    name: string
  }
}

export interface ProductCreate {
  title: string
  description?: string
  price: number
  main_category_id: string
  sub_category_id: string
  sub_group_id: string
  colors: string[]
  sizes: number[]
  assets: string[]
}

export interface ProductUpdate {
  title?: string
  description?: string
  price?: number
  main_category_id?: string
  sub_category_id?: string
  sub_group_id?: string
  colors?: string[]
  sizes?: number[]
  assets?: string[]
}

export interface ProductSummary {
  id: string
  title: string
  price: number
  main_category_id: string
  sub_category_id: string
  sub_group_id: string
}

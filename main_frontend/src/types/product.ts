export interface Product {
  id: string
  title: string
  price: number
  colors: string[]
  sizes: number[]
  assets: string[]
}

export interface ProductsResponse {
  products: Product[]
  loading: boolean
  error: string | null
}

export interface ProductFull extends Product {
description?: string;
}

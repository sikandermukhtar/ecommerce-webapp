export const API_CONFIG = {
  BASE_URL: "http://localhost:8000",
  ENDPOINTS: {
    CATEGORIES_TREE: "/categories/tree",
    PRODUCTS_BY_MAIN: "/products/main",
    PRODUCTS_BY_SUB: "/products/sub",
    PRODUCTS_BY_GROUP: "/products/group",
    PRODUCT_BY_ID: "/products",
  },
} as const

export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS, id?: string) => {
  const baseEndpoint = API_CONFIG.ENDPOINTS[endpoint]
  return id ? `${API_CONFIG.BASE_URL}${baseEndpoint}/${id}` : `${API_CONFIG.BASE_URL}${baseEndpoint}`
}

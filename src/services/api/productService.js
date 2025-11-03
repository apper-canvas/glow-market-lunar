import { toast } from 'react-toastify'

const productService = {
  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  },

  // Transform database record to frontend format
  transformProduct(dbProduct) {
    return {
      Id: dbProduct.Id,
      name: dbProduct.name_c,
      brand: dbProduct.brand_c,
      category: dbProduct.category_c,
      subcategory: dbProduct.subcategory_c,
      price: parseFloat(dbProduct.price_c || 0),
      salePrice: dbProduct.sale_price_c ? parseFloat(dbProduct.sale_price_c) : null,
      rating: parseFloat(dbProduct.rating_c || 0),
      reviewCount: parseInt(dbProduct.review_count_c || 0),
      description: dbProduct.description_c,
      inStock: dbProduct.in_stock_c === true,
      tags: dbProduct.tags_c ? dbProduct.tags_c.split(',').map(tag => tag.trim()) : [],
      images: dbProduct.images_c ? dbProduct.images_c.split(',').map(img => img.trim()) : [],
      ingredients: [] // Not in database schema, keeping empty for compatibility
    }
  },

  async getAll() {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "images_c"}}
        ],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data.map(product => this.transformProduct(product))
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.getRecordById('product_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "images_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return null
      }

      if (!response.data) return null

      return this.transformProduct(response.data)
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async getByCategory(category) {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "images_c"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}],
        orderBy: [{"fieldName": "rating_c", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(product => this.transformProduct(product))
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error?.response?.data?.message || error)
      return []
    }
  },

  async getBySubcategory(subcategory) {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "images_c"}}
        ],
        where: [{"FieldName": "subcategory_c", "Operator": "EqualTo", "Values": [subcategory]}],
        orderBy: [{"fieldName": "rating_c", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(product => this.transformProduct(product))
    } catch (error) {
      console.error(`Error fetching products by subcategory ${subcategory}:`, error?.response?.data?.message || error)
      return []
    }
  },

  async search(query) {
    try {
      const apperClient = this.getApperClient()
      const searchTerm = query.toLowerCase()
      
      // Search across name, brand, description, and tags
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "images_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "name_c", "operator": "Contains", "values": [searchTerm]},
                {"fieldName": "brand_c", "operator": "Contains", "values": [searchTerm]},
                {"fieldName": "description_c", "operator": "Contains", "values": [searchTerm]},
                {"fieldName": "tags_c", "operator": "Contains", "values": [searchTerm]}
              ],
              operator: "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "rating_c", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(product => this.transformProduct(product))
    } catch (error) {
      console.error(`Error searching products for "${query}":`, error?.response?.data?.message || error)
      return []
    }
  },

  async getFeatured(limit = 8) {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "images_c"}}
        ],
        orderBy: [{"fieldName": "rating_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(product => this.transformProduct(product))
    } catch (error) {
      console.error("Error fetching featured products:", error?.response?.data?.message || error)
      return []
    }
  },

  async getRelated(productId, limit = 4) {
    try {
      // First get the current product to find its category
      const currentProduct = await this.getById(productId)
      if (!currentProduct) return []

      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "images_c"}}
        ],
        where: [
          {"FieldName": "category_c", "Operator": "EqualTo", "Values": [currentProduct.category]},
          {"FieldName": "Id", "Operator": "NotEqualTo", "Values": [parseInt(productId)]}
        ],
        orderBy: [{"fieldName": "rating_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(product => this.transformProduct(product))
    } catch (error) {
      console.error(`Error fetching related products for ${productId}:`, error?.response?.data?.message || error)
      return []
    }
  },

  async filterProducts(filters = {}) {
    try {
      const apperClient = this.getApperClient()
      let whereConditions = []
      let orderBy = [{"fieldName": "rating_c", "sorttype": "DESC"}]

      // Build where conditions
      if (filters.category) {
        whereConditions.push({"FieldName": "category_c", "Operator": "EqualTo", "Values": [filters.category]})
      }

      if (filters.subcategory) {
        whereConditions.push({"FieldName": "subcategory_c", "Operator": "EqualTo", "Values": [filters.subcategory]})
      }

      if (filters.brand && filters.brand.length > 0) {
        whereConditions.push({"FieldName": "brand_c", "Operator": "EqualTo", "Values": filters.brand, "Include": true})
      }

      if (filters.priceMin !== undefined && filters.priceMin !== "") {
        whereConditions.push({"FieldName": "price_c", "Operator": "GreaterThanOrEqualTo", "Values": [parseFloat(filters.priceMin)]})
      }

      if (filters.priceMax !== undefined && filters.priceMax !== "") {
        whereConditions.push({"FieldName": "price_c", "Operator": "LessThanOrEqualTo", "Values": [parseFloat(filters.priceMax)]})
      }

      if (filters.inStock) {
        whereConditions.push({"FieldName": "in_stock_c", "Operator": "EqualTo", "Values": [true]})
      }

      if (filters.tags && filters.tags.length > 0) {
        whereConditions.push({"FieldName": "tags_c", "Operator": "Contains", "Values": filters.tags})
      }

      // Handle sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            orderBy = [{"fieldName": "price_c", "sorttype": "ASC"}]
            break
          case "price-high":
            orderBy = [{"fieldName": "price_c", "sorttype": "DESC"}]
            break
          case "rating":
            orderBy = [{"fieldName": "rating_c", "sorttype": "DESC"}]
            break
          case "newest":
            orderBy = [{"fieldName": "Id", "sorttype": "DESC"}]
            break
          default:
            orderBy = [{"fieldName": "rating_c", "sorttype": "DESC"}]
        }
      }

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "images_c"}}
        ],
        where: whereConditions,
        orderBy
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(product => this.transformProduct(product))
    } catch (error) {
      console.error("Error filtering products:", error?.response?.data?.message || error)
      return []
    }
  }
}

export default productService

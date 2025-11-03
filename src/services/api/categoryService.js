import { toast } from 'react-toastify'

const categoryService = {
  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  },

  async getAll() {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords('category_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "slug_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "subcategories_c"}}
        ],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data.map(category => ({
        Id: category.Id,
        name: category.name_c,
        slug: category.slug_c,
        description: category.description_c,
        image: category.image_c,
        subcategories: category.subcategories_c ? JSON.parse(category.subcategories_c) : []
      }))
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.getRecordById('category_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "slug_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "subcategories_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return null
      }

      if (!response.data) return null

      const category = response.data
      return {
        Id: category.Id,
        name: category.name_c,
        slug: category.slug_c,
        description: category.description_c,
        image: category.image_c,
        subcategories: category.subcategories_c ? JSON.parse(category.subcategories_c) : []
      }
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async getBySlug(slug) {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords('category_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "slug_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "subcategories_c"}}
        ],
        where: [{"FieldName": "slug_c", "Operator": "EqualTo", "Values": [slug]}]
      })

      if (!response.success) {
        console.error(response.message)
        return null
      }

      if (!response.data || response.data.length === 0) return null

      const category = response.data[0]
      return {
        Id: category.Id,
        name: category.name_c,
        slug: category.slug_c,
        description: category.description_c,
        image: category.image_c,
        subcategories: category.subcategories_c ? JSON.parse(category.subcategories_c) : []
      }
    } catch (error) {
      console.error(`Error fetching category by slug ${slug}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async getSubcategories(categorySlug) {
    try {
      const category = await this.getBySlug(categorySlug)
      return category ? category.subcategories : []
    } catch (error) {
      console.error(`Error fetching subcategories for ${categorySlug}:`, error)
      return []
    }
  },

  async create(categoryData) {
    try {
      const apperClient = this.getApperClient()
      const params = {
        records: [{
          name_c: categoryData.name,
          slug_c: categoryData.slug,
          description_c: categoryData.description,
          image_c: categoryData.image,
          subcategories_c: JSON.stringify(categoryData.subcategories || [])
        }]
      }

      const response = await apperClient.createRecord('category_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, JSON.stringify(failed))
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          const created = successful[0].data
          return {
            Id: created.Id,
            name: created.name_c,
            slug: created.slug_c,
            description: created.description_c,
            image: created.image_c,
            subcategories: created.subcategories_c ? JSON.parse(created.subcategories_c) : []
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = this.getApperClient()
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: updateData.name,
          slug_c: updateData.slug,
          description_c: updateData.description,
          image_c: updateData.image,
          subcategories_c: JSON.stringify(updateData.subcategories || [])
        }]
      }

      const response = await apperClient.updateRecord('category_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, JSON.stringify(failed))
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          const updated = successful[0].data
          return {
            Id: updated.Id,
            name: updated.name_c,
            slug: updated.slug_c,
            description: updated.description_c,
            image: updated.image_c,
            subcategories: updated.subcategories_c ? JSON.parse(updated.subcategories_c) : []
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getApperClient()
      const params = { 
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('category_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} categories:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length === 1
      }
      return false
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error)
      return false
    }
  }
}

export default categoryService

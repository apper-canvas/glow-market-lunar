import { toast } from 'react-toastify'

const collectionService = {
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
      const response = await apperClient.fetchRecords('collection_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "slug_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "product_ids_c"}}
        ],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data.map(collection => ({
        Id: collection.Id,
        name: collection.name_c,
        slug: collection.slug_c,
        description: collection.description_c,
        featured: collection.featured_c,
        image: collection.image_c,
        productIds: collection.product_ids_c ? collection.product_ids_c.split(',') : []
      }))
    } catch (error) {
      console.error("Error fetching collections:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.getRecordById('collection_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "slug_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "product_ids_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return null
      }

      if (!response.data) return null

      const collection = response.data
      return {
        Id: collection.Id,
        name: collection.name_c,
        slug: collection.slug_c,
        description: collection.description_c,
        featured: collection.featured_c,
        image: collection.image_c,
        productIds: collection.product_ids_c ? collection.product_ids_c.split(',') : []
      }
    } catch (error) {
      console.error(`Error fetching collection ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async getBySlug(slug) {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords('collection_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "slug_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "product_ids_c"}}
        ],
        where: [{"FieldName": "slug_c", "Operator": "EqualTo", "Values": [slug]}]
      })

      if (!response.success) {
        console.error(response.message)
        return null
      }

      if (!response.data || response.data.length === 0) return null

      const collection = response.data[0]
      return {
        Id: collection.Id,
        name: collection.name_c,
        slug: collection.slug_c,
        description: collection.description_c,
        featured: collection.featured_c,
        image: collection.image_c,
        productIds: collection.product_ids_c ? collection.product_ids_c.split(',') : []
      }
    } catch (error) {
      console.error(`Error fetching collection by slug ${slug}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async getFeatured() {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords('collection_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "slug_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "product_ids_c"}}
        ],
        where: [{"FieldName": "featured_c", "Operator": "EqualTo", "Values": [true]}],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data.map(collection => ({
        Id: collection.Id,
        name: collection.name_c,
        slug: collection.slug_c,
        description: collection.description_c,
        featured: collection.featured_c,
        image: collection.image_c,
        productIds: collection.product_ids_c ? collection.product_ids_c.split(',') : []
      }))
    } catch (error) {
      console.error("Error fetching featured collections:", error?.response?.data?.message || error)
      return []
    }
  },

  async create(collectionData) {
    try {
      const apperClient = this.getApperClient()
      const params = {
        records: [{
          name_c: collectionData.name,
          slug_c: collectionData.slug,
          description_c: collectionData.description,
          featured_c: collectionData.featured || false,
          image_c: collectionData.image,
          product_ids_c: collectionData.productIds ? collectionData.productIds.join(',') : ''
        }]
      }

      const response = await apperClient.createRecord('collection_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} collections:`, JSON.stringify(failed))
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
            featured: created.featured_c,
            image: created.image_c,
            productIds: created.product_ids_c ? created.product_ids_c.split(',') : []
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error creating collection:", error?.response?.data?.message || error)
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
          featured_c: updateData.featured,
          image_c: updateData.image,
          product_ids_c: updateData.productIds ? updateData.productIds.join(',') : ''
        }]
      }

      const response = await apperClient.updateRecord('collection_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} collections:`, JSON.stringify(failed))
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
            featured: updated.featured_c,
            image: updated.image_c,
            productIds: updated.product_ids_c ? updated.product_ids_c.split(',') : []
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error updating collection:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getApperClient()
      const params = { 
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('collection_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} collections:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length === 1
      }
      return false
    } catch (error) {
      console.error("Error deleting collection:", error?.response?.data?.message || error)
      return false
    }
  }
}

export default collectionService

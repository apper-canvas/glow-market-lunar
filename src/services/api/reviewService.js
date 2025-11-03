import { toast } from 'react-toastify'

const reviewService = {
  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  },

  // Transform database record to frontend format
  transformReview(dbReview) {
    return {
      Id: dbReview.Id,
      productId: dbReview.product_id_c,
      rating: parseInt(dbReview.rating_c || 0),
      title: dbReview.title_c,
      content: dbReview.content_c,
      reviewerName: dbReview.reviewer_name_c,
      date: dbReview.date_c,
      helpful: parseInt(dbReview.helpful_c || 0)
    }
  },

  async getAll() {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "reviewer_name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "helpful_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data.map(review => this.transformReview(review))
    } catch (error) {
      console.error("Error fetching reviews:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.getRecordById('review_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "reviewer_name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "helpful_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return null
      }

      if (!response.data) return null

      return this.transformReview(response.data)
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async getByProductId(productId) {
    try {
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "reviewer_name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "helpful_c"}}
        ],
        where: [{"FieldName": "product_id_c", "Operator": "EqualTo", "Values": [productId.toString()]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(review => this.transformReview(review))
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error?.response?.data?.message || error)
      return []
    }
  },

  async create(reviewData) {
    try {
      const apperClient = this.getApperClient()
      const params = {
        records: [{
          product_id_c: reviewData.productId,
          rating_c: parseInt(reviewData.rating),
          title_c: reviewData.title,
          content_c: reviewData.content,
          reviewer_name_c: reviewData.reviewerName,
          date_c: new Date().toISOString().split('T')[0],
          helpful_c: 0
        }]
      }

      const response = await apperClient.createRecord('review_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} reviews:`, JSON.stringify(failed))
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          return this.transformReview(successful[0].data)
        }
      }
      return null
    } catch (error) {
      console.error("Error creating review:", error?.response?.data?.message || error)
      return null
    }
  },

  async markHelpful(reviewId) {
    try {
      // Get current review first
      const currentReview = await this.getById(reviewId)
      if (!currentReview) return null

      const apperClient = this.getApperClient()
      const params = {
        records: [{
          Id: parseInt(reviewId),
          helpful_c: currentReview.helpful + 1
        }]
      }

      const response = await apperClient.updateRecord('review_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} reviews:`, JSON.stringify(failed))
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          return this.transformReview(successful[0].data)
        }
      }
      return null
    } catch (error) {
      console.error(`Error marking review ${reviewId} as helpful:`, error?.response?.data?.message || error)
      return null
    }
  },

  async getAverageRating(productId) {
    try {
      const reviews = await this.getByProductId(productId)
      if (reviews.length === 0) return 0

      const total = reviews.reduce((sum, review) => sum + review.rating, 0)
      return Math.round((total / reviews.length) * 10) / 10
    } catch (error) {
      console.error(`Error calculating average rating for product ${productId}:`, error)
      return 0
    }
  },

  async getRatingDistribution(productId) {
    try {
      const reviews = await this.getByProductId(productId)
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

      reviews.forEach(review => {
        distribution[review.rating]++
      })

      return distribution
    } catch (error) {
      console.error(`Error getting rating distribution for product ${productId}:`, error)
      return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }
}

export default reviewService

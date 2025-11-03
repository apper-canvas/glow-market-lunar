import reviewsData from "../mockData/reviews.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const reviewService = {
  async getAll() {
    await delay(300);
    return [...reviewsData];
  },

  async getById(id) {
    await delay(200);
    const review = reviewsData.find(r => r.Id === parseInt(id));
    return review ? { ...review } : null;
  },

  async getByProductId(productId) {
    await delay(250);
    return reviewsData
      .filter(r => r.productId === productId.toString())
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(r => ({ ...r }));
  },

  async create(reviewData) {
    await delay(400);
    const newId = Math.max(...reviewsData.map(r => r.Id)) + 1;
    const newReview = {
      Id: newId,
      ...reviewData,
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };
    reviewsData.push(newReview);
    return { ...newReview };
  },

  async markHelpful(reviewId) {
    await delay(200);
    const review = reviewsData.find(r => r.Id === parseInt(reviewId));
    if (review) {
      review.helpful += 1;
      return { ...review };
    }
    return null;
  },

  async getAverageRating(productId) {
    await delay(150);
    const productReviews = reviewsData.filter(r => r.productId === productId.toString());
    if (productReviews.length === 0) return 0;
    
    const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / productReviews.length) * 10) / 10;
  },

  async getRatingDistribution(productId) {
    await delay(150);
    const productReviews = reviewsData.filter(r => r.productId === productId.toString());
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    productReviews.forEach(review => {
      distribution[review.rating]++;
    });

    return distribution;
  }
};

export default reviewService;
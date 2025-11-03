import productsData from "../mockData/products.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const productService = {
  async getAll() {
    await delay(300);
    return [...productsData];
  },

  async getById(id) {
    await delay(200);
    const product = productsData.find(p => p.Id === parseInt(id));
    return product ? { ...product } : null;
  },

  async getByCategory(category) {
    await delay(250);
    return productsData.filter(p => p.category === category).map(p => ({ ...p }));
  },

  async getBySubcategory(subcategory) {
    await delay(250);
    return productsData.filter(p => p.subcategory === subcategory).map(p => ({ ...p }));
  },

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return productsData.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    ).map(p => ({ ...p }));
  },

  async getFeatured(limit = 8) {
    await delay(250);
    // Return highest rated products as featured
    return productsData
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
      .map(p => ({ ...p }));
  },

  async getRelated(productId, limit = 4) {
    await delay(200);
    const product = productsData.find(p => p.Id === parseInt(productId));
    if (!product) return [];
    
    // Get related products from same category, excluding current product
    return productsData
      .filter(p => p.category === product.category && p.Id !== parseInt(productId))
      .slice(0, limit)
      .map(p => ({ ...p }));
  },

  async filterProducts(filters = {}) {
    await delay(300);
    let filtered = [...productsData];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Filter by subcategory
    if (filters.subcategory) {
      filtered = filtered.filter(p => p.subcategory === filters.subcategory);
    }

    // Filter by brand
    if (filters.brand && filters.brand.length > 0) {
      filtered = filtered.filter(p => filters.brand.includes(p.brand));
    }

    // Filter by price range
    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(p => (p.salePrice || p.price) >= filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(p => (p.salePrice || p.price) <= filters.priceMax);
    }

    // Filter by in stock
    if (filters.inStock) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(p => 
        filters.tags.some(tag => p.tags.includes(tag))
      );
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
          break;
        case "price-high":
          filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          // Since we don't have dates, sort by Id desc
          filtered.sort((a, b) => b.Id - a.Id);
          break;
        default:
          // Default sort by rating
          filtered.sort((a, b) => b.rating - a.rating);
      }
    }

    return filtered.map(p => ({ ...p }));
  }
};

export default productService;
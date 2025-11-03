import collectionsData from "../mockData/collections.json";
import productService from "./productService.js";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const collectionService = {
  async getAll() {
    await delay(250);
    return [...collectionsData];
  },

  async getById(id) {
    await delay(200);
    const collection = collectionsData.find(c => c.Id === parseInt(id));
    return collection ? { ...collection } : null;
  },

  async getBySlug(slug) {
    await delay(200);
    const collection = collectionsData.find(c => c.slug === slug);
    return collection ? { ...collection } : null;
  },

  async getFeatured() {
    await delay(200);
    return collectionsData.filter(c => c.featured).map(c => ({ ...c }));
  },

  async getCollectionProducts(collectionId) {
    await delay(300);
    const collection = collectionsData.find(c => c.Id === parseInt(collectionId));
    if (!collection) return [];

    const allProducts = await productService.getAll();
    return allProducts.filter(p => collection.productIds.includes(p.Id.toString()));
  },

  async create(collectionData) {
    await delay(350);
    const newId = Math.max(...collectionsData.map(c => c.Id)) + 1;
    const newCollection = {
      Id: newId,
      ...collectionData,
      featured: false
    };
    collectionsData.push(newCollection);
    return { ...newCollection };
  },

  async update(id, updateData) {
    await delay(300);
    const collectionIndex = collectionsData.findIndex(c => c.Id === parseInt(id));
    if (collectionIndex !== -1) {
      collectionsData[collectionIndex] = { ...collectionsData[collectionIndex], ...updateData };
      return { ...collectionsData[collectionIndex] };
    }
    return null;
  },

  async delete(id) {
    await delay(300);
    const collectionIndex = collectionsData.findIndex(c => c.Id === parseInt(id));
    if (collectionIndex !== -1) {
      const deletedCollection = collectionsData.splice(collectionIndex, 1)[0];
      return { ...deletedCollection };
    }
    return null;
  }
};

export default collectionService;
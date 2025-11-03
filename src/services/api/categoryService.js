import categoriesData from "../mockData/categories.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const categoryService = {
  async getAll() {
    await delay(200);
    return [...categoriesData];
  },

  async getById(id) {
    await delay(150);
    const category = categoriesData.find(c => c.Id === parseInt(id));
    return category ? { ...category } : null;
  },

  async getBySlug(slug) {
    await delay(150);
    const category = categoriesData.find(c => c.slug === slug);
    return category ? { ...category } : null;
  },

  async getSubcategories(categorySlug) {
    await delay(150);
    const category = categoriesData.find(c => c.slug === categorySlug);
    return category ? [...category.subcategories] : [];
  },

  async create(categoryData) {
    await delay(300);
    const newId = Math.max(...categoriesData.map(c => c.Id)) + 1;
    const newCategory = {
      Id: newId,
      ...categoryData
    };
    categoriesData.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updateData) {
    await delay(250);
    const categoryIndex = categoriesData.findIndex(c => c.Id === parseInt(id));
    if (categoryIndex !== -1) {
      categoriesData[categoryIndex] = { ...categoriesData[categoryIndex], ...updateData };
      return { ...categoriesData[categoryIndex] };
    }
    return null;
  },

  async delete(id) {
    await delay(250);
    const categoryIndex = categoriesData.findIndex(c => c.Id === parseInt(id));
    if (categoryIndex !== -1) {
      const deletedCategory = categoriesData.splice(categoryIndex, 1)[0];
      return { ...deletedCategory };
    }
    return null;
  }
};

export default categoryService;
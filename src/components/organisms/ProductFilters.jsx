import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import categoryService from "@/services/api/categoryService";
import productService from "@/services/api/productService";

const ProductFilters = ({ 
  filters = {}, 
  onFiltersChange, 
  showMobileFilters, 
  onCloseMobileFilters,
  className = "" 
}) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    tags: true
  });

  const [localFilters, setLocalFilters] = useState({
    category: "",
    subcategory: "",
    brand: [],
    priceMin: "",
    priceMax: "",
    inStock: false,
    tags: [],
    sortBy: "rating",
    ...filters
  });

  const availableTags = [
    "vitamin-c", "anti-aging", "cruelty-free", "vegan", "organic", 
    "sensitive-skin", "oily-skin", "dry-skin", "waterproof", 
    "long-wear", "natural", "paraben-free"
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoryData, productData] = await Promise.all([
        categoryService.getAll(),
        productService.getAll()
      ]);
      
      setCategories(categoryData);
      
      // Extract unique brands
      const uniqueBrands = [...new Set(productData.map(p => p.brand))].sort();
      setBrands(uniqueBrands);
    } catch (error) {
      console.error("Error loading filter data:", error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleBrand = (brand) => {
    const currentBrands = localFilters.brand || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    updateFilter("brand", newBrands);
  };

  const toggleTag = (tag) => {
    const currentTags = localFilters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    updateFilter("tags", newTags);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: "",
      subcategory: "",
      brand: [],
      priceMin: "",
      priceMax: "",
      inStock: false,
      tags: [],
      sortBy: "rating"
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.category) count++;
    if (localFilters.subcategory) count++;
    if (localFilters.brand?.length > 0) count++;
    if (localFilters.priceMin || localFilters.priceMax) count++;
    if (localFilters.inStock) count++;
    if (localFilters.tags?.length > 0) count++;
    return count;
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-display font-semibold text-gray-900">{title}</h3>
        <ApperIcon 
          name="ChevronDown" 
          className={`w-4 h-4 text-gray-500 transition-transform ${
            expandedSections[sectionKey] ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const FiltersContent = () => (
    <div className="bg-surface rounded-xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg font-bold text-gray-900">Filters</h2>
          {getActiveFilterCount() > 0 && (
            <Badge variant="primary" size="sm">
              {getActiveFilterCount()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
          {showMobileFilters && (
            <Button variant="ghost" size="icon" onClick={onCloseMobileFilters}>
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="p-4 border-b border-gray-100">
        <label className="block font-body font-medium text-gray-900 mb-2">
          Sort By
        </label>
        <select
          value={localFilters.sortBy}
          onChange={(e) => updateFilter("sortBy", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="rating">Highest Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Categories */}
      <FilterSection title="Categories" sectionKey="categories">
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.Id} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value={category.slug}
                checked={localFilters.category === category.slug}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <span className="font-body text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands" sectionKey="brands">
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localFilters.brand?.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="text-primary focus:ring-primary"
              />
              <span className="font-body text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" sectionKey="price">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-body text-gray-600 mb-1">Min</label>
              <Input
                type="number"
                placeholder="$0"
                value={localFilters.priceMin}
                onChange={(e) => updateFilter("priceMin", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-body text-gray-600 mb-1">Max</label>
              <Input
                type="number"
                placeholder="$100"
                value={localFilters.priceMax}
                onChange={(e) => updateFilter("priceMax", e.target.value)}
              />
            </div>
          </div>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={localFilters.inStock}
              onChange={(e) => updateFilter("inStock", e.target.checked)}
              className="text-primary focus:ring-primary"
            />
            <span className="font-body text-gray-700">In Stock Only</span>
          </label>
        </div>
      </FilterSection>

      {/* Tags */}
      <FilterSection title="Features" sectionKey="tags">
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-body transition-colors ${
                localFilters.tags?.includes(tag)
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag.replace('-', ' ')}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className={`hidden lg:block ${className}`}>
        <FiltersContent />
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobileFilters}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-80 bg-background shadow-2xl z-50 overflow-y-auto"
            >
              <FiltersContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductFilters;
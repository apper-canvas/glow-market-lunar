import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProductGrid from "@/components/organisms/ProductGrid";
import ProductFilters from "@/components/organisms/ProductFilters";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: categorySlug || "",
    subcategory: "",
    brand: [],
    priceMin: "",
    priceMax: "",
    inStock: false,
    tags: [],
    sortBy: "rating"
  });

  useEffect(() => {
    loadCategoryAndProducts();
  }, [categorySlug]);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const loadCategoryAndProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [categoryData, productsData] = await Promise.all([
        categoryService.getBySlug(categorySlug),
        productService.getByCategory(categorySlug)
      ]);

      if (!categoryData) {
        setError("Category not found");
        return;
      }

      setCategory(categoryData);
      setProducts(productsData);
      
      // Update filters with current category
      setFilters(prev => ({ ...prev, category: categorySlug }));
    } catch (err) {
      setError("Failed to load category products");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filtered = await productService.filterProducts(filters);
      setFilteredProducts(filtered);
    } catch (error) {
      console.error("Error filtering products:", error);
      setFilteredProducts(products);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  if (loading) return <Loading type="grid" />;
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error 
          title="Category Not Found"
          message={error}
          onRetry={loadCategoryAndProducts}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm font-body text-gray-600 mb-8">
          <button 
            onClick={() => navigate("/")}
            className="hover:text-primary transition-colors"
          >
            Home
          </button>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-gray-900 capitalize">{category?.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 p-8 lg:p-12"
          >
            <div className="relative z-10 max-w-3xl">
              <h1 className="font-display text-4xl lg:text-6xl font-bold text-gray-900 mb-4 capitalize">
                {category?.name}
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-body">
                {category?.description}
              </p>
            </div>
            
            {/* Background Pattern */}
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-5">
              <div className="w-full h-full bg-gradient-to-l from-primary to-accent"></div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={toggleMobileFilters}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <ApperIcon name="Filter" className="w-4 h-4" />
              Filters & Sort
            </span>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              showMobileFilters={showMobileFilters}
              onCloseMobileFilters={() => setShowMobileFilters(false)}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 font-body">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <Empty
                icon="Package"
                title="No products found"
                message="Try adjusting your filters to find what you're looking for."
                actionLabel="Clear Filters"
                onAction={() => setFilters({
                  category: categorySlug || "",
                  subcategory: "",
                  brand: [],
                  priceMin: "",
                  priceMax: "",
                  inStock: false,
                  tags: [],
                  sortBy: "rating"
                })}
              />
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ProductGrid from "@/components/organisms/ProductGrid";
import ProductFilters from "@/components/organisms/ProductFilters";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import productService from "@/services/api/productService";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    brand: [],
    priceMin: "",
    priceMax: "",
    inStock: false,
    tags: [],
    sortBy: "rating"
  });

  useEffect(() => {
    if (query) {
      searchProducts();
    } else {
      setProducts([]);
      setFilteredProducts([]);
    }
  }, [query]);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const searchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const results = await productService.search(query);
      setProducts(results);
    } catch (err) {
      setError("Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    try {
      // Apply filters to search results
      let filtered = [...products];

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
      if (filters.priceMin !== undefined && filters.priceMin !== "") {
        filtered = filtered.filter(p => (p.salePrice || p.price) >= parseFloat(filters.priceMin));
      }
      if (filters.priceMax !== undefined && filters.priceMax !== "") {
        filtered = filtered.filter(p => (p.salePrice || p.price) <= parseFloat(filters.priceMax));
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
            filtered.sort((a, b) => b.Id - a.Id);
            break;
          default:
            filtered.sort((a, b) => b.rating - a.rating);
        }
      }

      setFilteredProducts(filtered);
    } catch (error) {
      console.error("Error filtering products:", error);
      setFilteredProducts(products);
    }
  };

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const clearSearch = () => {
    setSearchParams({});
    setProducts([]);
    setFilteredProducts([]);
  };

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
          <span className="text-gray-900">Search Results</span>
        </nav>

        {/* Search Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8"
          >
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {query ? `Search Results for "${query}"` : "Search Products"}
            </h1>
            
            <div className="max-w-md">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search for products, brands, or ingredients..."
              />
            </div>
          </motion.div>
        </div>

        {query && (
          <>
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

              {/* Results */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600 font-body">
                    {loading ? "Searching..." : `${filteredProducts.length} results found`}
                  </p>
                  {query && (
                    <Button variant="ghost" onClick={clearSearch}>
                      <ApperIcon name="X" className="w-4 h-4 mr-2" />
                      Clear Search
                    </Button>
                  )}
                </div>

                {loading ? (
                  <Loading type="grid" />
                ) : error ? (
                  <Error message={error} onRetry={searchProducts} />
                ) : filteredProducts.length === 0 && query ? (
                  <Empty
                    icon="Search"
                    title="No results found"
                    message={`We couldn't find any products matching "${query}". Try different keywords or check the spelling.`}
                    actionLabel="Clear Search"
                    onAction={clearSearch}
                  />
                ) : (
                  <ProductGrid products={filteredProducts} />
                )}
              </div>
            </div>
          </>
        )}

        {!query && (
          <div className="text-center py-20">
            <ApperIcon name="Search" className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-semibold text-gray-900 mb-4">
              Start Your Beauty Journey
            </h2>
            <p className="text-gray-600 font-body mb-8 max-w-md mx-auto">
              Search for your favorite products, brands, or discover something new. 
              We have everything you need to glow!
            </p>
            <Button onClick={() => navigate("/")}>
              Browse All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
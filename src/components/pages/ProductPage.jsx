import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductDetail from "@/components/organisms/ProductDetail";
import ProductGrid from "@/components/organisms/ProductGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import productService from "@/services/api/productService";

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [productData, relatedData] = await Promise.all([
        productService.getById(productId),
        productService.getRelated(productId, 4)
      ]);

      if (!productData) {
        setError("Product not found");
        return;
      }

      setProduct(productData);
      setRelatedProducts(relatedData);
    } catch (err) {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToProducts = () => {
    navigate(-1);
  };

  if (loading) return <Loading type="detail" />;
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error 
          title="Product Not Found"
          message={error}
          onRetry={loadProduct}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToProducts}
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          
          <nav className="flex items-center space-x-2 text-sm font-body text-gray-600">
            <button 
              onClick={() => navigate("/")}
              className="hover:text-primary transition-colors"
            >
              Home
            </button>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
            <button 
              onClick={() => navigate(`/category/${product?.category}`)}
              className="hover:text-primary transition-colors capitalize"
            >
              {product?.category}
            </button>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
            <span className="text-gray-900">{product?.name}</span>
          </nav>
        </div>

        {/* Product Detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ProductDetail product={product} />
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16"
          >
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-8">
              You Might Also Like
            </h2>
            <ProductGrid products={relatedProducts} />
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
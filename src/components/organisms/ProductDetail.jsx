import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Rating from "@/components/atoms/Rating";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useCart } from "@/hooks/useCart";
import reviewService from "@/services/api/reviewService";

const ProductDetail = ({ product }) => {
  const { addToCart, isInCart, getCartItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [expandedIngredients, setExpandedIngredients] = useState(false);

  useEffect(() => {
    if (product) {
      loadReviews();
    }
  }, [product]);

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const data = await reviewService.getByProductId(product.Id);
      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  if (!product) {
    return <Loading type="detail" />;
  }

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error("Product is currently out of stock");
      return;
    }
    addToCart(product, quantity);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  const cartItem = getCartItem(product.Id);

  const tabs = [
    { id: "description", label: "Description", icon: "FileText" },
    { id: "ingredients", label: "Ingredients", icon: "Leaf" },
    { id: "reviews", label: `Reviews (${reviews.length})`, icon: "Star" }
  ];

  return (
    <div className="bg-surface rounded-2xl shadow-card overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-8 p-8">
        {/* Images */}
        <div className="space-y-4">
          <motion.div 
            className="aspect-square rounded-xl overflow-hidden bg-gray-100"
            layoutId="product-image"
          >
            <img
              src={product.images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index 
                      ? "border-primary" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-secondary font-body font-medium">{product.brand}</span>
              {hasDiscount && (
                <Badge variant="error" size="sm">
                  -{discountPercent}% OFF
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <Rating 
                rating={product.rating} 
                showCount 
                count={product.reviewCount} 
                size="lg"
              />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-display font-bold text-gray-900">
                ${price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xl font-body text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="accent" size="sm">
                  {tag.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-body font-medium text-gray-900">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <ApperIcon name="Minus" className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 font-body font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  className="h-10 w-10"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1"
                size="lg"
              >
                <ApperIcon name={isInCart(product.Id) ? "Check" : "ShoppingBag"} className="w-5 h-5 mr-2" />
                {isInCart(product.Id) ? `In Cart (${cartItem?.quantity || 0})` : "Add to Cart"}
              </Button>
              <Button variant="outline" size="lg" className="px-6">
                <ApperIcon name="Heart" className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
            <div className="flex items-center gap-2">
              <ApperIcon name="Truck" className="w-5 h-5 text-primary" />
              <span className="text-sm font-body text-gray-700">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="RefreshCw" className="w-5 h-5 text-primary" />
              <span className="text-sm font-body text-gray-700">30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Shield" className="w-5 h-5 text-primary" />
              <span className="text-sm font-body text-gray-700">Authentic Products</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Award" className="w-5 h-5 text-primary" />
              <span className="text-sm font-body text-gray-700">Premium Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-100">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-body font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <p className="font-body text-gray-700 leading-relaxed text-lg">
                  {product.description}
                </p>
              </motion.div>
            )}

            {activeTab === "ingredients" && (
              <motion.div
                key="ingredients"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-4">
                  Key Ingredients
                </h3>
                <div className="grid gap-3">
                  {product.ingredients.slice(0, expandedIngredients ? undefined : 5).map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <ApperIcon name="Leaf" className="w-5 h-5 text-success" />
                      <span className="font-body font-medium text-gray-900">{ingredient}</span>
                    </div>
                  ))}
                </div>
                {product.ingredients.length > 5 && (
                  <Button
                    variant="outline"
                    onClick={() => setExpandedIngredients(!expandedIngredients)}
                    className="mt-4"
                  >
                    {expandedIngredients ? "Show Less" : `Show All ${product.ingredients.length} Ingredients`}
                  </Button>
                )}
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {loadingReviews ? (
                  <Loading />
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.Id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Rating rating={review.rating} size="sm" />
                              <span className="font-body font-semibold text-gray-900">{review.reviewerName}</span>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            {review.title && (
                              <h4 className="font-display font-semibold text-gray-900 mb-2">
                                {review.title}
                              </h4>
                            )}
                            <p className="font-body text-gray-700 leading-relaxed">
                              {review.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {reviews.length > 3 && (
                      <Button variant="outline" className="w-full">
                        View All {reviews.length} Reviews
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ApperIcon name="MessageSquare" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="font-body text-gray-600">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Rating from "@/components/atoms/Rating";
import Badge from "@/components/atoms/Badge";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product.inStock) {
      toast.error("Product is currently out of stock");
      return;
    }
    addToCart(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.Id}`);
  };

  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="bg-surface rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden rounded-t-xl">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <Badge variant="error" size="sm">
              -{discountPercent}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" size="sm">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick Add Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3"
        >
          <Button
            size="icon"
            variant={isInCart(product.Id) ? "primary" : "secondary"}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ApperIcon 
              name={isInCart(product.Id) ? "Check" : "Plus"} 
              className="w-4 h-4" 
            />
          </Button>
        </motion.div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <p className="text-sm font-body text-secondary font-medium">{product.brand}</p>
          <h3 className="font-display text-lg font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="mb-3">
          <Rating 
            rating={product.rating} 
            size="sm" 
            showCount 
            count={product.reviewCount} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm font-body text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="default" size="sm">
                {tag.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
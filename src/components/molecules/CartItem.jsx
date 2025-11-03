import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useCart } from "@/hooks/useCart";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(product.Id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(product.Id);
  };

  const price = product.salePrice || product.price;
  const totalPrice = price * quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-4 p-4 bg-surface rounded-lg shadow-card"
    >
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-display font-semibold text-gray-900 text-sm line-clamp-1">
              {product.name}
            </h4>
            <p className="text-secondary text-xs font-body">{product.brand}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="text-gray-400 hover:text-error h-6 w-6 p-1"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="Minus" className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center font-body font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="Plus" className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="text-right">
            <p className="font-display font-bold text-gray-900">
              ${totalPrice.toFixed(2)}
            </p>
            {product.salePrice && (
              <p className="text-xs text-gray-500 line-through">
                ${(product.price * quantity).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {!product.inStock && (
          <p className="text-error text-xs mt-2 font-body">Out of stock</p>
        )}
      </div>
    </motion.div>
  );
};

export default CartItem;
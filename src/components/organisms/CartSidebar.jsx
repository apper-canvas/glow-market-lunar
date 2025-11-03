import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Empty from "@/components/ui/Empty";
import { useCart } from "@/hooks/useCart";

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getCartItemCount } = useCart();

  const total = getCartTotal();
  const itemCount = getCartItemCount();

  const handleCheckout = () => {
    navigate("/checkout");
    onClose();
  };

  const handleContinueShopping = () => {
    navigate("/");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="font-display text-xl font-bold text-gray-900">
                Shopping Cart ({itemCount})
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <Empty
                    icon="ShoppingBag"
                    title="Your cart is empty"
                    message="Add some beautiful products to get started!"
                    actionLabel="Continue Shopping"
                    onAction={handleContinueShopping}
                  />
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <CartItem key={item.productId} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-surface">
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-body text-gray-600">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-body text-gray-600">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex items-center justify-between text-lg font-display font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button 
                      onClick={handleCheckout}
                      className="w-full"
                      size="lg"
                    >
                      <ApperIcon name="CreditCard" className="w-4 h-4 mr-2" />
                      Checkout
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleContinueShopping}
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSidebar;
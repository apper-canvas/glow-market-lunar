import { useLocalStorage } from "./useLocalStorage";
import { toast } from "react-toastify";

export const useCart = () => {
  const [cartItems, setCartItems] = useLocalStorage("glow-market-cart", []);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.Id.toString());
      
      if (existingItem) {
        toast.success("Cart updated!");
        return prevItems.map(item =>
          item.productId === product.Id.toString()
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        toast.success("Added to cart!");
        return [...prevItems, {
          productId: product.Id.toString(),
          quantity,
          addedAt: new Date().toISOString(),
          product: {
            Id: product.Id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            salePrice: product.salePrice,
            images: product.images,
            inStock: product.inStock
          }
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.productId !== productId.toString());
      toast.info("Removed from cart");
      return newItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId.toString()
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId.toString());
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.productId === productId.toString());
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getCartItem
  };
};
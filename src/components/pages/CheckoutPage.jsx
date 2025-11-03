import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useCart } from "@/hooks/useCart";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  });

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/");
      toast.info("Your cart is empty. Add some products to checkout.");
    }
  }, [cartItems, navigate, orderPlaced]);

  const handleShippingChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateShippingInfo = () => {
    const required = ["firstName", "lastName", "email", "address", "city", "state", "zipCode"];
    return required.every(field => shippingInfo[field].trim() !== "");
  };

  const validatePaymentInfo = () => {
    const required = ["cardNumber", "expiryDate", "cvv", "nameOnCard"];
    return required.every(field => paymentInfo[field].trim() !== "");
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateShippingInfo()) {
      toast.error("Please fill in all required shipping information");
      return;
    }
    if (currentStep === 2 && !validatePaymentInfo()) {
      toast.error("Please fill in all required payment information");
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    if (!validateShippingInfo() || !validatePaymentInfo()) {
      toast.error("Please complete all required information");
      return;
    }

    try {
      // Simulate order processing
      const newOrderId = `GM${Date.now()}`;
      setOrderId(newOrderId);
      setOrderPlaced(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const steps = [
    { number: 1, title: "Shipping", icon: "Truck" },
    { number: 2, title: "Payment", icon: "CreditCard" },
    { number: 3, title: "Review", icon: "CheckCircle" }
  ];

  if (orderPlaced) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-b from-success/5 to-surface">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <ApperIcon name="Check" className="w-12 h-12 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600 font-body mb-6">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            
            <div className="bg-surface rounded-xl shadow-card p-6 mb-8">
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                Order Details
              </h2>
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="font-body text-gray-600">Order Number:</span>
                  <span className="font-body font-semibold text-gray-900">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-gray-600">Total:</span>
                  <span className="font-display font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-gray-600">Email:</span>
                  <span className="font-body text-gray-900">{shippingInfo.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button size="lg" onClick={() => navigate("/")}>
                Continue Shopping
              </Button>
              <p className="text-sm text-gray-600 font-body">
                You'll receive a confirmation email shortly with tracking information.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {currentStep > step.number ? (
                    <ApperIcon name="Check" className="w-5 h-5" />
                  ) : (
                    <span className="font-body font-semibold">{step.number}</span>
                  )}
                </div>
                <span className={`ml-2 font-body font-medium ${
                  currentStep >= step.number ? "text-primary" : "text-gray-600"
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step.number ? "bg-primary" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-xl shadow-card p-8">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
                    Shipping Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body font-medium text-gray-900 mb-2">
                        First Name *
                      </label>
                      <Input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleShippingChange("firstName", e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-body font-medium text-gray-900 mb-2">
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleShippingChange("lastName", e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block font-body font-medium text-gray-900 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleShippingChange("email", e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block font-body font-medium text-gray-900 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleShippingChange("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block font-body font-medium text-gray-900 mb-2">
                        Street Address *
                      </label>
                      <Input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => handleShippingChange("address", e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-body font-medium text-gray-900 mb-2">
                        City *
                      </label>
                      <Input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingChange("city", e.target.value)}
                        placeholder="New York"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-body font-medium text-gray-900 mb-2">
                        State *
                      </label>
                      <Input
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) => handleShippingChange("state", e.target.value)}
                        placeholder="NY"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-body font-medium text-gray-900 mb-2">
                        ZIP Code *
                      </label>
                      <Input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => handleShippingChange("zipCode", e.target.value)}
                        placeholder="10001"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-body font-medium text-gray-900 mb-2">
                        Country
                      </label>
                      <select
                        value={shippingInfo.country}
                        onChange={(e) => handleShippingChange("country", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
                    Payment Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block font-body font-medium text-gray-900 mb-2">
                        Name on Card *
                      </label>
                      <Input
                        type="text"
                        value={paymentInfo.nameOnCard}
                        onChange={(e) => handlePaymentChange("nameOnCard", e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-body font-medium text-gray-900 mb-2">
                        Card Number *
                      </label>
                      <Input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-body font-medium text-gray-900 mb-2">
                          Expiry Date *
                        </label>
                        <Input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => handlePaymentChange("expiryDate", e.target.value)}
                          placeholder="MM/YY"
                        />
                      </div>
                      
                      <div>
                        <label className="block font-body font-medium text-gray-900 mb-2">
                          CVV *
                        </label>
                        <Input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
                    Review Your Order
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-display font-semibold text-gray-900 mb-3">Shipping Address</h3>
                      <div className="text-gray-600 font-body">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-display font-semibold text-gray-900 mb-3">Payment Method</h3>
                      <p className="text-gray-600 font-body">
                        **** **** **** {paymentInfo.cardNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                >
                  <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < 3 ? (
                  <Button onClick={handleNextStep}>
                    Next
                    <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handlePlaceOrder}>
                    <ApperIcon name="CreditCard" className="w-4 h-4 mr-2" />
                    Place Order
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-xl shadow-card p-6 sticky top-8">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-body font-medium text-gray-900 text-sm line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 text-xs">{item.product.brand}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                        <span className="font-body font-semibold text-gray-900">
                          ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600 font-body">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-body">
                  <span>Shipping</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600 font-body">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between font-display text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
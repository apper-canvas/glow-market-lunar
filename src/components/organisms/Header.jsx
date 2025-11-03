import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import CartSidebar from "@/components/organisms/CartSidebar";
import { useCart } from "@/hooks/useCart";
import categoryService from "@/services/api/categoryService";

const Header = () => {
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cartItemCount = getCartItemCount();

  useEffect(() => {
    loadCategories();
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowMobileMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleCartSidebar = () => {
    setShowCartSidebar(!showCartSidebar);
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{ 
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 1)",
          backdropFilter: isScrolled ? "blur(10px)" : "blur(0px)"
        }}
        className="sticky top-0 z-40 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Sparkles" className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Glow Market
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div
                className="relative"
                onMouseEnter={() => setShowCategoriesDropdown(true)}
                onMouseLeave={() => setShowCategoriesDropdown(false)}
              >
                <button className="flex items-center gap-1 font-body font-medium text-gray-700 hover:text-primary transition-colors duration-200">
                  Shop
                  <ApperIcon name="ChevronDown" className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {showCategoriesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-2"
                    >
                      {categories.map((category) => (
                        <Link
                          key={category.Id}
                          to={`/category/${category.slug}`}
                          className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                          onClick={() => setShowCategoriesDropdown(false)}
                        >
                          <div className="font-body font-medium text-gray-900">
                            {category.name}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {category.description}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Link to="/collections" className="font-body font-medium text-gray-700 hover:text-primary transition-colors duration-200">
                Collections
              </Link>
              <Link to="/brands" className="font-body font-medium text-gray-700 hover:text-primary transition-colors duration-200">
                Brands
              </Link>
              <Link to="/about" className="font-body font-medium text-gray-700 hover:text-primary transition-colors duration-200">
                About
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Search - Mobile */}
              <div className="md:hidden">
                <Button variant="ghost" size="icon">
                  <ApperIcon name="Search" className="w-5 h-5" />
                </Button>
              </div>

              {/* Cart */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleCartSidebar}
                className="relative"
              >
                <ApperIcon name="ShoppingBag" className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </motion.span>
                )}
              </Button>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden">
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  <ApperIcon name={showMobileMenu ? "X" : "Menu"} className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-100 pt-4 pb-4"
              >
                <SearchBar onSearch={handleSearch} className="mb-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden bg-white border-t border-gray-100"
            >
              <div className="max-w-7xl mx-auto px-4 py-6">
                <nav className="space-y-4">
                  {categories.map((category) => (
                    <Link
                      key={category.Id}
                      to={`/category/${category.slug}`}
                      className="block font-body font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                  <Link
                    to="/collections"
                    className="block font-body font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Collections
                  </Link>
                  <Link
                    to="/brands"
                    className="block font-body font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Brands
                  </Link>
                  <Link
                    to="/about"
                    className="block font-body font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    About
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={showCartSidebar} onClose={() => setShowCartSidebar(false)} />
    </>
  );
};

export default Header;
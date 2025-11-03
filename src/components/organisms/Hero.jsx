import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Hero = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/category/skincare");
  };

  const handleExploreCollections = () => {
    navigate("/collections");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5 py-20 lg:py-32">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
              Discover Your
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Natural Glow
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl lg:text-2xl text-gray-600 font-body mb-8 leading-relaxed"
          >
            Curated beauty essentials with transparent ingredients, honest reviews, and 
            expert recommendations to help you look and feel your best.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" onClick={handleShopNow} className="px-8 py-4">
              <ApperIcon name="Sparkles" className="w-5 h-5 mr-2" />
              Shop Now
            </Button>
            <Button variant="outline" size="lg" onClick={handleExploreCollections} className="px-8 py-4">
              <ApperIcon name="Star" className="w-5 h-5 mr-2" />
              Explore Collections
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-success/20 to-success/10 rounded-full flex items-center justify-center mb-4">
                <ApperIcon name="Leaf" className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">Clean Ingredients</h3>
              <p className="text-gray-600 font-body text-sm">Carefully selected natural and organic ingredients</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-4">
                <ApperIcon name="Shield" className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">Trusted Brands</h3>
              <p className="text-gray-600 font-body text-sm">Partnered with renowned beauty experts worldwide</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent/20 to-accent/10 rounded-full flex items-center justify-center mb-4">
                <ApperIcon name="Heart" className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">Customer Love</h3>
              <p className="text-gray-600 font-body text-sm">Thousands of satisfied customers trust our recommendations</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
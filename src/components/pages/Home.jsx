import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/organisms/Hero";
import FeaturedCollections from "@/components/organisms/FeaturedCollections";
import CategoryShowcase from "@/components/organisms/CategoryShowcase";
import ProductGrid from "@/components/organisms/ProductGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getFeatured(8);
      setFeaturedProducts(data);
    } catch (err) {
      setError("Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Hero />
      
      <FeaturedCollections />
      
      <CategoryShowcase />
      
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            >
              Trending Now
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 font-body max-w-2xl mx-auto"
            >
              Discover the most loved products by our beauty community
            </motion.p>
          </div>

          {loading ? (
            <Loading type="grid" />
          ) : error ? (
            <Error message={error} onRetry={loadFeaturedProducts} />
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-success/20 to-success/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-display font-bold text-success">10K+</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900">Happy Customers</h3>
              <p className="text-gray-600 font-body">Thousands trust us for their beauty needs</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-display font-bold text-primary">500+</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900">Premium Products</h3>
              <p className="text-gray-600 font-body">Carefully curated from top brands worldwide</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-display font-bold text-accent">24/7</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900">Expert Support</h3>
              <p className="text-gray-600 font-body">Beauty experts ready to help anytime</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
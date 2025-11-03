import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CategoryCard from "@/components/molecules/CategoryCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import categoryService from "@/services/api/categoryService";

const CategoryShowcase = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadCategories} />;

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Shop by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 font-body max-w-2xl mx-auto"
          >
            Find exactly what you're looking for in our carefully organized categories
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.Id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <CategoryCard category={category} size="md" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
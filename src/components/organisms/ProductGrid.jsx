import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import Empty from "@/components/ui/Empty";

const ProductGrid = ({ products = [], title, className = "" }) => {
  if (products.length === 0) {
    return (
      <div className={className}>
        <Empty
          icon="Package"
          title="No products found"
          message="Try adjusting your filters or search terms to find what you're looking for."
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">
          {title}
        </h2>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductGrid;
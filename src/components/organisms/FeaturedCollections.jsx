import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import collectionService from "@/services/api/collectionService";

const FeaturedCollections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFeaturedCollections();
  }, []);

  const loadFeaturedCollections = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await collectionService.getFeatured();
      setCollections(data);
    } catch (err) {
      setError("Failed to load featured collections");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadFeaturedCollections} />;
  if (collections.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Featured Collections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 font-body max-w-2xl mx-auto"
          >
            Discover our carefully curated collections designed to enhance your natural beauty
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.Id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl cursor-pointer group"
              onClick={() => navigate(`/collection/${collection.slug}`)}
            >
              <div className="aspect-[4/3] lg:aspect-[3/2]">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/30 transition-all duration-500" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-3">
                  {collection.name}
                </h3>
                <p className="text-white/90 font-body mb-6 line-clamp-2">
                  {collection.description}
                </p>
                <Button 
                  variant="secondary" 
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900"
                >
                  Shop Collection
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate("/collections")}
            className="px-8"
          >
            View All Collections
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
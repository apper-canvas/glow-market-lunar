import { motion } from "framer-motion";

const LoadingCard = () => (
  <div className="bg-surface rounded-xl shadow-card p-4 animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const LoadingProductGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
);

const LoadingProductDetail = () => (
  <div className="bg-surface rounded-xl shadow-card p-8 animate-pulse">
    <div className="grid md:grid-cols-2 gap-8">
      <div className="aspect-square bg-gray-200 rounded-lg"></div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const Loading = ({ type = "grid" }) => {
  const LoadingComponents = {
    grid: LoadingProductGrid,
    card: LoadingCard,
    detail: LoadingProductDetail
  };

  const Component = LoadingComponents[type] || LoadingProductGrid;

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Component />
      </motion.div>
    </div>
  );
};

export default Loading;
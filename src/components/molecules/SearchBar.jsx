import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search products...", 
  className,
  showSuggestions = false,
  suggestions = []
}) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(value.length > 0 && showSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowDropdown(false);
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(query.length > 0 && showSuggestions)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="pr-12"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary transition-colors duration-200"
          >
            <ApperIcon name="Search" className="w-5 h-5" />
          </button>
        </div>
      </form>

      {showDropdown && filteredSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="flex items-center gap-3">
                <ApperIcon name="Search" className="w-4 h-4 text-gray-400" />
                <span className="font-body text-gray-700">{suggestion}</span>
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
import { Filter } from 'lucide-react';

interface FilterPanelProps {
  minSimilarity: number;
  onMinSimilarityChange: (value: number) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function FilterPanel({
  minSimilarity,
  onMinSimilarityChange,
  categories,
  selectedCategory,
  onCategoryChange
}: FilterPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex items-center gap-2 font-semibold text-gray-900">
        <Filter size={20} />
        <span>Filters</span>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Minimum Similarity: {minSimilarity}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={minSimilarity}
          onChange={(e) => onMinSimilarityChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

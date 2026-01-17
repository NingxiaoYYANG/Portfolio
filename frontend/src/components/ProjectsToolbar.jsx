import { motion } from 'framer-motion';
import { useRecruiterMode } from '../contexts/RecruiterModeContext';

const categories = ['All', 'Web', 'Backend', 'DevOps', 'Game', 'Hackathon'];
const sortOptions = ['Featured', 'Most recent'];

export default function ProjectsToolbar({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}) {
  const { recruiterMode } = useRecruiterMode();

  return (
    <div className="mb-8 flex flex-wrap items-center gap-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm text-gray-400">Sort:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option} value={option.toLowerCase().replace(' ', '-')}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Search (Optional) */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm w-48"
        />
      </div>
    </div>
  );
}

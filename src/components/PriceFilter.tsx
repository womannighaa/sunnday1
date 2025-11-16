import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PriceFilterProps {
  onFilterChange: (minPrice: number, maxPrice: number) => void;
  maxAvailable: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function PriceFilter({
  onFilterChange,
  maxAvailable,
  isOpen = true,
  onClose,
}: PriceFilterProps) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(maxAvailable);

  useEffect(() => {
    setMaxPrice(maxAvailable);
  }, [maxAvailable]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxPrice);
    setMinPrice(value);
    onFilterChange(value, maxPrice);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minPrice);
    setMaxPrice(value);
    onFilterChange(minPrice, value);
  };

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(maxAvailable);
    onFilterChange(0, maxAvailable);
  };

  const containerClass = isOpen
    ? 'block'
    : 'hidden md:block';

  return (
    <div className={`${containerClass} fixed md:relative left-0 top-0 z-40 md:z-auto h-screen md:h-auto w-full md:w-64 bg-white md:bg-transparent md:border-r md:border-gray-200 p-6 md:p-0 md:py-12 overflow-y-auto md:overflow-y-visible`}>
      <div className="md:hidden flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Price Range</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="hidden md:block mb-6">
        <h2 className="text-xl font-bold mb-4">Price Range</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Minimum Price</label>
          <input
            type="range"
            min="0"
            max={maxAvailable}
            value={minPrice}
            onChange={handleMinChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <input
            type="number"
            value={minPrice}
            onChange={(e) => {
              const value = Math.min(Number(e.target.value), maxPrice);
              setMinPrice(value);
              onFilterChange(value, maxPrice);
            }}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Min price"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Maximum Price</label>
          <input
            type="range"
            min="0"
            max={maxAvailable}
            value={maxPrice}
            onChange={handleMaxChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => {
              const value = Math.max(Number(e.target.value), minPrice);
              setMaxPrice(value);
              onFilterChange(minPrice, value);
            }}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Max price"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Price Range</p>
          <p className="text-lg font-bold text-blue-600">
            KSh {minPrice.toLocaleString()} - KSh {maxPrice.toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Reset Filter
        </button>

        <button
          onClick={onClose}
          className="md:hidden w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}

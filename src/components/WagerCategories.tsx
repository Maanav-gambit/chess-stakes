import React from 'react';
import { DollarSign } from 'lucide-react';

const wagerCategories = [
  { name: 'Beginner', minWager: 1, maxWager: 10, minElo: 0, maxElo: 1200 },
  { name: 'Intermediate', minWager: 10, maxWager: 50, minElo: 1200, maxElo: 1800 },
  { name: 'Advanced', minWager: 50, maxWager: 200, minElo: 1800, maxElo: 2200 },
  { name: 'Expert', minWager: 200, maxWager: 1000, minElo: 2200, maxElo: 3000 },
];

const WagerCategories: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Wager Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wagerCategories.map((category) => (
          <div key={category.name} className="border rounded-md p-4">
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-gray-600 mb-1">ELO Range: {category.minElo} - {category.maxElo}</p>
            <p className="flex items-center text-green-600">
              <DollarSign size={16} className="mr-1" />
              Wager: ${category.minWager} - ${category.maxWager}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WagerCategories;
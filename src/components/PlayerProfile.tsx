import React from 'react';
import { User, Trophy, DollarSign } from 'lucide-react';

const PlayerProfile: React.FC = () => {
  // This is mock data. In a real application, this would come from a backend API
  const playerData = {
    name: 'John Doe',
    elo: 1500,
    winRate: 55,
    totalGames: 100,
    totalWagered: 500,
    totalWon: 550,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <User size={64} className="text-gray-400 mr-4" />
        <div>
          <h2 className="text-2xl font-bold">{playerData.name}</h2>
          <p className="text-gray-600">ELO: {playerData.elo}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Trophy size={20} className="mr-2 text-yellow-500" />
            Win Rate
          </h3>
          <p className="text-2xl font-bold">{playerData.winRate}%</p>
          <p className="text-sm text-gray-500">Out of {playerData.totalGames} games</p>
        </div>
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <DollarSign size={20} className="mr-2 text-green-500" />
            Total Wagered
          </h3>
          <p className="text-2xl font-bold">${playerData.totalWagered}</p>
        </div>
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <DollarSign size={20} className="mr-2 text-blue-500" />
            Total Won
          </h3>
          <p className="text-2xl font-bold">${playerData.totalWon}</p>
          <p className="text-sm text-gray-500">
            Profit: ${playerData.totalWon - playerData.totalWagered}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
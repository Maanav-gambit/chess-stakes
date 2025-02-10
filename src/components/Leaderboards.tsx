import React, { useState, useMemo } from 'react';
import { Globe, Map, Trophy, Award, ChevronRight, Medal, Crown, Target } from 'lucide-react';

interface Player {
  rank: number;
  name: string;
  country: string;
  elo: number;
  winnings: number;
}

const continents: { [key: string]: string[] } = {
  global: [],
  asia: ['CN', 'JP', 'KR', 'IN'],
  europe: ['RU', 'DE', 'FR', 'GB', 'ES', 'IT', 'NL'],
  americas: ['US', 'CA', 'BR', 'AR', 'MX'],
  africa: ['ZA', 'EG', 'NG', 'KE', 'MA']
};

const generateMockData = (start: number, end: number): Player[] => {
  const countries = Object.values(continents).flat();
  const firstNames = ['Magnus', 'Hikaru', 'Fabiano', 'Ding', 'Ian', 'Anish', 'Maxime', 'Levon', 'Wesley', 'Viswanathan'];
  const lastNames = ['Carlsen', 'Nakamura', 'Caruana', 'Liren', 'Nepomniachtchi', 'Giri', 'Vachier-Lagrave', 'Aronian', 'So', 'Anand'];
  
  const players = Array.from({ length: end - start + 1 }, (_, i) => ({
    rank: 0,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    country: countries[Math.floor(Math.random() * countries.length)],
    elo: Math.floor(Math.random() * (2800 - 2000) + 2000),
    winnings: Math.floor(Math.random() * 1000000),
  }));

  players.sort((a, b) => b.winnings - a.winnings);

  return players.map((player, index) => ({
    ...player,
    rank: start + index,
  }));
};

const Leaderboards: React.FC = () => {
  const [region, setRegion] = useState<'global' | 'asia' | 'europe' | 'americas' | 'africa'>('global');
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year' | 'all'>('week');
  const [page, setPage] = useState(1);

  const allMockData = useMemo(() => generateMockData(1, 200), []);

  const filteredData = useMemo(() => {
    let filtered = allMockData;
    if (region !== 'global') {
      filtered = filtered.filter(player => continents[region].includes(player.country));
    }
    filtered.sort((a, b) => b.winnings - a.winnings);
    return filtered.map((player, index) => ({ ...player, rank: index + 1 }));
  }, [allMockData, region]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * 100;
    const end = start + 100;
    return filteredData.slice(start, end);
  }, [filteredData, page]);

  const regions = [
    { value: 'global', label: 'Global', icon: Globe },
    { value: 'asia', label: 'Asia', icon: Map },
    { value: 'europe', label: 'Europe', icon: Map },
    { value: 'americas', label: 'Americas', icon: Map },
    { value: 'africa', label: 'Africa', icon: Map },
  ];

  const timePeriods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#111827] rounded-xl p-8 shadow-2xl border border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Leaderboards</h1>
              <p className="text-gray-300">Track the performance of top players worldwide</p>
            </div>
            <Trophy className="w-16 h-16 text-yellow-400" />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#0f172a] rounded-xl p-8 shadow-2xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-yellow-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Rankings</h2>
            </div>
            <div className="flex space-x-4">
              <select
                className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as any)}
              >
                {timePeriods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6 flex space-x-4">
            {regions.map((r) => (
              <button
                key={r.value}
                onClick={() => {
                  setRegion(r.value as any);
                  setPage(1);
                }}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                  region === r.value
                    ? 'bg-yellow-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <r.icon size={20} className="mr-2" />
                {r.label}
              </button>
            ))}
          </div>

          <div className="bg-gray-800/50 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-black/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Player</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Country</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ELO</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Winnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {paginatedData.map((player) => (
                  <tr key={player.rank} className="hover:bg-gray-700/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center ${
                        player.rank <= 3 ? 'text-yellow-400' : 'text-gray-300'
                      }`}>
                        {player.rank <= 3 && <Crown className="w-4 h-4 mr-2" />}
                        {player.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{player.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={`https://flagcdn.com/24x18/${player.country.toLowerCase()}.png`}
                          alt={player.country}
                          className="mr-2"
                        />
                        <span className="text-gray-300">{player.country}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{player.elo}</td>
                    <td className="px-6 py-4 text-yellow-400">${player.winnings.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg flex items-center ${
                page === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
            >
              First Page
            </button>
            <span className="text-gray-300">
              Page {page} of {Math.ceil(filteredData.length / 100)}
            </span>
            <button
              onClick={() => setPage(Math.ceil(filteredData.length / 100))}
              disabled={page === Math.ceil(filteredData.length / 100)}
              className={`px-4 py-2 rounded-lg flex items-center ${
                page === Math.ceil(filteredData.length / 100)
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
            >
              Last Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;
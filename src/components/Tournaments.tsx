import React, { useState } from 'react';
import { 
  Trophy, Star, Calendar, 
  Zap, Award, Target,
  ChevronRight, Globe,
  Users, DollarSign
} from 'lucide-react';

interface Tournament {
  id: number;
  name: string;
  entryFee: number;
  prizePool: number;
  startDate: string;
  status: 'active' | 'upcoming' | 'past';
  description: string;
  participants: number;
  bgImage: string;
}

const Tournaments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'paid' | 'free'>('paid');
  const [statusFilter, setStatusFilter] = useState<'active' | 'upcoming' | 'past' | 'all'>('all');

  const tournaments: Tournament[] = [
    { 
      id: 1, 
      name: 'Grand Chess Challenge', 
      entryFee: 50, 
      prizePool: 10000, 
      startDate: '2024-04-01', 
      status: 'upcoming',
      description: 'Elite tournament featuring the world\'s top players competing for glory',
      participants: 128,
      bgImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=1080&q=80'
    },
    { 
      id: 2, 
      name: 'Weekly Blitz Showdown', 
      entryFee: 10, 
      prizePool: 1000, 
      startDate: '2024-03-15', 
      status: 'active',
      description: 'Fast-paced blitz tournament with rapid-fire matches',
      participants: 64,
      bgImage: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=1080&q=80'
    },
    { 
      id: 3, 
      name: 'Grandmaster Invitational', 
      entryFee: 100, 
      prizePool: 25000, 
      startDate: '2024-05-01', 
      status: 'upcoming',
      description: 'Exclusive tournament for Grandmasters with massive prize pool',
      participants: 16,
      bgImage: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=1080&q=80'
    },
    { 
      id: 4, 
      name: 'Beginner\'s Cup', 
      entryFee: 0, 
      prizePool: 500, 
      startDate: '2024-03-10', 
      status: 'past',
      description: 'Perfect tournament for newcomers to competitive chess',
      participants: 256,
      bgImage: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=1080&q=80'
    },
    { 
      id: 5, 
      name: 'Chess960 Championship', 
      entryFee: 25, 
      prizePool: 5000, 
      startDate: '2024-04-15', 
      status: 'upcoming',
      description: 'Fischer Random Chess tournament testing adaptability',
      participants: 32,
      bgImage: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=1080&q=80'
    },
  ];

  const filteredTournaments = tournaments.filter(
    (tournament) =>
      (activeTab === 'paid' ? tournament.entryFee > 0 : tournament.entryFee === 0) &&
      (statusFilter === 'all' || tournament.status === statusFilter)
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#111827] rounded-xl p-8 shadow-2xl border border-gray-800">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Chess Tournaments</h1>
            <p className="text-gray-300">Compete in prestigious tournaments with players worldwide</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0f172a] rounded-xl p-8 shadow-2xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Tournament Categories</h2>
            </div>
            <div className="flex space-x-4">
              <select
                className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All Tournaments</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <div className="flex rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab('paid')}
                  className={`px-4 py-2 ${
                    activeTab === 'paid'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Paid
                </button>
                <button
                  onClick={() => setActiveTab('free')}
                  className={`px-4 py-2 ${
                    activeTab === 'free'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Free
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-gray-800/50 rounded-xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-48">
                  <img
                    src={tournament.bgImage}
                    alt={tournament.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                      {tournament.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{tournament.name}</h3>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-gray-300 mb-6">{tournament.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Entry Fee</p>
                      <p className="text-white font-bold">${tournament.entryFee}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Prize Pool</p>
                      <p className="text-yellow-400 font-bold">${tournament.prizePool}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Start Date</p>
                      <p className="text-white font-bold">{tournament.startDate}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Players</p>
                      <p className="text-white font-bold">{tournament.participants}</p>
                    </div>
                  </div>

                  {/* Button Container - Always at the bottom */}
                  <div className="mt-auto">
                    {tournament.status !== 'past' && (
                      <button className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-300 flex items-center justify-center font-semibold">
                        {tournament.status === 'active' ? 'Join Tournament' : 'Register Now'}
                        <ChevronRight size={20} className="ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tournaments;
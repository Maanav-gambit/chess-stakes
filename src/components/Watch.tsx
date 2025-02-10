import React, { useState } from 'react';
import { Play, Users, Clock, Eye, Star, Trophy, ChevronRight } from 'lucide-react';

interface WatchProps {}

const Watch: React.FC<WatchProps> = () => {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'streams' | 'highlights'>('tournaments');

  const tournamentMatches = [
    {
      id: 1,
      title: "Grand Masters Championship Finals",
      player1: "Magnus Carlsen",
      player2: "Hikaru Nakamura",
      viewers: 15420,
      thumbnail: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      status: "LIVE",
      prize: "$100,000"
    },
    {
      id: 2,
      title: "European Chess League Semi-Finals",
      player1: "Alireza Firouzja",
      player2: "Fabiano Caruana",
      viewers: 8932,
      thumbnail: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      status: "LIVE",
      prize: "$50,000"
    },
    {
      id: 3,
      title: "World Rapid Chess Championship",
      player1: "Ding Liren",
      player2: "Wesley So",
      viewers: 12543,
      thumbnail: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      status: "LIVE",
      prize: "$75,000"
    }
  ];

  const streams = [
    {
      id: 1,
      streamer: "GothamChess",
      title: "Analyzing viewer games! !sub !prime",
      viewers: 12543,
      thumbnail: "https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: 2,
      streamer: "BotezLive",
      title: "Speed Chess Championship Practice",
      viewers: 8765,
      thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: 3,
      streamer: "GMHikaru",
      title: "Bullet Chess Marathon | Road to 3300",
      viewers: 24981,
      thumbnail: "https://images.unsplash.com/photo-1583321500900-82807e458f3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    }
  ];

  const highlights = [
    {
      id: 1,
      title: "Incredible Queen Sacrifice by Magnus",
      players: "Carlsen vs. Nepomniachtchi",
      views: 245000,
      duration: "12:34",
      thumbnail: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      prize: "Featured Match"
    },
    {
      id: 2,
      title: "The Greatest Chess Game of 2024",
      players: "Firouzja vs. Caruana",
      views: 183000,
      duration: "15:21",
      thumbnail: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      prize: "Tournament Final"
    },
    {
      id: 3,
      title: "Epic Endgame Battle",
      players: "Ding vs. Nepo",
      views: 156000,
      duration: "18:45",
      thumbnail: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      prize: "Semi Final"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">Watch Chess</h1>
        <p className="text-gray-300 text-lg">Experience the thrill of professional chess matches, streams, and highlights.</p>
      </div>

      <div className="flex space-x-4 mb-8">
        {[
          { id: 'tournaments', icon: Trophy, label: 'Live Tournaments' },
          { id: 'streams', icon: Users, label: 'Live Streams' },
          { id: 'highlights', icon: Star, label: 'Highlights' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-lg flex items-center transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-yellow-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <tab.icon className="mr-2" size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {activeTab === 'tournaments' && tournamentMatches.map(match => (
          <div key={match.id} className="group cursor-pointer transform transition-all duration-300 hover:translate-y-[-4px]">
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-[#1a1f35] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white line-clamp-1">
                    {match.title}
                  </h3>
                  <div className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full">
                    <Trophy size={14} className="mr-2 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">{match.prize}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video">
                  <img 
                    src={match.thumbnail} 
                    alt={match.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="bg-red-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-lg">
                    <Play size={14} className="mr-1" />
                    {match.status}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-center text-white">
                    <p className="text-lg font-medium opacity-90">{match.player1} <span className="text-yellow-400">vs</span> {match.player2}</p>
                    <div className="flex items-center bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-white/20">
                      <Eye size={14} className="mr-2 text-yellow-400" />
                      <span className="opacity-90">{match.viewers.toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="mt-4 flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300 text-sm">
                    Watch Now <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'streams' && streams.map(stream => (
          <div key={stream.id} className="group cursor-pointer transform transition-all duration-300 hover:translate-y-[-4px]">
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-[#1a1f35] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white line-clamp-1">
                    {stream.title}
                  </h3>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video">
                  <img 
                    src={stream.thumbnail} 
                    alt={stream.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="bg-red-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-lg">
                    <Play size={14} className="mr-1" />
                    LIVE
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-center text-white">
                    <p className="text-lg font-medium opacity-90">{stream.streamer}</p>
                    <div className="flex items-center bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-white/20">
                      <Eye size={14} className="mr-2 text-yellow-400" />
                      <span className="opacity-90">{stream.viewers.toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="mt-4 flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300 text-sm">
                    Join Stream <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'highlights' && highlights.map(highlight => (
          <div key={highlight.id} className="group cursor-pointer transform transition-all duration-300 hover:translate-y-[-4px]">
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-[#1a1f35] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white line-clamp-1">
                    {highlight.title}
                  </h3>
                  <div className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full">
                    <Trophy size={14} className="mr-2 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">{highlight.prize}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video">
                  <img 
                    src={highlight.thumbnail} 
                    alt={highlight.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-lg">
                    <Clock size={14} className="mr-1" />
                    {highlight.duration}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-center text-white">
                    <p className="text-lg font-medium opacity-90">{highlight.players}</p>
                    <div className="flex items-center bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-white/20">
                      <Eye size={14} className="mr-2 text-yellow-400" />
                      <span className="opacity-90">{highlight.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="mt-4 flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300 text-sm">
                    Watch Highlight <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watch;
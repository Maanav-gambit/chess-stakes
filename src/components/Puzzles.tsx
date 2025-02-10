import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { 
  Trophy, Star, Clock, Brain, 
  Zap, Calendar, Settings, 
  TrendingUp, Award, Target,
  Sparkles, Crown, Medal,
  ChevronRight
} from 'lucide-react';

interface PuzzleMode {
  id: 'daily' | 'rush' | 'custom';
  title: string;
  description: string;
  icon: React.ElementType;
  bgImage: string;
}

interface Achievement {
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  icon: React.ElementType;
}

const Puzzles: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'daily' | 'rush' | 'custom' | null>(null);
  const [game, setGame] = useState(new Chess());

  // Mock puzzle stats
  const puzzleStats = {
    rating: 1850,
    solved: 324,
    streak: 12,
    highestRating: 1920,
    accuracy: 84,
    rushHighScore: 32,
  };

  // Mock puzzle modes
  const puzzleModes: PuzzleMode[] = [
    {
      id: 'daily',
      title: 'Daily Puzzles',
      description: 'New hand-picked puzzles every day to challenge your skills',
      icon: Calendar,
      bgImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      id: 'rush',
      title: 'Puzzle Rush',
      description: 'Solve as many puzzles as you can before time runs out',
      icon: Zap,
      bgImage: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      id: 'custom',
      title: 'Custom Puzzles',
      description: 'Practice specific themes and difficulty levels',
      icon: Settings,
      bgImage: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
  ];

  // Mock achievements
  const achievements: Achievement[] = [
    {
      title: 'Puzzle Master',
      description: 'Solve 1000 puzzles',
      progress: 75,
      completed: false,
      icon: Trophy,
    },
    {
      title: 'Perfect Streak',
      description: 'Maintain a 20-puzzle streak',
      progress: 60,
      completed: false,
      icon: Star,
    },
    {
      title: 'Rush Champion',
      description: 'Score 40+ in Puzzle Rush',
      progress: 100,
      completed: true,
      icon: Crown,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#111827] rounded-xl p-8 shadow-2xl border border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Chess Puzzles</h1>
              <p className="text-gray-300">Train your tactical skills with thousands of puzzles</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Rating</p>
                <p className="text-3xl font-bold text-yellow-400">{puzzleStats.rating}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Solved</p>
                <p className="text-3xl font-bold text-white">{puzzleStats.solved}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Streak</p>
                <p className="text-3xl font-bold text-green-400">{puzzleStats.streak}</p>
              </div>
            </div>
          </div>
        </div>

        {!selectedMode ? (
          <>
            {/* Puzzle Categories */}
            <div className="bg-[#0f172a] rounded-xl p-8 shadow-2xl border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Brain className="w-8 h-8 text-yellow-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Puzzle Categories</h2>
                </div>
                <button className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 flex items-center">
                  View All <ChevronRight size={20} className="ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {puzzleModes.map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className="relative group cursor-pointer overflow-hidden rounded-xl transform transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <div className="absolute inset-0">
                      <img
                        src={mode.bgImage}
                        alt={mode.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent"></div>
                    </div>
                    <div className="relative p-6">
                      <div className="flex items-center mb-4">
                        <mode.icon className="w-8 h-8 text-yellow-400 mr-3" />
                        <h3 className="text-2xl font-bold text-white">{mode.title}</h3>
                      </div>
                      <p className="text-gray-300 mb-4">{mode.description}</p>
                      <button className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg flex items-center group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                        Start Training
                        <Brain className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Banner */}
            <div className="bg-[#111827] rounded-xl p-8 shadow-2xl border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-yellow-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Your Progress</h2>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-[#0f172a] rounded-xl p-6">
                  <p className="text-gray-400 text-sm mb-2">Highest Rating</p>
                  <p className="text-3xl font-bold text-white">{puzzleStats.highestRating}</p>
                </div>
                <div className="bg-[#0f172a] rounded-xl p-6">
                  <p className="text-gray-400 text-sm mb-2">Accuracy</p>
                  <p className="text-3xl font-bold text-green-400">{puzzleStats.accuracy}%</p>
                </div>
                <div className="bg-[#0f172a] rounded-xl p-6">
                  <p className="text-gray-400 text-sm mb-2">Rush High Score</p>
                  <p className="text-3xl font-bold text-yellow-400">{puzzleStats.rushHighScore}</p>
                </div>
                <div className="bg-[#0f172a] rounded-xl p-6">
                  <p className="text-gray-400 text-sm mb-2">Current Streak</p>
                  <p className="text-3xl font-bold text-blue-400">{puzzleStats.streak}</p>
                </div>
              </div>
            </div>

            {/* Achievements Banner */}
            <div className="bg-[#0f172a] rounded-xl p-8 shadow-2xl border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-yellow-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Achievements</h2>
                </div>
                <button className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 flex items-center">
                  View All <ChevronRight size={20} className="ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-[#111827] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <achievement.icon className={`w-8 h-8 mr-3 ${achievement.completed ? 'text-yellow-400' : 'text-gray-400'}`} />
                        <div>
                          <h3 className="font-bold text-white text-lg">{achievement.title}</h3>
                          <p className="text-sm text-gray-400">{achievement.description}</p>
                        </div>
                      </div>
                      {achievement.completed && (
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                      )}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-[#111827] rounded-xl p-8 shadow-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{puzzleModes.find(m => m.id === selectedMode)?.title}</h2>
              <button
                onClick={() => setSelectedMode(null)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Back to Modes
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Chessboard position={game.fen()} />
              </div>
              <div className="space-y-4">
                <div className="bg-[#0f172a] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Instructions</h3>
                  <p className="text-gray-300">Find the best move for white to gain advantage.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Puzzles;
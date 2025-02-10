import React, { useState } from 'react';
import { Users, Cpu } from 'lucide-react';

const Practice: React.FC = () => {
  const [searching, setSearching] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'player' | 'bot' | null>(null);

  const handleFindMatch = (mode: 'player' | 'bot') => {
    setSearching(true);
    setPracticeMode(mode);
    // Implement match-finding logic here
    setTimeout(() => {
      setSearching(false);
      alert(`Practice match found against ${mode === 'player' ? 'a player' : 'a bot'}! (This is a placeholder)`);
      setPracticeMode(null);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Practice Chess</h2>
      <p className="mb-6">Choose your practice mode:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2" size={24} />
            Practice with Players
          </h3>
          <p className="mb-4">Play against opponents with similar ELO ratings without wagering.</p>
          <button
            onClick={() => handleFindMatch('player')}
            disabled={searching}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center w-full ${
              searching && practiceMode === 'player' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {searching && practiceMode === 'player' ? 'Searching for player...' : 'Find Player Match'}
          </button>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Cpu className="mr-2" size={24} />
            Practice with Bot
          </h3>
          <p className="mb-4">Challenge our AI bot to improve your skills at your own pace.</p>
          <button
            onClick={() => handleFindMatch('bot')}
            disabled={searching}
            className={`bg-green-500 text-white px-4 py-2 rounded-md flex items-center justify-center w-full ${
              searching && practiceMode === 'bot' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
            }`}
          >
            {searching && practiceMode === 'bot' ? 'Setting up bot match...' : 'Start Bot Match'}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-gray-600">Your current ELO: 1500</p>
      </div>
    </div>
  );
};

export default Practice;
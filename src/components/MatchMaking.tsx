import React, { useState } from 'react';
import { Search } from 'lucide-react';

const MatchMaking: React.FC = () => {
  const [searchingForMatch, setSearchingForMatch] = useState(false);

  const handleFindMatch = () => {
    setSearchingForMatch(true);
    // Here you would implement the actual matchmaking logic
    setTimeout(() => {
      setSearchingForMatch(false);
      alert('Match found! (This is a placeholder)');
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Find a Match</h2>
      <div className="mb-4">
        <p className="text-gray-600">Your current ELO: 1500</p>
      </div>
      <button
        onClick={handleFindMatch}
        disabled={searchingForMatch}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center w-full ${
          searchingForMatch ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
      >
        {searchingForMatch ? (
          <>
            <Search className="animate-spin mr-2" size={20} />
            Searching for opponent...
          </>
        ) : (
          'Find Match'
        )}
      </button>
    </div>
  );
};

export default MatchMaking;
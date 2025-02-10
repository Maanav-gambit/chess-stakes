import React from 'react';

const GameHistory: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Game History</h2>
      <p>Here you can view the history of games you've played and your win/loss amounts.</p>
      {/* Add game history table or list here */}
    </div>
  );
};

export default GameHistory;
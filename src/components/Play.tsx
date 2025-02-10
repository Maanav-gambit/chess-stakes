import React, { useState } from 'react';
import { Users, Award } from 'lucide-react';
import GameLobby from './GameLobby';

const wagerAmounts = [1, 5, 10, 25, 50, 100];

interface LobbyInfo {
  wager: number;
  activeUsers: number;
  averageElo: number;
}

interface PlayProps {
  startMatch: (player1: any, player2: any, wager: number) => void;
}

const Play: React.FC<PlayProps> = ({ startMatch }) => {
  const [selectedWager, setSelectedWager] = useState<number | null>(null);
  const [joinedLobby, setJoinedLobby] = useState<LobbyInfo | null>(null);

  // Mock data for lobby information
  const lobbies: LobbyInfo[] = [
    { wager: 1, activeUsers: 8, averageElo: 1200 },
    { wager: 5, activeUsers: 6, averageElo: 1500 },
    { wager: 10, activeUsers: 4, averageElo: 1700 },
    { wager: 25, activeUsers: 2, averageElo: 1900 },
    { wager: 50, activeUsers: 1, averageElo: 2000 },
    { wager: 100, activeUsers: 1, averageElo: 2100 },
  ];

  const handleJoinLobby = (lobby: LobbyInfo) => {
    setJoinedLobby(lobby);
  };

  const handleExitLobby = () => {
    setJoinedLobby(null);
  };

  const handleMatchStart = (opponent: any) => {
    if (joinedLobby) {
      const currentPlayer = { name: "You", elo: 1500 }; // Replace with actual player data
      startMatch(currentPlayer, opponent, joinedLobby.wager);
    }
  };

  if (joinedLobby) {
    return <GameLobby wager={joinedLobby.wager} onExit={handleExitLobby} onMatchStart={handleMatchStart} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Choose Your Wager</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Wager Amount</h3>
        <div className="flex flex-wrap gap-2">
          {wagerAmounts.map((amount) => (
            <button
              key={amount}
              className={`px-4 py-2 rounded ${
                selectedWager === amount
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedWager(amount)}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>
      {selectedWager && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Available Lobbies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lobbies
              .filter((lobby) => lobby.wager === selectedWager)
              .map((lobby, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                  <p className="text-2xl font-bold mb-2">${lobby.wager}</p>
                  <div className="flex items-center mb-1">
                    <Users size={18} className="mr-2 text-yellow-500" />
                    <p>{lobby.activeUsers} users</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <Award size={18} className="mr-2 text-yellow-500" />
                    <p>Avg. ELO: {lobby.averageElo}</p>
                  </div>
                  <button
                    className="w-full mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-300"
                    onClick={() => handleJoinLobby(lobby)}
                  >
                    Join Lobby
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;
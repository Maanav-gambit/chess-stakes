import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Award, UserPlus, Check } from 'lucide-react';

interface GameLobbyProps {
  wager: number;
  onExit: () => void;
  onMatchStart: (opponent: any) => void;
}

interface Player {
  id: string;
  name: string;
  elo: number;
  ready: boolean;
  inGame: boolean;
}

const GameLobby: React.FC<GameLobbyProps> = ({ wager, onExit, onMatchStart }) => {
  const [lobbyPlayers, setLobbyPlayers] = useState<Player[]>([]);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [matchOffer, setMatchOffer] = useState<string | null>(null);

  const userElo = 1500; // Mock user ELO, replace with actual user ELO when available
  const userName = "Alice Johnson"; // Mock user name, replace with actual user name when available

  useEffect(() => {
    // Simulate players joining the lobby with mock real names
    const mockNames = [
      "Bob Smith", "Charlie Brown", "David Lee", "Emma Watson", "Frank Miller",
      "Grace Chen", "Henry Ford", "Ivy Zhang", "Jack Robinson", "Kate Wilson"
    ];
    const simulatedPlayers = Array.from({ length: 9 }, (_, i) => ({
      id: `player-${i + 2}`,
      name: mockNames[i],
      elo: Math.floor(Math.random() * (2000 - 1000) + 1000),
      ready: Math.random() > 0.5,
      inGame: i < 4, // Ensure even number of in-game players
    }));
    const allPlayers = [
      { id: 'player-1', name: userName, elo: userElo, ready: false, inGame: false },
      ...simulatedPlayers,
    ];
    setLobbyPlayers(allPlayers);
  }, [userElo, userName]);

  const handleReadyToggle = () => {
    setIsReady(!isReady);
    setLobbyPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === 'player-1' ? { ...player, ready: !isReady } : player
      )
    );
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setChatMessages([...chatMessages, `You: ${messageInput}`]);
      setMessageInput('');
    }
  };

  const handleOfferMatch = (playerId: string) => {
    setMatchOffer(playerId);
    // In a real application, you would send this offer to the server
    setChatMessages([...chatMessages, `System: You offered a match to ${lobbyPlayers.find(p => p.id === playerId)?.name}`]);
    
    // Simulate opponent accepting the match offer
    setTimeout(() => {
      const opponent = lobbyPlayers.find(p => p.id === playerId);
      if (opponent) {
        setChatMessages([...chatMessages, `System: ${opponent.name} accepted your match offer!`]);
        onMatchStart(opponent);
      }
    }, 2000);
  };

  const sortedAvailablePlayers = lobbyPlayers
    .filter((player) => !player.inGame && player.id !== 'player-1')
    .sort((a, b) => Math.abs(a.elo - userElo) - Math.abs(b.elo - userElo));

  const inGamePlayers = lobbyPlayers.filter((player) => player.inGame);

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Game Lobby - ${wager} Wager</h2>
        <button onClick={onExit} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      
      {/* User banner */}
      <div className="bg-yellow-100 p-4 rounded-lg mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{userName}</h3>
          <p className="text-gray-600">ELO: {userElo}</p>
        </div>
        <button
          onClick={handleReadyToggle}
          className={`py-2 px-4 rounded flex items-center ${
            isReady ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
          } transition-colors duration-300`}
        >
          {isReady && <Check size={20} className="mr-2" />}
          Ready
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Available Players</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sortedAvailablePlayers.map((player) => (
              <div key={player.id} className="flex items-center justify-between bg-white p-2 rounded shadow">
                <div>
                  <span className="font-semibold text-gray-800">{player.name}</span>
                  <span className="ml-2 text-sm text-gray-600">ELO: {player.elo}</span>
                </div>
                <button
                  onClick={() => handleOfferMatch(player.id)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-300"
                >
                  <UserPlus size={16} />
                </button>
              </div>
            ))}
          </div>
          <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">In-Game Players</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {inGamePlayers.map((player, index) => (
              index % 2 === 0 && (
                <div key={player.id} className="bg-white p-2 rounded shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{player.name}</span>
                    <span className="text-sm text-gray-600">ELO: {player.elo}</span>
                  </div>
                  {inGamePlayers[index + 1] && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-800">{inGamePlayers[index + 1].name}</span>
                      <span className="text-sm text-gray-600">ELO: {inGamePlayers[index + 1].elo}</span>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Lobby Chat</h3>
          <div className="bg-white p-4 rounded shadow h-96 overflow-y-auto mb-4">
            {chatMessages.map((message, index) => (
              <p key={index} className="mb-2 text-gray-800">{message}</p>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-grow border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-yellow-500 text-white px-4 py-2 rounded-r hover:bg-yellow-600 transition-colors duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
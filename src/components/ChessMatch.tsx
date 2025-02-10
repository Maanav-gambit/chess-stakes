import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Crown, ArrowLeft, Clock, MessageSquare, Flag, Undo, RotateCcw, Smile, ThumbsUp, ThumbsDown, Frown } from 'lucide-react';

interface Player {
  name: string;
  elo: number;
}

interface ChessMatchProps {
  player1: Player;
  player2: Player;
  wager: number;
  onExitMatch: () => void;
}

const ChessMatch: React.FC<ChessMatchProps> = ({ player1, player2, wager, onExitMatch }) => {
  const [game, setGame] = useState(new Chess());
  const [timeLeft1, setTimeLeft1] = useState(600); // 10 minutes in seconds
  const [timeLeft2, setTimeLeft2] = useState(600);
  const [isClockRunning, setIsClockRunning] = useState(true);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [showChatInput, setShowChatInput] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isClockRunning) {
        if (game.turn() === 'w') {
          setTimeLeft1((prev) => Math.max(0, prev - 1));
        } else {
          setTimeLeft2((prev) => Math.max(0, prev - 1));
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [game, isClockRunning]);

  const makeAMove = (move: any) => {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    if (result) {
      setGame(gameCopy);
      setMoveHistory((prev) => [...prev, result.san]);
    }
    return result;
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move === null) return false;
    return true;
  };

  const handleResign = () => {
    // Implement resignation logic
    alert('You resigned. Your opponent wins.');
    onExitMatch();
  };

  const handleOfferDraw = () => {
    // Implement draw offer logic
    alert('Draw offered to opponent.');
  };

  const handleUndoRequest = () => {
    // Implement undo request logic
    alert('Undo request sent to opponent.');
  };

  const handleSendEmoticon = (emoticon: string) => {
    // Implement emoticon sending logic
    console.log(`Sent emoticon: ${emoticon}`);
  };

  const handleSendChat = () => {
    if (chatMessage.trim()) {
      // Implement chat sending logic
      console.log(`Sent chat message: ${chatMessage}`);
      setChatMessage('');
      setShowChatInput(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-800 text-white p-4">
          <button
            onClick={onExitMatch}
            className="flex items-center hover:text-yellow-400 transition-colors duration-300"
          >
            <ArrowLeft size={24} className="mr-2" />
            Exit Match
          </button>
          <div className="text-2xl font-bold flex items-center">
            <Crown size={32} className="mr-2 text-yellow-400" />
            Wager: ${wager}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <PlayerBanner 
                player={player2} 
                timeLeft={timeLeft2} 
                isCurrentTurn={game.turn() === 'b'}
                onSendEmoticon={handleSendEmoticon}
                onToggleChat={() => setShowChatInput(!showChatInput)}
              />
            </div>
            <div className="w-full max-w-2xl mx-auto">
              <Chessboard position={game.fen()} onPieceDrop={onDrop} />
            </div>
            <div className="mt-4">
              <PlayerBanner 
                player={player1} 
                timeLeft={timeLeft1} 
                isCurrentTurn={game.turn() === 'w'}
                onSendEmoticon={handleSendEmoticon}
                onToggleChat={() => setShowChatInput(!showChatInput)}
              />
            </div>
            {showChatInput && (
              <div className="mt-4 flex">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-grow border rounded-l px-2 py-1"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendChat}
                  className="bg-yellow-500 text-white px-4 py-1 rounded-r hover:bg-yellow-600 transition-colors duration-300"
                >
                  Send
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Move History</h3>
              <div className="h-48 overflow-y-auto">
                {moveHistory.map((move, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{Math.floor(index / 2) + 1}.</span>
                    <span>{move}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button onClick={handleResign} className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300">
                <Flag size={20} className="inline mr-2" />
                Resign
              </button>
              <button onClick={handleOfferDraw} className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-300">
                <RotateCcw size={20} className="inline mr-2" />
                Offer Draw
              </button>
            </div>

            <button onClick={handleUndoRequest} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">
              <Undo size={20} className="inline mr-2" />
              Request Undo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayerBanner: React.FC<{ 
  player: Player; 
  timeLeft: number; 
  isCurrentTurn: boolean;
  onSendEmoticon: (emoticon: string) => void;
  onToggleChat: () => void;
}> = ({ player, timeLeft, isCurrentTurn, onSendEmoticon, onToggleChat }) => (
  <div className={`flex justify-between items-center p-4 rounded-lg ${isCurrentTurn ? 'bg-yellow-100' : 'bg-gray-100'}`}>
    <div>
      <h3 className="text-xl font-semibold text-gray-800">{player.name}</h3>
      <p className="text-gray-600">ELO: {player.elo}</p>
    </div>
    <div className="flex items-center space-x-2">
      <button onClick={() => onSendEmoticon('smile')} className="text-gray-600 hover:text-yellow-500">
        <Smile size={20} />
      </button>
      <button onClick={() => onSendEmoticon('thumbsUp')} className="text-gray-600 hover:text-yellow-500">
        <ThumbsUp size={20} />
      </button>
      <button onClick={() => onSendEmoticon('thumbsDown')} className="text-gray-600 hover:text-yellow-500">
        <ThumbsDown size={20} />
      </button>
      <button onClick={() => onSendEmoticon('frown')} className="text-gray-600 hover:text-yellow-500">
        <Frown size={20} />
      </button>
      <button onClick={onToggleChat} className="text-gray-600 hover:text-yellow-500">
        <MessageSquare size={20} />
      </button>
    </div>
    <div className={`text-2xl font-bold flex items-center ${timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}`}>
      <Clock size={24} className="mr-2" />
      {formatTime(timeLeft)}
    </div>
  </div>
);

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default ChessMatch;
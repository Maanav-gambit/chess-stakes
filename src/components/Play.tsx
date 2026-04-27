import React, { useState, useEffect } from 'react';
import { Users, Award, Crown, AlertCircle } from 'lucide-react';
import GameLobby from './GameLobby';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/database.types';

const wagerAmounts = [1, 5, 10, 25, 50, 100];

interface PlayProps {
  startMatch: (player1: Profile, player2: Profile, wager: number, matchId: string, userColor: 'white' | 'black') => void;
}

const Play: React.FC<PlayProps> = ({ startMatch }) => {
  const { profile } = useAuth();
  const [selectedWager, setSelectedWager] = useState<number | null>(null);
  const [joinedLobby, setJoinedLobby] = useState<number | null>(null);
  const [lobbycounts, setLobbyCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchLobbyCounts();
    const interval = setInterval(fetchLobbyCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchLobbyCounts = async () => {
    const { data } = await supabase
      .from('lobby_presence')
      .select('wager_amount');
    if (!data) return;
    const counts: Record<number, number> = {};
    data.forEach(row => {
      const w = Number(row.wager_amount);
      counts[w] = (counts[w] ?? 0) + 1;
    });
    setLobbyCounts(counts);
  };

  const handleMatchStart = (opponent: Profile, matchId: string, userColor: 'white' | 'black') => {
    if (joinedLobby !== null && profile) {
      startMatch(profile, opponent, joinedLobby, matchId, userColor);
    }
  };

  if (joinedLobby !== null) {
    return (
      <GameLobby
        wager={joinedLobby}
        onExit={() => setJoinedLobby(null)}
        onMatchStart={handleMatchStart}
      />
    );
  }

  if (!profile) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-[60vh] rounded-xl p-8 flex items-center justify-center">
        <div className="text-center">
          <Crown size={48} className="text-yellow-400 mx-auto mb-4" />
          <p className="text-white text-xl font-semibold mb-2">Sign in to play</p>
          <p className="text-gray-400">Create an account to start wagering on chess games</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-[#111827] rounded-xl p-8 border border-gray-800">
          <h1 className="text-3xl font-bold text-white mb-2">Play Chess</h1>
          <p className="text-gray-400">Choose a wager amount and find an opponent</p>
        </div>

        {Number(profile.wallet_balance) === 0 && (
          <div className="flex items-center space-x-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl px-5 py-4">
            <AlertCircle size={20} />
            <p className="text-sm">Your wallet is empty. Add funds to start wagering.</p>
          </div>
        )}

        <div className="bg-[#0f172a] rounded-xl p-8 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-5">Select Wager Amount</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {wagerAmounts.map((amount) => {
              const count = lobbycounts[amount] ?? 0;
              const canAfford = Number(profile.wallet_balance) >= amount;
              return (
                <button
                  key={amount}
                  disabled={!canAfford}
                  onClick={() => {
                    setSelectedWager(amount);
                    setJoinedLobby(amount);
                  }}
                  className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                    !canAfford
                      ? 'border-gray-700 bg-gray-800/30 opacity-40 cursor-not-allowed'
                      : selectedWager === amount
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-gray-700 bg-gray-800 hover:border-yellow-500/60 hover:bg-gray-700'
                  }`}
                >
                  <p className="text-3xl font-extrabold text-yellow-400 mb-1">${amount}</p>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <Users size={14} />
                    <span>{count} in lobby</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <Award size={14} />
                    <span>Win ${amount * 2 - Math.round(amount * 0.05)}</span>
                  </div>
                  {!canAfford && (
                    <span className="absolute top-2 right-2 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                      Insufficient
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[#111827] rounded-xl p-6 border border-gray-800 text-sm text-gray-400 space-y-2">
          <p className="text-white font-semibold mb-3">How it works</p>
          <p>1. Select a wager amount and join the lobby</p>
          <p>2. Challenge another player — both wagers are held during the match</p>
          <p>3. Win to collect both wagers (minus a small platform fee)</p>
          <p>4. ELO rating is updated after every match</p>
        </div>
      </div>
    </div>
  );
};

export default Play;

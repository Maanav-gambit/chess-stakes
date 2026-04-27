import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Award, UserPlus, Check, Users, Swords, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/database.types';

interface GameLobbyProps {
  wager: number;
  onExit: () => void;
  onMatchStart: (opponent: Profile, matchId: string, userColor: 'white' | 'black') => void;
}

interface ChatMessage {
  sender: string;
  text: string;
  type: 'user' | 'system';
}

const GameLobby: React.FC<GameLobbyProps> = ({ wager, onExit, onMatchStart }) => {
  const { profile, user } = useAuth();
  const [lobbyPlayers, setLobbyPlayers] = useState<Profile[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [presenceId, setPresenceId] = useState<string | null>(null);
  const [pendingOpponent, setPendingOpponent] = useState<string | null>(null);
  const [error, setError] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const addSystemMsg = (text: string) =>
    setChatMessages(prev => [...prev, { sender: 'System', text, type: 'system' }]);

  useEffect(() => {
    if (!user || !profile) return;

    joinLobby();

    return () => {
      leaveLobby();
    };
  }, [user]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages]);

  const joinLobby = async () => {
    if (!user || !profile) return;

    // Remove any stale presence for this user
    await supabase.from('lobby_presence').delete().eq('user_id', user.id);

    const { data } = await supabase.from('lobby_presence').insert({
      user_id: user.id,
      wager_amount: wager,
      is_ready: false,
    }).select().maybeSingle();

    if (data) setPresenceId(data.id);

    fetchLobbyPlayers();
    setupRealtimeSubscription();
    addSystemMsg(`You joined the $${wager} lobby.`);
  };

  const leaveLobby = async () => {
    channelRef.current?.unsubscribe();
    if (user) await supabase.from('lobby_presence').delete().eq('user_id', user.id);
  };

  const fetchLobbyPlayers = async () => {
    const { data: presenceList } = await supabase
      .from('lobby_presence')
      .select('user_id')
      .eq('wager_amount', wager)
      .neq('user_id', user?.id ?? '');

    if (!presenceList || presenceList.length === 0) { setLobbyPlayers([]); return; }

    const ids = presenceList.map(p => p.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', ids);

    setLobbyPlayers(profiles ?? []);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`lobby-${wager}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lobby_presence' }, () => {
        fetchLobbyPlayers();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'matches',
        filter: `white_player_id=eq.${user?.id}`,
      }, (payload) => {
        handleMatchCreated(payload.new as { id: string; black_player_id: string });
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'matches',
        filter: `black_player_id=eq.${user?.id}`,
      }, (payload) => {
        handleMatchCreated(payload.new as { id: string; white_player_id: string });
      })
      .subscribe();

    channelRef.current = channel;
  };

  const handleMatchCreated = async (matchRow: { id: string; white_player_id?: string; black_player_id?: string }) => {
    const opponentId = matchRow.white_player_id === user?.id ? matchRow.black_player_id : matchRow.white_player_id;
    if (!opponentId) return;

    const { data: opponent } = await supabase.from('profiles').select('*').eq('id', opponentId).maybeSingle();
    if (!opponent) return;

    const userColor: 'white' | 'black' = matchRow.white_player_id === user?.id ? 'white' : 'black';
    addSystemMsg(`Match found vs ${opponent.username}! Starting...`);
    setTimeout(() => {
      leaveLobby();
      onMatchStart(opponent, matchRow.id, userColor);
    }, 1000);
  };

  const handleReadyToggle = async () => {
    if (!presenceId) return;
    const newReady = !isReady;
    setIsReady(newReady);
    await supabase.from('lobby_presence').update({ is_ready: newReady }).eq('id', presenceId);
    addSystemMsg(newReady ? 'You are now ready.' : 'You marked yourself as not ready.');
  };

  const handleOfferMatch = async (opponent: Profile) => {
    if (!user || !profile) { setError('Please sign in to challenge players.'); return; }
    if (Number(profile.wallet_balance) < wager) {
      setError(`Insufficient balance. You need $${wager} to play.`);
      return;
    }
    setError('');
    setPendingOpponent(opponent.id);
    addSystemMsg(`Challenge sent to ${opponent.username}. Awaiting response...`);

    // Create a match record — in a real app both players must accept.
    // For this demo: creating the match immediately starts the game.
    const whiteIsMe = Math.random() > 0.5;
    const { data: match, error: matchErr } = await supabase.from('matches').insert({
      white_player_id: whiteIsMe ? user.id : opponent.id,
      black_player_id: whiteIsMe ? opponent.id : user.id,
      wager_amount: wager,
      status: 'in_progress',
    }).select().maybeSingle();

    if (matchErr || !match) {
      setError('Failed to create match. Please try again.');
      setPendingOpponent(null);
      return;
    }

    const userColor: 'white' | 'black' = whiteIsMe ? 'white' : 'black';
    addSystemMsg(`Match created! You play as ${userColor}.`);
    setTimeout(() => {
      leaveLobby();
      onMatchStart(opponent, match.id, userColor);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !profile) return;
    setChatMessages(prev => [...prev, { sender: profile.username, text: messageInput.trim(), type: 'user' }]);
    setMessageInput('');
  };

  const sortedPlayers = [...lobbyPlayers].sort(
    (a, b) => Math.abs(a.elo_rating - (profile?.elo_rating ?? 1200)) - Math.abs(b.elo_rating - (profile?.elo_rating ?? 1200))
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Swords size={28} className="text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">${wager} Wager Lobby</h2>
          <span className="bg-green-500/20 text-green-400 text-sm px-3 py-1 rounded-full border border-green-500/30">
            {lobbyPlayers.length + 1} online
          </span>
        </div>
        <button onClick={onExit} className="text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center space-x-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg px-4 py-3 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Your banner */}
      <div className={`p-4 rounded-xl mb-6 flex justify-between items-center border ${isReady ? 'bg-green-900/30 border-green-500/40' : 'bg-gray-800 border-gray-700'}`}>
        <div>
          <p className="text-white font-bold text-lg">{profile?.username ?? 'You'}</p>
          <p className="text-gray-400 text-sm">ELO: {profile?.elo_rating ?? 1200}</p>
          <p className="text-gray-400 text-sm">Balance: ${Number(profile?.wallet_balance ?? 0).toFixed(2)}</p>
        </div>
        <button
          onClick={handleReadyToggle}
          className={`py-2 px-6 rounded-lg flex items-center space-x-2 font-semibold transition-all duration-300 ${
            isReady
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {isReady && <Check size={18} />}
          <span>{isReady ? 'Ready' : 'Not Ready'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <Users size={18} className="text-yellow-400" />
              <span>Available ({sortedPlayers.length})</span>
            </h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {sortedPlayers.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">No other players in this lobby yet.</p>
              ) : sortedPlayers.map((p) => (
                <div key={p.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div>
                    <p className="text-white font-medium text-sm">{p.username}</p>
                    <p className="text-gray-400 text-xs">ELO: {p.elo_rating}</p>
                  </div>
                  <button
                    onClick={() => handleOfferMatch(p)}
                    disabled={pendingOpponent === p.id}
                    className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-gray-900 rounded-lg text-sm font-semibold flex items-center space-x-1 transition-colors"
                  >
                    <UserPlus size={14} />
                    <span>Challenge</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h4 className="text-gray-300 text-sm font-semibold mb-2">Match Requirements</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Wager</span>
                <span className="text-yellow-400 font-bold">${wager}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your balance</span>
                <span className={Number(profile?.wallet_balance ?? 0) >= wager ? 'text-green-400' : 'text-red-400'}>
                  ${Number(profile?.wallet_balance ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time control</span>
                <span className="text-white">10 min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col">
          <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
            <MessageSquare size={18} className="text-yellow-400" />
            <span>Lobby Chat</span>
          </h3>
          <div
            ref={chatRef}
            className="flex-1 bg-gray-800 rounded-xl p-4 h-80 overflow-y-auto mb-3 border border-gray-700 space-y-2"
          >
            {chatMessages.map((msg, i) => (
              <div key={i} className={msg.type === 'system' ? 'text-center' : ''}>
                {msg.type === 'system' ? (
                  <span className="text-yellow-400/80 text-xs bg-yellow-400/10 px-3 py-1 rounded-full">{msg.text}</span>
                ) : (
                  <p className="text-sm">
                    <span className="text-yellow-400 font-semibold">{msg.sender}: </span>
                    <span className="text-gray-200">{msg.text}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-500 transition-colors text-sm"
              placeholder="Say something..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2.5 rounded-lg font-semibold transition-colors text-sm"
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

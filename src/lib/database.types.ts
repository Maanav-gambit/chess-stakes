export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string;
          country: string;
          elo_rating: number;
          wallet_balance: number;
          total_games: number;
          wins: number;
          losses: number;
          draws: number;
          total_wagered: number;
          total_won: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string;
          country?: string;
          elo_rating?: number;
          wallet_balance?: number;
          total_games?: number;
          wins?: number;
          losses?: number;
          draws?: number;
          total_wagered?: number;
          total_won?: number;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      matches: {
        Row: {
          id: string;
          white_player_id: string;
          black_player_id: string;
          wager_amount: number;
          status: 'pending' | 'in_progress' | 'completed' | 'aborted';
          result: 'white_wins' | 'black_wins' | 'draw' | null;
          end_reason: string | null;
          current_fen: string;
          pgn: string;
          white_time_remaining: number;
          black_time_remaining: number;
          white_elo_before: number | null;
          black_elo_before: number | null;
          white_elo_change: number | null;
          black_elo_change: number | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['matches']['Row']> & {
          white_player_id: string;
          black_player_id: string;
          wager_amount: number;
        };
        Update: Partial<Database['public']['Tables']['matches']['Row']>;
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'deposit' | 'withdrawal' | 'wager_placed' | 'wager_won' | 'wager_refund';
          amount: number;
          balance_before: number;
          balance_after: number;
          match_id: string | null;
          description: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      game_history: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          opponent_id: string;
          user_color: 'white' | 'black';
          result: 'win' | 'loss' | 'draw';
          wager_amount: number;
          net_change: number;
          elo_change: number;
          end_reason: string | null;
          played_at: string;
        };
        Insert: Omit<Database['public']['Tables']['game_history']['Row'], 'id'>;
        Update: never;
      };
      lobby_presence: {
        Row: {
          id: string;
          user_id: string;
          wager_amount: number;
          is_ready: boolean;
          last_seen: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          wager_amount: number;
          is_ready?: boolean;
        };
        Update: { is_ready?: boolean; last_seen?: string };
      };
      daily_tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          reward_type: 'xp' | 'bonus' | 'badge';
          reward_value: number;
          task_type: 'play_game' | 'win_game' | 'solve_puzzle' | 'login' | 'deposit';
          required_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: never;
        Update: never;
      };
      user_daily_tasks: {
        Row: {
          id: string;
          user_id: string;
          task_id: string;
          progress: number;
          completed: boolean;
          completed_at: string | null;
          task_date: string;
        };
        Insert: {
          user_id: string;
          task_id: string;
          progress?: number;
          completed?: boolean;
          task_date?: string;
        };
        Update: { progress?: number; completed?: boolean; completed_at?: string | null };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Match = Database['public']['Tables']['matches']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type GameHistory = Database['public']['Tables']['game_history']['Row'];
export type LobbyPresence = Database['public']['Tables']['lobby_presence']['Row'];
export type DailyTask = Database['public']['Tables']['daily_tasks']['Row'];
export type UserDailyTask = Database['public']['Tables']['user_daily_tasks']['Row'];

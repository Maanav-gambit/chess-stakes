/*
  # Core Schema: Chess Wager Platform

  ## Summary
  Creates the foundational database schema for the Chessbet.org platform.

  ## Tables

  1. **profiles** – Extends Supabase auth.users with chess-specific data
     - username, elo_rating, wallet_balance, avatar_url, country
     - win/loss/draw stats

  2. **matches** – Records of wager games
     - Two players, wager amount, game state (FEN + PGN), result, status

  3. **transactions** – Financial audit log
     - Deposits, withdrawals, wager wins/losses

  4. **game_history** – Denormalized per-user match summary
     - Quick lookup for each user's match record

  5. **daily_tasks** – Task definitions
  6. **user_daily_tasks** – Per-user task completion tracking
  7. **achievements** – Achievement definitions
  8. **user_achievements** – Per-user achievement progress

  ## Security
  - RLS enabled on all tables
  - Users can only read/write their own data
  - Match data readable by both participants
*/

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text DEFAULT '',
  country text DEFAULT 'US',
  elo_rating integer NOT NULL DEFAULT 1200,
  wallet_balance numeric(12, 2) NOT NULL DEFAULT 0,
  total_games integer NOT NULL DEFAULT 0,
  wins integer NOT NULL DEFAULT 0,
  losses integer NOT NULL DEFAULT 0,
  draws integer NOT NULL DEFAULT 0,
  total_wagered numeric(12, 2) NOT NULL DEFAULT 0,
  total_won numeric(12, 2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view any profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- MATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  white_player_id uuid NOT NULL REFERENCES profiles(id),
  black_player_id uuid NOT NULL REFERENCES profiles(id),
  wager_amount numeric(10, 2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'aborted')),
  result text DEFAULT NULL
    CHECK (result IN ('white_wins', 'black_wins', 'draw', NULL)),
  end_reason text DEFAULT NULL
    CHECK (end_reason IN ('checkmate', 'resignation', 'timeout', 'draw_agreement', 'stalemate', 'insufficient_material', NULL)),
  current_fen text NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  pgn text NOT NULL DEFAULT '',
  white_time_remaining integer NOT NULL DEFAULT 600,
  black_time_remaining integer NOT NULL DEFAULT 600,
  white_elo_before integer DEFAULT NULL,
  black_elo_before integer DEFAULT NULL,
  white_elo_change integer DEFAULT NULL,
  black_elo_change integer DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz DEFAULT NULL
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match participants can view their matches"
  ON matches FOR SELECT
  TO authenticated
  USING (auth.uid() = white_player_id OR auth.uid() = black_player_id);

CREATE POLICY "Authenticated users can create matches"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = white_player_id OR auth.uid() = black_player_id);

CREATE POLICY "Match participants can update their matches"
  ON matches FOR UPDATE
  TO authenticated
  USING (auth.uid() = white_player_id OR auth.uid() = black_player_id)
  WITH CHECK (auth.uid() = white_player_id OR auth.uid() = black_player_id);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  type text NOT NULL
    CHECK (type IN ('deposit', 'withdrawal', 'wager_placed', 'wager_won', 'wager_refund')),
  amount numeric(12, 2) NOT NULL,
  balance_before numeric(12, 2) NOT NULL,
  balance_after numeric(12, 2) NOT NULL,
  match_id uuid REFERENCES matches(id) DEFAULT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- GAME HISTORY (denormalized per-user summary)
-- ============================================================
CREATE TABLE IF NOT EXISTS game_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  match_id uuid NOT NULL REFERENCES matches(id),
  opponent_id uuid NOT NULL REFERENCES profiles(id),
  user_color text NOT NULL CHECK (user_color IN ('white', 'black')),
  result text NOT NULL CHECK (result IN ('win', 'loss', 'draw')),
  wager_amount numeric(10, 2) NOT NULL DEFAULT 0,
  net_change numeric(10, 2) NOT NULL DEFAULT 0,
  elo_change integer NOT NULL DEFAULT 0,
  end_reason text DEFAULT NULL,
  played_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game history"
  ON game_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game history"
  ON game_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- LOBBY PRESENCE (ephemeral, for matchmaking)
-- ============================================================
CREATE TABLE IF NOT EXISTS lobby_presence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  wager_amount numeric(10, 2) NOT NULL,
  is_ready boolean NOT NULL DEFAULT false,
  last_seen timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE lobby_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view lobby presence"
  ON lobby_presence FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own lobby presence"
  ON lobby_presence FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lobby presence"
  ON lobby_presence FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lobby presence"
  ON lobby_presence FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- DAILY TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  reward_type text NOT NULL DEFAULT 'xp' CHECK (reward_type IN ('xp', 'bonus', 'badge')),
  reward_value numeric(10, 2) NOT NULL DEFAULT 0,
  task_type text NOT NULL CHECK (task_type IN ('play_game', 'win_game', 'solve_puzzle', 'login', 'deposit')),
  required_count integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active daily tasks"
  ON daily_tasks FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE TABLE IF NOT EXISTS user_daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  task_id uuid NOT NULL REFERENCES daily_tasks(id),
  progress integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz DEFAULT NULL,
  task_date date NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE (user_id, task_id, task_date)
);

ALTER TABLE user_daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily task progress"
  ON user_daily_tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily task progress"
  ON user_daily_tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily task progress"
  ON user_daily_tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SEED DAILY TASKS
-- ============================================================
INSERT INTO daily_tasks (title, description, reward_type, reward_value, task_type, required_count)
VALUES
  ('First Move', 'Play 1 game today', 'xp', 50, 'play_game', 1),
  ('On a Roll', 'Win 2 games today', 'xp', 100, 'win_game', 2),
  ('Puzzle Solver', 'Solve 3 puzzles', 'xp', 75, 'solve_puzzle', 3),
  ('Daily Login', 'Log in today', 'xp', 25, 'login', 1),
  ('High Roller', 'Play 5 games today', 'xp', 150, 'play_game', 5)
ON CONFLICT DO NOTHING;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_matches_white_player ON matches(white_player_id);
CREATE INDEX IF NOT EXISTS idx_matches_black_player ON matches(black_player_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_history_user ON game_history(user_id);
CREATE INDEX IF NOT EXISTS idx_lobby_presence_wager ON lobby_presence(wager_amount);
CREATE INDEX IF NOT EXISTS idx_user_daily_tasks_user_date ON user_daily_tasks(user_id, task_date);

-- ============================================================
-- TRIGGER: auto-update profiles.updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

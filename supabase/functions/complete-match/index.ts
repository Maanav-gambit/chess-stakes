import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function calcElo(winnerElo: number, loserElo: number, isDraw: boolean): [number, number] {
  const K = 32;
  const expectedWin = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedLoss = 1 - expectedWin;
  const winnerScore = isDraw ? 0.5 : 1;
  const loserScore = isDraw ? 0.5 : 0;
  const winnerChange = Math.round(K * (winnerScore - expectedWin));
  const loserChange = Math.round(K * (loserScore - expectedLoss));
  return [winnerChange, loserChange];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { matchId, result, endReason } = await req.json() as {
      matchId: string;
      result: "white_wins" | "black_wins" | "draw";
      endReason: string;
    };

    if (!matchId || !result || !endReason) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch match
    const { data: match, error: matchErr } = await supabase
      .from("matches")
      .select("*")
      .eq("id", matchId)
      .maybeSingle();

    if (matchErr || !match) {
      return new Response(JSON.stringify({ error: "Match not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (match.status === "completed") {
      return new Response(JSON.stringify({ error: "Match already completed" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch both players
    const { data: whitePro } = await supabase.from("profiles").select("*").eq("id", match.white_player_id).maybeSingle();
    const { data: blackPro } = await supabase.from("profiles").select("*").eq("id", match.black_player_id).maybeSingle();

    if (!whitePro || !blackPro) {
      return new Response(JSON.stringify({ error: "Players not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isDraw = result === "draw";
    const whiteWins = result === "white_wins";

    const winnerId = isDraw ? null : (whiteWins ? whitePro.id : blackPro.id);
    const loserId = isDraw ? null : (whiteWins ? blackPro.id : whitePro.id);
    const winnerElo = isDraw ? whitePro.elo_rating : (whiteWins ? whitePro.elo_rating : blackPro.elo_rating);
    const loserElo = isDraw ? blackPro.elo_rating : (whiteWins ? blackPro.elo_rating : whitePro.elo_rating);

    const [winnerEloChange, loserEloChange] = calcElo(winnerElo, loserElo, isDraw);

    const whiteEloChange = isDraw ? winnerEloChange : (whiteWins ? winnerEloChange : loserEloChange);
    const blackEloChange = isDraw ? loserEloChange : (whiteWins ? loserEloChange : winnerEloChange);

    const wager = Number(match.wager_amount);

    // Update match record
    await supabase.from("matches").update({
      status: "completed",
      result,
      end_reason: endReason,
      white_elo_before: whitePro.elo_rating,
      black_elo_before: blackPro.elo_rating,
      white_elo_change: whiteEloChange,
      black_elo_change: blackEloChange,
      completed_at: new Date().toISOString(),
    }).eq("id", matchId);

    // Update white player stats + wallet + ELO
    const whiteNetChange = isDraw ? 0 : (whiteWins ? wager : -wager);
    const whiteNewBalance = Math.max(0, Number(whitePro.wallet_balance) + whiteNetChange);
    await supabase.from("profiles").update({
      elo_rating: Math.max(100, whitePro.elo_rating + whiteEloChange),
      wallet_balance: whiteNewBalance,
      total_games: whitePro.total_games + 1,
      wins: whitePro.wins + (whiteWins ? 1 : 0),
      losses: whitePro.losses + (!isDraw && !whiteWins ? 1 : 0),
      draws: whitePro.draws + (isDraw ? 1 : 0),
      total_wagered: Number(whitePro.total_wagered) + wager,
      total_won: Number(whitePro.total_won) + (whiteWins ? wager * 2 : 0),
    }).eq("id", whitePro.id);

    // Update black player stats + wallet + ELO
    const blackNetChange = isDraw ? 0 : (whiteWins ? -wager : wager);
    const blackNewBalance = Math.max(0, Number(blackPro.wallet_balance) + blackNetChange);
    await supabase.from("profiles").update({
      elo_rating: Math.max(100, blackPro.elo_rating + blackEloChange),
      wallet_balance: blackNewBalance,
      total_games: blackPro.total_games + 1,
      wins: blackPro.wins + (whiteWins ? 0 : isDraw ? 0 : 1),
      losses: blackPro.losses + (!isDraw && whiteWins ? 1 : 0),
      draws: blackPro.draws + (isDraw ? 1 : 0),
      total_wagered: Number(blackPro.total_wagered) + wager,
      total_won: Number(blackPro.total_won) + (!whiteWins && !isDraw ? wager * 2 : 0),
    }).eq("id", blackPro.id);

    // Write transactions
    if (!isDraw && winnerId && loserId) {
      await supabase.from("transactions").insert([
        {
          user_id: winnerId,
          type: "wager_won",
          amount: wager * 2,
          balance_before: whiteWins ? Number(whitePro.wallet_balance) : Number(blackPro.wallet_balance),
          balance_after: whiteWins ? whiteNewBalance : blackNewBalance,
          match_id: matchId,
          description: "Wager winnings",
        },
        {
          user_id: loserId,
          type: "wager_placed",
          amount: wager,
          balance_before: whiteWins ? Number(blackPro.wallet_balance) : Number(whitePro.wallet_balance),
          balance_after: whiteWins ? blackNewBalance : whiteNewBalance,
          match_id: matchId,
          description: "Wager lost",
        },
      ]);
    }

    // Write game history for both players
    const whiteResult: "win" | "loss" | "draw" = isDraw ? "draw" : (whiteWins ? "win" : "loss");
    const blackResult: "win" | "loss" | "draw" = isDraw ? "draw" : (whiteWins ? "loss" : "win");
    await supabase.from("game_history").insert([
      {
        user_id: whitePro.id,
        match_id: matchId,
        opponent_id: blackPro.id,
        user_color: "white",
        result: whiteResult,
        wager_amount: wager,
        net_change: whiteNetChange,
        elo_change: whiteEloChange,
        end_reason: endReason,
        played_at: new Date().toISOString(),
      },
      {
        user_id: blackPro.id,
        match_id: matchId,
        opponent_id: whitePro.id,
        user_color: "black",
        result: blackResult,
        wager_amount: wager,
        net_change: blackNetChange,
        elo_change: blackEloChange,
        end_reason: endReason,
        played_at: new Date().toISOString(),
      },
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        whiteEloChange,
        blackEloChange,
        whiteNetChange,
        blackNetChange,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Clock, TrendingUp, TrendingDown, AlertCircle, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Transaction } from '../lib/database.types';

const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500];

const Wallet: React.FC = () => {
  const { profile, refreshProfile, user } = useAuth();
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    setTransactions(data ?? []);
  };

  const handleDeposit = async () => {
    if (!profile || !user) { setError('Please sign in to deposit funds.'); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Enter a valid amount.'); return; }
    if (amt > 10000) { setError('Maximum single deposit is $10,000.'); return; }

    setSubmitting(true); setError('');
    const balBefore = Number(profile.wallet_balance);
    const balAfter = balBefore + amt;

    const { error: txErr } = await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: amt,
      balance_before: balBefore,
      balance_after: balAfter,
      description: 'Manual deposit',
    });
    if (txErr) { setError(txErr.message); setSubmitting(false); return; }

    await supabase.from('profiles').update({ wallet_balance: balAfter }).eq('id', user.id);
    await refreshProfile();
    await fetchTransactions();
    setAmount('');
    setSuccessMsg(`$${amt.toFixed(2)} deposited successfully!`);
    setTimeout(() => setSuccessMsg(''), 3000);
    setSubmitting(false);
  };

  const handleWithdraw = async () => {
    if (!profile || !user) { setError('Please sign in to withdraw funds.'); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Enter a valid amount.'); return; }
    if (amt > Number(profile.wallet_balance)) { setError('Insufficient balance.'); return; }

    setSubmitting(true); setError('');
    const balBefore = Number(profile.wallet_balance);
    const balAfter = balBefore - amt;

    const { error: txErr } = await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'withdrawal',
      amount: amt,
      balance_before: balBefore,
      balance_after: balAfter,
      description: 'Manual withdrawal',
    });
    if (txErr) { setError(txErr.message); setSubmitting(false); return; }

    await supabase.from('profiles').update({ wallet_balance: balAfter }).eq('id', user.id);
    await refreshProfile();
    await fetchTransactions();
    setAmount('');
    setSuccessMsg(`$${amt.toFixed(2)} withdrawal processed.`);
    setTimeout(() => setSuccessMsg(''), 3000);
    setSubmitting(false);
  };

  const balance = Number(profile?.wallet_balance ?? 0);
  const totalDeposited = transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + Number(t.amount), 0);
  const totalWithdrawn = transactions.filter(t => t.type === 'withdrawal').reduce((s, t) => s + Number(t.amount), 0);

  const txIcon = (type: Transaction['type']) => {
    if (type === 'deposit' || type === 'wager_won' || type === 'wager_refund') return <TrendingUp size={16} className="text-green-400" />;
    return <TrendingDown size={16} className="text-red-400" />;
  };

  const txColor = (type: Transaction['type']) => {
    if (type === 'deposit' || type === 'wager_won' || type === 'wager_refund') return 'text-green-400';
    return 'text-red-400';
  };

  const txSign = (type: Transaction['type']) => (type === 'deposit' || type === 'wager_won' || type === 'wager_refund') ? '+' : '-';

  if (!profile) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-[60vh] rounded-xl p-8 flex items-center justify-center">
        <div className="text-center">
          <Crown size={48} className="text-yellow-400 mx-auto mb-4" />
          <p className="text-white text-xl font-semibold mb-2">Sign in to access your wallet</p>
          <p className="text-gray-400">Manage your funds and track transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-[#111827] rounded-xl p-8 border border-gray-800">
          <h1 className="text-3xl font-bold text-white mb-6">Wallet</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/30">
              <p className="text-gray-400 text-sm mb-1">Current Balance</p>
              <p className="text-4xl font-bold text-yellow-400">${balance.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">Total Deposited</p>
              <p className="text-3xl font-bold text-green-400">${totalDeposited.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">Total Withdrawn</p>
              <p className="text-3xl font-bold text-red-400">${totalWithdrawn.toFixed(2)}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center space-x-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg px-4 py-3 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 bg-green-500/20 border border-green-500/40 text-green-400 rounded-lg px-4 py-3 text-sm">
              {successMsg}
            </div>
          )}

          <div className="mb-4">
            <p className="text-gray-300 text-sm font-medium mb-2">Quick amounts</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_AMOUNTS.map(q => (
                <button
                  key={q}
                  onClick={() => setAmount(String(q))}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    amount === String(q)
                      ? 'bg-yellow-500 border-yellow-500 text-gray-900'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-yellow-500/60'
                  }`}
                >
                  ${q}
                </button>
              ))}
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                min="1"
                step="0.01"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg pl-9 pr-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="Custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDeposit}
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <ArrowUpCircle size={20} />
              <span>Deposit</span>
            </button>
            <button
              onClick={handleWithdraw}
              disabled={submitting || balance <= 0}
              className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <ArrowDownCircle size={20} />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        <div className="bg-[#111827] rounded-xl p-8 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Clock size={20} className="text-yellow-400" />
            <span>Transaction History</span>
          </h2>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No transactions yet.</p>
          ) : (
            <div className="space-y-2">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-3">
                    {txIcon(tx.type)}
                    <div>
                      <p className="text-white text-sm font-medium capitalize">{tx.type.replace(/_/g, ' ')}</p>
                      <p className="text-gray-400 text-xs">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${txColor(tx.type)}`}>
                      {txSign(tx.type)}${Number(tx.amount).toFixed(2)}
                    </p>
                    <p className="text-gray-400 text-xs">Bal: ${Number(tx.balance_after).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;

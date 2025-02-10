import React, { useState } from 'react';
import { DollarSign, CreditCard, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (depositAmount > 0) {
      setBalance(prevBalance => prevBalance + depositAmount);
      setTotalDeposit(prevTotal => prevTotal + depositAmount);
      setAmount('');
    }
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > 0 && withdrawAmount <= balance) {
      setBalance(prevBalance => prevBalance - withdrawAmount);
      setTotalWithdrawal(prevTotal => prevTotal + withdrawAmount);
      setAmount('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Wallet</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Current Balance</h3>
          <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
        </div>
        <div className="bg-green-500 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Deposit</h3>
          <p className="text-3xl font-bold">${totalDeposit.toFixed(2)}</p>
        </div>
        <div className="bg-red-500 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Withdrawal</h3>
          <p className="text-3xl font-bold">${totalWithdrawal.toFixed(2)}</p>
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="number"
            name="amount"
            id="amount"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleDeposit}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        >
          <ArrowUpCircle className="mr-2" size={20} />
          Deposit
        </button>
        <button
          onClick={handleWithdraw}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        >
          <ArrowDownCircle className="mr-2" size={20} />
          Withdraw
        </button>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
        <div className="bg-gray-100 p-4 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="text-gray-500 mr-2" size={24} />
            <span>Visa ending in 1234</span>
          </div>
          <button className="text-indigo-600 hover:text-indigo-800">Change</button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
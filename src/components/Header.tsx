import React, { useState, useRef, useEffect } from 'react';
import { Crown, LogIn, ChevronDown, History, Gift, CheckSquare, FileText, Shield, Settings, Info, LogOut, ArrowLeft, ArrowRight, Wallet, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
  openAuthModal: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
}

const Header: React.FC<HeaderProps> = ({
  setCurrentPage,
  openAuthModal,
  canGoBack,
  canGoForward,
  onNavigateBack,
  onNavigateForward
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profile, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { icon: History, title: 'Game History', page: 'gameHistory' },
    { icon: Gift, title: 'Deposit Offers', page: 'depositOffers' },
    { icon: CheckSquare, title: 'Daily Tasks', page: 'dailyTasks' },
    { icon: FileText, title: 'Certificates and Licenses', page: 'certificates' },
    { icon: Shield, title: 'Chessbet Fair Play', page: 'fairPlay' },
    { icon: Settings, title: 'Settings', page: 'settings' },
    { icon: Info, title: 'About', page: 'about' },
  ];

  const buttonClasses = "flex items-center space-x-2 bg-yellow-500 text-gray-900 px-4 py-2 rounded hover:bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-105 shadow-md";

  const handleLogout = async () => {
    await signOut();
    setIsDropdownOpen(false);
    setCurrentPage('main');
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={onNavigateBack}
            disabled={!canGoBack}
            className={`text-white ${canGoBack ? 'hover:text-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={onNavigateForward}
            disabled={!canGoForward}
            className={`text-white ${canGoForward ? 'hover:text-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
          >
            <ArrowRight size={24} />
          </button>
          <div className="flex items-center space-x-2 relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Crown size={32} className="text-yellow-500" />
              <h1 className="text-2xl font-bold">Chessbet.org</h1>
              <ChevronDown size={20} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50">
                {profile && (
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-white font-semibold">{profile.username}</p>
                    <p className="text-gray-400 text-sm">ELO: {profile.elo_rating}</p>
                  </div>
                )}
                {menuItems.map((item) => (
                  <button
                    key={item.page}
                    className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-gray-800 flex items-center space-x-3 transition-colors"
                    onClick={() => {
                      setCurrentPage(item.page);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <item.icon size={18} className="text-yellow-400" />
                    <span>{item.title}</span>
                  </button>
                ))}
                {profile && (
                  <button
                    className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-gray-800 flex items-center space-x-3 transition-colors border-t border-gray-700"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <nav className="flex items-center space-x-4">
          {profile && (
            <div className="flex items-center space-x-2 text-gray-300 mr-2">
              <User size={16} className="text-yellow-400" />
              <span className="text-sm font-medium">{profile.username}</span>
              <span className="text-yellow-400 text-sm font-bold">({profile.elo_rating})</span>
            </div>
          )}
          <button
            onClick={() => setCurrentPage('wallet')}
            className={buttonClasses}
          >
            <Wallet size={20} />
            <span>{profile ? `$${Number(profile.wallet_balance).toFixed(2)}` : 'Add Funds'}</span>
          </button>
          {profile ? null : (
            <button onClick={openAuthModal} className={buttonClasses}>
              <LogIn size={20} />
              <span>Sign In / Register</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
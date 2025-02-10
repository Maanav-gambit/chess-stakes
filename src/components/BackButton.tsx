import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
    >
      <ArrowLeft size={20} className="mr-1" />
      Back to Main Menu
    </button>
  );
};

export default BackButton;
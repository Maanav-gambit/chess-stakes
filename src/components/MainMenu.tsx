import React from 'react';
import { Sword, DollarSign, Users, Trophy, Lightbulb, Video } from 'lucide-react';

interface MainMenuProps {
  setCurrentPage: (page: string) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ setCurrentPage }) => {
  const menuItems = [
    { icon: Sword, title: 'Play', page: 'play', bgImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
    { icon: Users, title: 'Practice', page: 'practice', bgImage: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
    { icon: DollarSign, title: 'Tournaments', page: 'tournaments', bgImage: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
    { icon: Trophy, title: 'Leaderboards', page: 'leaderboards', bgImage: 'https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
    { icon: Lightbulb, title: 'Puzzles', page: 'puzzles', bgImage: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
    { icon: Video, title: 'Watch', page: 'watch', bgImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((item) => (
        <div
          key={item.page}
          className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => setCurrentPage(item.page)}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.bgImage})` }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative p-8 flex flex-col items-center justify-center h-64">
            <item.icon size={48} className="text-white mb-4" />
            <h2 className="text-2xl font-bold text-white text-center">{item.title}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainMenu;
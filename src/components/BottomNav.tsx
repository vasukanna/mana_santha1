import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, LayoutGrid, PlusCircle, MessageCircle, FileText, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, currentUser } = useApp();

  const navItems = [
    {
      id: 'home',
      label: t.navHome,
      icon: Home
    },
    {
      id: 'categories',
      label: t.navCategories,
      icon: LayoutGrid
    },
    {
      id: 'sell',
      label: t.navSell,
      icon: PlusCircle,
      isPrimary: true
    },
    {
      id: 'chats',
      label: t.navChats,
      icon: MessageCircle
    },
    {
      id: 'my_ads',
      label: t.navMyAds,
      icon: FileText
    },
    {
      id: 'profile',
      label: t.navProfile,
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg px-2 py-1.5 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab('sell')}
                className="flex flex-col items-center -mt-5 group focus:outline-hidden cursor-pointer"
                title={item.label}
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-600/35 border-2 border-white group-active:scale-95 transition-all">
                  <PlusCircle className="w-7 h-7 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black text-orange-700 mt-1 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-orange-600 font-bold'
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {item.id === 'chats' && !currentUser && (
                  <span className="sr-only">Chats</span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-extrabold text-orange-600' : 'text-stone-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

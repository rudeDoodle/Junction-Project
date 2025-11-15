import { motion } from 'framer-motion';
import { Home, BookOpen, Newspaper, Wallet, User } from 'lucide-react';

interface TabBarProps {
  activeTab: 'home' | 'learn' | 'news' | 'finance' | 'profile';
  setActiveTab: (tab: 'home' | 'learn' | 'news' | 'finance' | 'profile') => void;
}

const tabs = [
  { id: 'home', label: 'Daily', icon: Home },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'profile', label: 'Profile', icon: User }
];

export default function TabBar({ activeTab, setActiveTab }: TabBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-1 flex flex-col items-center gap-1 py-2 relative"
            >
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-teal-500' : 'text-slate-400'
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -inset-2 bg-teal-50 rounded-xl -z-10"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
              </div>
              <span className={`text-xs transition-colors ${
                isActive ? 'text-teal-600' : 'text-slate-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

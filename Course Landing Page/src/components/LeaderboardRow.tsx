import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Medal, ChevronDown, UserPlus } from 'lucide-react';
import { Button } from './ui/button';

interface LeaderboardRowProps {
  user: any;
  rank: number;
  isCurrentUser: boolean;
}

export default function LeaderboardRow({ user, rank, isCurrentUser }: LeaderboardRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRankIcon = () => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="text-slate-600">{rank}</span>;
  };

  const getAvatarColor = () => {
    const colors = [
      'from-purple-400 to-pink-400',
      'from-blue-400 to-cyan-400',
      'from-green-400 to-emerald-400',
      'from-orange-400 to-red-400',
      'from-indigo-400 to-purple-400'
    ];
    return colors[user.id % colors.length];
  };

  return (
    <motion.div layout className="relative">
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
          isCurrentUser
            ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-200'
            : 'bg-slate-50 hover:bg-slate-100'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 flex items-center justify-center">
          {getRankIcon()}
        </div>

        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white shadow-sm`}>
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 text-left">
          <p className={`${isCurrentUser ? 'text-teal-700' : 'text-slate-900'}`}>
            {user.name}
          </p>
          <p className="text-slate-500 text-sm">{user.xp} XP</p>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white text-2xl shadow-md`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-slate-900">{user.name}</h4>
                  <p className="text-slate-600">{user.xp} XP • Rank #{rank}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-slate-900">127</p>
                  <p className="text-slate-600 text-sm">Lessons</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-slate-900">15</p>
                  <p className="text-slate-600 text-sm">Streak</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-slate-900">94%</p>
                  <p className="text-slate-600 text-sm">Accuracy</p>
                </div>
              </div>

              {!isCurrentUser && (
                <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </Button>
              )}

              {isCurrentUser && (
                <div className="text-center text-slate-600 text-sm">
                  This is you! Keep learning to climb the ranks 🚀
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

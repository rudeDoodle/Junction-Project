import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, BookOpen, Target, Shield, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const helpTopics = [
  {
    icon: BookOpen,
    title: 'How to Use Vatra',
    description: 'Learn lessons daily to build your streak and earn XP. Complete questions to level up!'
  },
  {
    icon: Target,
    title: 'Streaks & XP',
    description: 'Complete a lesson every day to maintain your streak. Earn XP for correct answers - 25 XP for perfect answers, 5-15 XP for partial credit.'
  },
  {
    icon: Shield,
    title: 'Financial Safety',
    description: 'Learn to spot scams, protect your money, and make smart financial decisions. Practice with real-world scenarios.'
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description: 'Check the Finance tab to see your spending patterns, and the News tab for relevant financial updates.'
  }
];

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-white">Help & Guide</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {helpTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-slate-900 text-sm font-semibold mb-1">{topic.title}</h3>
                      <p className="text-slate-600 text-sm">{topic.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 mt-6">
              <p className="text-purple-900 text-sm font-semibold mb-2">💡 Pro Tip</p>
              <p className="text-purple-700 text-sm">
                Complete lessons consistently to build your streak and climb the leaderboard. The more you practice, the better you'll get at managing money!
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white h-12 rounded-xl"
            >
              Got it!
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

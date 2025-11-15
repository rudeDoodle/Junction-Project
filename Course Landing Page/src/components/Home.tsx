import { motion } from 'framer-motion';
import { Flame, Trophy, Settings, HelpCircle, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import LeaderboardRow from './LeaderboardRow';
import HelpModal from './HelpModal';
import SettingsModal from './SettingsModal';

interface HomeProps {
  userData: any;
  leaderboard: any[];
  friendsLeaderboard: any[];
  pastResults: any[];
  detailedHistory: any[];
  onStartLesson: () => void;
}

export default function Home({ userData, leaderboard, friendsLeaderboard, pastResults, detailedHistory, onStartLesson }: HomeProps) {
  const [leaderboardView, setLeaderboardView] = useState<'global' | 'friends'>('global');
  const [completedToday, setCompletedToday] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const streakProgress = (userData.streak % 7) / 7 * 100;

  // Check if user completed a lesson today
  useEffect(() => {
    const lastCompletionDate = localStorage.getItem('lastLessonCompletion');
    const today = new Date().toDateString();
    setCompletedToday(lastCompletionDate === today);
  }, [userData.streak]);

  const currentLeaderboard = leaderboardView === 'global' ? leaderboard : friendsLeaderboard;

  return (
    <div className="min-h-full bg-gradient-to-b from-white to-slate-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-500 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-white/80 mb-1">Welcome back,</p>
            <h1 className="text-white">{userData.name || 'Learner'}</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowHelp(true)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Streak Section - LINEAR PROGRESS BAR */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl p-5 shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-md flex items-center justify-center shadow-md transition-all ${
                completedToday
                  ? 'bg-gradient-to-br from-orange-400 to-red-500'
                  : 'bg-gray-300'
              }`}>
                <Flame className={`w-6 h-6 transition-colors ${
                  completedToday ? 'text-white' : 'text-gray-500'
                }`} />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Day streak</p>
                <p className="text-slate-900">{userData.streak} {userData.streak === 1 ? 'day' : 'days'}</p>
                {!completedToday && userData.streak > 0 && (
                  <p className="text-orange-600 text-xs">Complete a lesson today!</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-600 text-sm">Total XP</p>
              <p className="text-teal-600">{userData.xp}</p>
            </div>
          </div>
          
          {/* Linear progress bar */}
          <div className="h-2 bg-slate-100 rounded-sm overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${streakProgress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="text-slate-500 text-sm mt-2">{7 - (userData.streak % 7)} days to next milestone</p>
        </motion.div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* START LESSON BUTTON - NOW ABOVE LEADERBOARD */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            onClick={onStartLesson}
            className="w-full h-14 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-md shadow-lg"
          >
            Start Lesson
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* LEADERBOARD - NOW BELOW START BUTTON */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-slate-900">Leaderboard</h3>
            </div>
            <div className="flex gap-1 bg-slate-100 rounded-md p-1">
              <button
                onClick={() => setLeaderboardView('global')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  leaderboardView === 'global'
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Global
              </button>
              <button
                onClick={() => setLeaderboardView('friends')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  leaderboardView === 'friends'
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Friends
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {currentLeaderboard.slice(0, 5).map((user, index) => (
              <LeaderboardRow
                key={user.id}
                user={user}
                rank={index + 1}
                isCurrentUser={user.id === userData.id}
              />
            ))}
          </div>
          <p className="text-slate-500 text-sm mt-4 text-center">
            Top players this week
          </p>
        </div>

        {/* Past Results */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900">Recent Results</h3>
            {detailedHistory.length > 3 && (
              <button
                onClick={() => setShowDetailedResults(!showDetailedResults)}
                className="text-teal-600 text-sm hover:text-teal-700 transition-colors"
              >
                {showDetailedResults ? 'Show Less' : 'See More'}
              </button>
            )}
          </div>
          
          {!showDetailedResults ? (
            <div className="flex gap-3">
              {pastResults.slice(0, 3).map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex-1 rounded-lg p-4 ${
                    result.correct
                      ? 'bg-emerald-50 border-2 border-emerald-200'
                      : 'bg-red-50 border-2 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    {result.correct ? (
                      <CheckCircle className="w-7 h-7 text-emerald-600" />
                    ) : (
                      <XCircle className="w-7 h-7 text-red-500" />
                    )}
                  </div>
                  <p className={`text-center ${
                    result.correct ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    +{result.xp} XP
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {detailedHistory.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl p-4 border-2 ${
                    item.correct
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    {item.correct ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-slate-900 text-sm font-medium mb-1">{item.question}</p>
                      <p className="text-slate-600 text-xs mb-2">
                        <span className="font-semibold">Your answer:</span> {item.userAnswer}
                      </p>
                      {!item.correct && (
                        <p className="text-slate-600 text-xs">
                          <span className="font-semibold">Correct answer:</span> {item.correctAnswer}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${
                      item.correct ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      +{item.xp} XP
                    </span>
                  </div>
                  {item.explanation && (
                    <div className="bg-white/50 rounded-lg p-2 mt-2">
                      <p className="text-slate-700 text-xs">{item.explanation}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        userData={userData}
      />
    </div>
  );
}

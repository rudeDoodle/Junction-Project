import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { getPersonalizedLearningPath, explainConcept, type UserProfile } from '../services/aiService';

interface LearnProps {
  userData: any;
}

const videos = [
  {
    id: 1,
    title: "Understanding Interest Rates",
    type: "Micro-lesson",
    duration: "2:30",
    thumbnail: "chart"
  },
  {
    id: 2,
    title: "Spotting Fake Shopping Sites",
    type: "Role-play",
    duration: "3:15",
    thumbnail: "shield"
  },
  {
    id: 3,
    title: "Building Your First Budget",
    type: "How-to",
    duration: "4:00",
    thumbnail: "wallet"
  }
];

export default function Learn({ userData }: LearnProps) {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [isLoadingPath, setIsLoadingPath] = useState(false);
  const [todaysTopic, setTodaysTopic] = useState<string>('Smart Money Moves for Students');
  const [topicExplanation, setTopicExplanation] = useState<string>('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  useEffect(() => {
    loadPersonalizedPath();
    loadTodaysTopic();
  }, []);

  const loadPersonalizedPath = async () => {
    setIsLoadingPath(true);
    try {
      const userProfile: UserProfile = {
        age: userData.age,
        gender: userData.gender,
        experience: userData.experience,
        country: userData.country,
        role: userData.role
      };

      const path = await getPersonalizedLearningPath(userProfile, { correct: 0, total: 0 });
      if (path && path.length > 0) {
        setLearningPath(path);
      }
    } catch (error) {
      console.error('Failed to load personalized learning path:', error);
    } finally {
      setIsLoadingPath(false);
    }
  };

  const loadTodaysTopic = async () => {
    try {
      const userProfile: UserProfile = {
        age: userData.age,
        gender: userData.gender,
        experience: userData.experience,
        country: userData.country,
        role: userData.role
      };

      // Generate a personalized topic based on user profile
      const topics = [
        'Avoiding Online Scams',
        'Managing Student Budget',
        'Understanding Bank Fees',
        'Building Credit Wisely',
        'Digital Payment Security'
      ];
      
      const selectedTopic = topics[Math.floor(Math.random() * topics.length)];
      setTodaysTopic(selectedTopic);
    } catch (error) {
      console.error('Failed to load today\'s topic:', error);
    }
  };

  const handleTopicClick = async () => {
    setIsLoadingExplanation(true);
    try {
      const userProfile: UserProfile = {
        age: userData.age,
        gender: userData.gender,
        experience: userData.experience,
        country: userData.country,
        role: userData.role
      };

      const explanation = await explainConcept(
        todaysTopic,
        userProfile,
        'This is the topic of the day. Make it practical and engaging.'
      );
      setTopicExplanation(explanation);
    } catch (error) {
      console.error('Failed to get topic explanation:', error);
      setTopicExplanation('Unable to load explanation at this time. Please try again later.');
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const getIconForThumbnail = (type: string) => {
    const icons: Record<string, string> = {
      chart: '📊',
      shield: '🛡️',
      wallet: '💳'
    };
    return icons[type] || '📚';
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-white to-slate-50 pb-6">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-gray-900 mb-2">Learn</h1>
        <p className="text-gray-600">Daily lessons and practice</p>
      </div>

      <div className="px-6 space-y-6">
        {/* Topic of the Day - COMPACT */}
        <motion.button
          onClick={handleTopicClick}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-gradient-to-br from-lime-50 to-emerald-50 border-2 border-lime-200 rounded-lg p-4 text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-lime-400 to-emerald-500 rounded flex items-center justify-center text-xs">
              ⭐
            </div>
            <h3 className="text-gray-900 text-sm">Topic of the Day</h3>
          </div>
          <p className="text-gray-800 text-sm mb-3">{todaysTopic}</p>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lime-600" />
            <span className="text-lime-700 text-xs">Personalized for you</span>
          </div>
        </motion.button>

        {/* Topic Explanation Modal */}
        <AnimatePresence>
          {topicExplanation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
              onClick={() => setTopicExplanation('')}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-t-3xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900">{todaysTopic}</h3>
                  <button
                    onClick={() => setTopicExplanation('')}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                {isLoadingExplanation ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-lime-500 animate-spin" />
                  </div>
                ) : (
                  <div className="prose prose-sm text-gray-700">
                    {topicExplanation.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-3">{paragraph}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Personalized Learning Path */}
        {isLoadingPath ? (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
              <p className="text-gray-600 text-sm">Loading your personalized path...</p>
            </div>
          </div>
        ) : learningPath.length > 0 ? (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-900 text-sm">Your Learning Path</h3>
            </div>
            <div className="space-y-2">
              {learningPath.slice(0, 3).map((topic: any, idx: number) => (
                <div key={idx} className="bg-white rounded-lg p-3 border border-blue-200">
                  <h4 className="text-gray-900 text-sm mb-1">{topic.title}</h4>
                  <p className="text-gray-600 text-xs">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Videos Section */}
        <div>
          <h3 className="text-gray-900 mb-4">Learning Videos</h3>
          <div className="space-y-3">
            {videos.map((video) => (
              <motion.button
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-md rounded-lg p-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center text-2xl">
                    {getIconForThumbnail(video.thumbnail)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded">
                        {video.type}
                      </span>
                      <span className="text-xs text-gray-500">{video.duration}</span>
                    </div>
                    <h4 className="text-gray-900 text-sm">{video.title}</h4>
                  </div>
                  <Play className="w-5 h-5 text-teal-600" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Practice with Vatra */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl shadow-md">
              🤖
            </div>
            <div>
              <h3 className="text-gray-900 text-sm">Practice with Vatra</h3>
              <p className="text-gray-600 text-xs">Quick exercise on today's topic</p>
            </div>
          </div>
          <Button className="w-full h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-md text-sm shadow-md">
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Practice
          </Button>
        </div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg overflow-hidden w-full max-w-md shadow-2xl"
            >
              {/* Video Player Header */}
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                <h4 className="text-gray-900 text-sm">{selectedVideo.title}</h4>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Video Area (Simulated) */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center"
                >
                  <Play className="w-8 h-8 text-teal-600 ml-1" />
                </motion.div>
                
                {/* Simulated video playback indicator */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="h-1 bg-gray-300 rounded-sm overflow-hidden">
                    <motion.div
                      className="h-full bg-teal-500"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 10, repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4 bg-gray-50">
                <p className="text-gray-700 text-sm">
                  This is a placeholder for the AI-generated video content. In the full version, this would play the actual lesson video.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
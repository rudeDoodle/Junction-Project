import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface LearnProps {
  userData: any;
  onStartLesson: (topic: string) => void;
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

export default function Learn({ userData, onStartLesson }: LearnProps) {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getIconForThumbnail = (type: string) => {
    const icons: Record<string, string> = {
      chart: '📊',
      shield: '🛡️',
      wallet: '💳'
    };
    return icons[type] || '📚';
  };

  const handleStartLesson = async (topic: string) => {
    setIsGenerating(true);
    try {
      await onStartLesson(topic);
    } catch (error) {
      console.error('Failed to start lesson:', error);
    } finally {
      setIsGenerating(false);
    }
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
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-lime-50 to-emerald-50 border-2 border-lime-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-lime-400 to-emerald-500 rounded flex items-center justify-center text-xs">
              ⭐
            </div>
            <h3 className="text-gray-900 text-sm">Topic of the Day</h3>
          </div>
          <p className="text-gray-800 text-sm mb-3">Smart Money Moves for Students</p>
          <Button 
            onClick={() => handleStartLesson("Smart Money Moves for Students")}
            disabled={isGenerating}
            className="w-full h-10 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-white rounded-md text-sm shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Start Today\'s Topic'
            )}
          </Button>
        </motion.div>

        {/* Videos Section */}
        <div>
          <h3 className="text-gray-900 mb-4">Learning Videos</h3>
          <div className="space-y-3">
            {videos.map((video) => (
              <motion.button
                key={video.id}
                onClick={() => handleStartLesson(video.title)}
                disabled={isGenerating}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-md rounded-lg p-4 transition-all disabled:opacity-50"
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
                  {isGenerating ? (
                    <Sparkles className="w-5 h-5 text-teal-600 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5 text-teal-600" />
                  )}
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
          <Button 
            onClick={() => handleStartLesson("Financial Practice Quiz")}
            disabled={isGenerating}
            className="w-full h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-md text-sm shadow-md disabled:opacity-50"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Start Practice'}
          </Button>
        </div>
      </div>
    </div>
  );
}
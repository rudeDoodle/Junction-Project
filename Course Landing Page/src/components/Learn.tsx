import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';

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
          <Button className="w-full h-10 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-white rounded-md text-sm shadow-md">
            Start Today's Topic
          </Button>
        </motion.div>

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
import { motion } from 'framer-motion';
import { Keyboard, Mic, List } from 'lucide-react';

interface ChatModeSelectorProps {
  onSelectMode: (mode: 'type' | 'voice' | 'mcq') => void;
}

export default function ChatModeSelector({ onSelectMode }: ChatModeSelectorProps) {
  const modes = [
    {
      id: 'type' as const,
      icon: Keyboard,
      title: 'Type your answers',
      description: 'Best for detailed responses'
    },
    {
      id: 'voice' as const,
      icon: Mic,
      title: 'Speak with microphone',
      description: 'Quick and hands-free'
    },
    {
      id: 'mcq' as const,
      icon: List,
      title: 'Quick multiple-choice questions',
      description: 'Fastest option'
    }
  ];

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-3xl">🤖</span>
          </div>
          <h2 className="text-gray-900 mb-2">Choose how you want to talk to Vatra</h2>
          <p className="text-gray-600">Pick the method that works best for you</p>
        </div>

        <div className="space-y-3">
          {modes.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <motion.button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-5 bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-md rounded-md text-left transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 group-hover:from-teal-200 group-hover:to-cyan-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{mode.title}</h3>
                    <p className="text-gray-600 text-sm">{mode.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'xp' | 'notifications' | 'text' | 'voice' | 'privacy';
  title: string;
}

export default function PreferencesModal({ isOpen, onClose, type, title }: PreferencesModalProps) {
  const [xpGoal, setXpGoal] = useState('500');
  const [notifFreq, setNotifFreq] = useState('daily');
  const [textSize, setTextSize] = useState('medium');

  const renderContent = () => {
    switch (type) {
      case 'xp':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-slate-700 text-sm mb-1 block">Daily XP Goal</label>
              <select
                value={xpGoal}
                onChange={(e) => setXpGoal(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-400"
              >
                <option value="100">Relaxed - 100 XP/day</option>
                <option value="250">Regular - 250 XP/day</option>
                <option value="500">Serious - 500 XP/day</option>
                <option value="1000">Intense - 1000 XP/day</option>
              </select>
            </div>
            <p className="text-slate-600 text-sm">
              Set a daily XP goal to track your learning progress. You'll get reminders if you're behind!
            </p>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-slate-700 text-sm mb-1 block">Notification Frequency</label>
              <select
                value={notifFreq}
                onChange={(e) => setNotifFreq(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-400"
              >
                <option value="multiple">Multiple times a day</option>
                <option value="daily">Once a day</option>
                <option value="weekly">Once a week</option>
                <option value="never">Never</option>
              </select>
            </div>
            <p className="text-slate-600 text-sm">
              Control how often Vatra reminds you to practice. We'll send gentle nudges to keep your streak alive!
            </p>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-slate-700 text-sm mb-1 block">Text Size</label>
              <select
                value={textSize}
                onChange={(e) => setTextSize(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-400"
              >
                <option value="small">Small</option>
                <option value="medium">Medium (Recommended)</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className={`text-slate-900 ${
                textSize === 'small' ? 'text-sm' :
                textSize === 'large' ? 'text-lg' :
                textSize === 'xlarge' ? 'text-xl' :
                'text-base'
              }`}>
                This is how text will appear throughout the app.
              </p>
            </div>
          </div>
        );
      
      case 'voice':
        return (
          <div className="space-y-4">
            <p className="text-slate-700">
              VoiceOver support allows screen readers to describe what's on your screen. This helps visually impaired users navigate the app.
            </p>
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
              <p className="text-teal-900 text-sm">
                ✓ VoiceOver is currently supported on iOS devices
              </p>
            </div>
            <p className="text-slate-600 text-sm">
              Enable VoiceOver in your device settings under Accessibility → VoiceOver.
            </p>
          </div>
        );
      
      case 'privacy':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="text-slate-900 mb-2">Data We Store</h4>
                <ul className="text-slate-600 text-sm space-y-1">
                  <li>• Learning progress (XP, streak)</li>
                  <li>• Profile information (name, age, country)</li>
                  <li>• Quiz results and history</li>
                  <li>• App preferences</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="text-slate-900 mb-2">Your Rights</h4>
                <ul className="text-slate-600 text-sm space-y-1">
                  <li>• Request a copy of your data</li>
                  <li>• Delete your account anytime</li>
                  <li>• Opt out of analytics</li>
                </ul>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              Delete All My Data
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-3xl shadow-2xl z-[9999] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 px-6 py-5 flex items-center justify-between">
              <h2 className="text-white">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {renderContent()}
            </div>

            {/* Footer */}
            {type !== 'voice' && type !== 'privacy' && (
              <div className="p-6 border-t border-slate-200 flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Save
                </Button>
              </div>
            )}
            
            {(type === 'voice' || type === 'privacy') && (
              <div className="p-6 border-t border-slate-200">
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Got it
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, User, Bell, Globe, Moon } from 'lucide-react';
import { Button } from './ui/button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  onUpdateSettings?: (settings: any) => void;
}

export default function SettingsModal({ isOpen, onClose, userData, onUpdateSettings }: SettingsModalProps) {
  if (!isOpen) return null;

  const settingsSections = [
    {
      icon: User,
      title: 'Profile',
      items: [
        { label: 'Name', value: userData.name || 'Demo User' },
        { label: 'Country', value: userData.country || 'Finland' },
        { label: 'Role', value: userData.role || 'Student' }
      ]
    },
    {
      icon: Bell,
      title: 'Notifications',
      items: [
        { label: 'Daily reminders', value: 'On', toggle: true },
        { label: 'Streak alerts', value: 'On', toggle: true }
      ]
    },
    {
      icon: Globe,
      title: 'Language & Region',
      items: [
        { label: 'Language', value: 'English' },
        { label: 'Currency', value: 'EUR (€)' }
      ]
    },
    {
      icon: Moon,
      title: 'Appearance',
      items: [
        { label: 'Theme', value: 'Light', toggle: true }
      ]
    }
  ];

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
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-white">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {settingsSections.map((section, sectionIndex) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={sectionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-slate-600" />
                    <h3 className="text-slate-900 text-sm font-semibold">{section.title}</h3>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between">
                        <span className="text-slate-700 text-sm">{item.label}</span>
                        <span className="text-slate-900 text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-200">
              <p className="text-amber-900 text-sm font-semibold mb-2">⚙️ More Coming Soon</p>
              <p className="text-amber-700 text-sm">
                We're working on adding more customization options. Stay tuned!
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 rounded-xl"
            >
              Done
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

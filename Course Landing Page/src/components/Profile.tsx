import { User, Settings, Bell, Eye, MessageSquare, Shield, LogOut, ChevronRight, Flame, X, Send } from 'lucide-react';
import { Switch } from './ui/switch';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EditProfileModal from './EditProfileModal';
import PreferencesModal from './PreferencesModal';
import { Button } from './ui/button';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ProfileProps {
  userData: any;
  setUserData: (data: any) => void;
  onReopenChat?: () => void;
}

export default function Profile({ userData, setUserData }: ProfileProps) {
  const [notifications, setNotifications] = useState(true);
  const [streakProtection, setStreakProtection] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPreferences, setShowPreferences] = useState<{
    open: boolean;
    type: 'xp' | 'notifications' | 'text' | 'voice' | 'privacy';
    title: string;
  }>({ open: false, type: 'xp', title: '' });
  const [showVatraChat, setShowVatraChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSaveProfile = (data: any) => {
    setUserData({ ...userData, ...data });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out? Your progress is saved locally.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleOpenVatraChat = () => {
    setShowVatraChat(true);
    // Initialize with welcome message
    setChatMessages([{
      id: 1,
      sender: 'vatra',
      text: "Hey! 👋 I'm Vatra, your AI finance buddy. I remember our last chat where you told me about yourself. Want to update your preferences, ask about budgeting tips, or just chat about money stuff? I'm here to help!",
      timestamp: new Date()
    }]);
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isAIThinking) return;

    const userMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: chatInput.trim(),
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setIsAIThinking(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const context = `You are Vatra, a friendly AI finance assistant for young people in ${userData.country || 'Finland'}. 
User info: ${userData.name || 'User'}, ${userData.age ? userData.age + ' years old' : 'young adult'}, ${userData.role || 'student'}.
Be concise (2-3 sentences), encouraging, and use emojis occasionally. Focus on practical financial advice for youth.
Previous conversation context: This is a follow-up chat after initial onboarding.`;

      const result = await model.generateContent(`${context}\n\nUser: ${userMessage.text}\n\nVatra:`);
      const response = await result.response;
      const aiText = response.text();

      const aiMessage = {
        id: chatMessages.length + 2,
        sender: 'vatra',
        text: aiText,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage = {
        id: chatMessages.length + 2,
        sender: 'vatra',
        text: "Oops! I'm having trouble connecting right now. Try asking me again in a moment! 😅",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAIThinking(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-white to-slate-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-500 px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-4xl shadow-xl mb-4">
            {userData.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2 className="text-white mb-1">{userData.name || 'Demo User'}</h2>
          <p className="text-white/80 mb-4">{userData.country} • {userData.role}</p>
          
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-white/80 text-sm">Streak</p>
              <p className="text-white text-center">{userData.streak} 🔥</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-white/80 text-sm">Total XP</p>
              <p className="text-white text-center">{userData.xp}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Personalization */}
        <div>
          <h3 className="text-slate-900 mb-4">Personalization</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
            <button
              onClick={handleOpenVatraChat}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-slate-900">Talk to Vatra again</p>
                  <p className="text-slate-600 text-sm">Update your preferences</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button
              onClick={() => setShowEditProfile(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-teal-600" />
                </div>
                <div className="text-left">
                  <p className="text-slate-900">Edit profile</p>
                  <p className="text-slate-600 text-sm">Age, role, location</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Gamification */}
        <div>
          <h3 className="text-slate-900 mb-4">Gamification</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="text-slate-900">Streak protection</p>
                  <p className="text-slate-600 text-sm">Save streak if you miss a day</p>
                </div>
              </div>
              <Switch
                checked={streakProtection}
                onCheckedChange={setStreakProtection}
              />
            </div>

            <button
              onClick={() => setShowPreferences({ open: true, type: 'xp', title: 'XP Preferences' })}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="text-slate-900">XP preferences</p>
                  <p className="text-slate-600 text-sm">Customize your goals</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="text-slate-900 mb-4">Notifications</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-slate-900">Push notifications</p>
                  <p className="text-slate-600 text-sm">Reminders & updates</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <button
              onClick={() => setShowPreferences({ open: true, type: 'notifications', title: 'Notification Frequency' })}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-slate-900">Notification frequency</p>
                  <p className="text-slate-600 text-sm">Daily</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Accessibility */}
        <div>
          <h3 className="text-slate-900 mb-4">Accessibility</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-slate-900">High contrast</p>
                  <p className="text-slate-600 text-sm">Better visibility</p>
                </div>
              </div>
              <Switch
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>

            <button
              onClick={() => setShowPreferences({ open: true, type: 'text', title: 'Text Size' })}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="text-slate-900">Text size</p>
                  <p className="text-slate-600 text-sm">Medium</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button
              onClick={() => setShowPreferences({ open: true, type: 'voice', title: 'VoiceOver' })}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-pink-600" />
                </div>
                <div className="text-left">
                  <p className="text-slate-900">VoiceOver</p>
                  <p className="text-slate-600 text-sm">Screen reader support</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-slate-900 mb-4">Account</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
            <button
              onClick={() => setShowPreferences({ open: true, type: 'privacy', title: 'Privacy & Data' })}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-slate-600" />
                </div>
                <div className="text-left">
                  <p className="text-slate-900">Privacy & Data</p>
                  <p className="text-slate-600 text-sm">Manage your data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-red-600">Log out</p>
              </div>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center text-slate-500 text-sm py-4">
          <p>Vatra v1.0.0</p>
          <p className="mt-1">Made with 🔥 for youth finance learning</p>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        userData={userData}
        onSave={handleSaveProfile}
      />
      <PreferencesModal
        isOpen={showPreferences.open}
        onClose={() => setShowPreferences({ ...showPreferences, open: false })}
        type={showPreferences.type}
        title={showPreferences.title}
      />

      {/* Vatra Chat Modal */}
      <AnimatePresence>
        {showVatraChat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVatraChat(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl shadow-2xl z-[9999] overflow-hidden flex flex-col"
              style={{ maxHeight: '85vh' }}
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 px-6 py-5 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <h2 className="text-white">Vatra</h2>
                    <p className="text-white/80 text-sm">AI Finance Buddy</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVatraChat(false)}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                <AnimatePresence>
                  {chatMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                            : 'bg-white text-gray-900 shadow-sm border border-gray-100'
                        }`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isAIThinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                          className="w-2 h-2 bg-purple-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                          className="w-2 h-2 bg-purple-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                          className="w-2 h-2 bg-purple-400 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    placeholder="Ask me anything about finances..."
                    className="flex-1 px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    disabled={isAIThinking}
                  />
                  <Button
                    onClick={handleSendChatMessage}
                    disabled={!chatInput.trim() || isAIThinking}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 w-12 rounded-xl p-0 shadow-md disabled:opacity-50"
                  >
                    {isAIThinking ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

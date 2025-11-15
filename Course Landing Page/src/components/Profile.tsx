import { User, Settings, Bell, Eye, MessageSquare, Shield, LogOut, ChevronRight, Flame } from 'lucide-react';
import { Switch } from './ui/switch';
import { useState } from 'react';

interface ProfileProps {
  userData: any;
  setUserData: (data: any) => void;
  onReopenChat: () => void;
}

export default function Profile({ userData, setUserData, onReopenChat }: ProfileProps) {
  const [notifications, setNotifications] = useState(true);
  const [streakProtection, setStreakProtection] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [vibration, setVibration] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  const [saveAnalytics, setSaveAnalytics] = useState(true);

  const updateField = (key: string, value: any) => {
    setUserData({ ...userData, [key]: value });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out? Your progress is saved locally.')) {
      localStorage.clear();
      window.location.reload();
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

        {/* PERSONALIZATION */}
        <div>
          <h3 className="text-slate-900 mb-4">Personalization</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 p-4 space-y-4">
            
            {/* Edit name */}
            <div>
              <p className="text-sm text-slate-600 mb-1">Name</p>
              <input
                className="border px-3 py-2 rounded-lg w-full"
                value={userData.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>

            {/* Edit role */}
            <div>
              <p className="text-sm text-slate-600 mb-1">Role</p>
              <input
                className="border px-3 py-2 rounded-lg w-full"
                value={userData.role}
                onChange={(e) => updateField('role', e.target.value)}
              />
            </div>

            {/* Edit country */}
            <div>
              <p className="text-sm text-slate-600 mb-1">Country</p>
              <input
                className="border px-3 py-2 rounded-lg w-full"
                value={userData.country}
                onChange={(e) => updateField('country', e.target.value)}
              />
            </div>

            {/* Reopen chat */}
            <button
              onClick={onReopenChat}
              className="w-full mt-2 flex items-center justify-between bg-slate-50 p-3 rounded-xl hover:bg-slate-100"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                Talk to Vatra again
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

          </div>
        </div>

        {/* GAMIFICATION */}
        <div>
          <h3 className="text-slate-900 mb-4">Gamification</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            
            {/* Streak protection */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-900">Streak protection</p>
                <p className="text-slate-600 text-sm">Keep streak even if you miss a day</p>
              </div>
              <Switch checked={streakProtection} onCheckedChange={setStreakProtection} />
            </div>

            {/* XP goal */}
            <div className="p-4">
              <p className="text-slate-900 mb-1">Daily XP goal</p>
              <input
                type="number"
                className="border px-3 py-2 rounded-lg w-full"
                value={userData.dailyXpGoal || 50}
                onChange={(e) => updateField('dailyXpGoal', Number(e.target.value))}
              />
            </div>

          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div>
          <h3 className="text-slate-900 mb-4">Notifications</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y">

            <div className="p-4 flex items-center justify-between">
              <p className="text-slate-900">Push notifications</p>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="p-4 flex items-center justify-between">
              <p className="text-slate-900">Sound effects</p>
              <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
            </div>

            <div className="p-4 flex items-center justify-between">
              <p className="text-slate-900">Vibration</p>
              <Switch checked={vibration} onCheckedChange={setVibration} />
            </div>

          </div>
        </div>

        {/* ACCESSIBILITY */}
        <div>
          <h3 className="text-slate-900 mb-4">Accessibility</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y">

            <div className="p-4 flex items-center justify-between">
              <p className="text-slate-900">High contrast mode</p>
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>

            <div className="p-4 flex items-center justify-between">
              <p className="text-slate-900">Large text</p>
              <Switch checked={largeText} onCheckedChange={setLargeText} />
            </div>

          </div>
        </div>

        {/* PRIVACY */}
        <div>
          <h3 className="text-slate-900 mb-4">Privacy & Data</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y">

            <div className="p-4 flex items-center justify-between">
              <p className="text-slate-900">Private mode</p>
              <Switch checked={privateMode} onCheckedChange={setPrivateMode} />
            </div>

            <div className="p-4 flex items-center justify-between">
              <p className="text-slate-900">Anonymous analytics</p>
              <Switch checked={saveAnalytics} onCheckedChange={setSaveAnalytics} />
            </div>

            <button
              onClick={handleLogout}
              className="w-full p-4 text-left text-red-600 hover:bg-red-50"
            >
              Log out
            </button>

          </div>
        </div>

        <div className="text-center text-slate-500 text-sm py-4">
          <p>Vatra v1.0.0</p>
          <p className="mt-1">Made with 🔥 for youth finance learning</p>
        </div>

      </div>
    </div>
  );
}

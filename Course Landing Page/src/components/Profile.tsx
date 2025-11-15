import { motion } from 'framer-motion';
import { User, Settings, Bell, Eye, MessageSquare, Shield, LogOut, ChevronRight, Flame } from 'lucide-react';
import { Button } from './ui/button';
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
              onClick={onReopenChat}
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

            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
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

            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
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

            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
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

            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
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

            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
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
            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
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

            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
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
    </div>
  );
}
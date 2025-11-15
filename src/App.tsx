import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Welcome from './components/Welcome';
import OnboardingFlow from './components/OnboardingFlow';
import ChatModeSelector from './components/ChatModeSelector';
import Chat from './components/Chat';
import TabBar from './components/TabBar';
import Home from './components/Home';
import Learn from './components/Learn';
import News from './components/News';
import Finance from './components/Finance';
import Profile from './components/Profile';
import LessonView from './components/LessonView';
import LoadingAnimation from './components/LoadingAnimation';
import NotificationToast from './components/NotificationToast';

// Sample data structure
const initialData = {
  user: {
    id: 1,
    name: "Demo User",
    country: "Finland",
    role: "student",
    streak: 4,
    xp: 420,
    avatar: "img3",
    age: null,
    gender: null,
    experience: null
  },
  leaderboard: [
    { id: 2, name: "Aino", xp: 1200, avatar: "img1" },
    { id: 3, name: "Jon", xp: 980, avatar: "img2" },
    { id: 4, name: "Saara", xp: 850, avatar: "img4" },
    { id: 5, name: "Mikko", xp: 720, avatar: "img5" },
    { id: 1, name: "Demo User", xp: 420, avatar: "img3" }
  ],
  questions: [
    {
      id: 1,
      type: "slider",
      prompt: "Rate the risk 0–100: Someone asks to pay via gift card for a second-hand phone.",
      answer: 80,
      explanation: "Gift card payments are a huge red flag — scammers love them because they're untraceable!"
    },
    {
      id: 2,
      type: "scam",
      prompt: "You get a loan offer via DM with a low interest rate—what do you do?",
      choices: ["Ignore it", "Verify via official site", "Pay the fee now", "Ask a friend"],
      correct: 1,
      explanations: [
        "Safe choice, but you might miss legit offers.",
        "Perfect! Always check official sources before trusting DMs.",
        "Nope — never pay upfront fees for loans!",
        "Your friend might not know either. Check official sources!"
      ]
    },
    {
      id: 3,
      type: "confidence",
      prompt: "How confident are you about managing a monthly budget?",
      choices: ["Very confident", "Somewhat confident", "Not very confident", "Need help"],
      correct: null
    },
    {
      id: 4,
      type: "scam",
      prompt: "A website offers designer shoes at 70% off. What's your move?",
      choices: ["Buy immediately", "Check reviews first", "Compare prices elsewhere", "All of the above"],
      correct: 3,
      explanations: [
        "Hold up! Too-good-to-be-true deals often are.",
        "Smart, but do more digging!",
        "Good thinking! Price comparison helps.",
        "Exactly! Do your homework before buying."
      ]
    },
    {
      id: 5,
      type: "slider",
      prompt: "Rate the risk 0–100: Clicking a link in an email about a package delivery you weren't expecting.",
      answer: 90,
      explanation: "Super risky! These phishing emails try to steal your info. Always go directly to the courier's official site."
    }
  ],
  facts: [
    "5 coffees ≈ €12 — about a short bus ride",
    "€30 saved = movie + snack for two",
    "Skipping one takeout meal/week = €200/year saved",
    "That daily energy drink habit? Could be a weekend trip in 3 months"
  ],
  news: [
    {
      id: 1,
      title: "Taxes likely to change for young workers",
      summary: "New tax breaks might help students and first-time workers keep more of their paycheck",
      date: "2025-11-10",
      tags: ["taxes", "jobs"],
      detail: "The government is considering tax reforms that would reduce income tax for workers under 25. This could mean an extra €50-100 monthly in your pocket if you're working part-time while studying.",
      youthImpact: "If you're working alongside studying, you might get to keep more of what you earn. Worth planning for!"
    },
    {
      id: 2,
      title: "Rent prices drop in major cities",
      summary: "Student housing getting slightly more affordable in Helsinki and Tampere",
      date: "2025-11-12",
      tags: ["rent", "housing"],
      detail: "Average student apartment rents have decreased by 3-5% this quarter due to increased supply. New student housing projects are also coming online next year.",
      youthImpact: "Good news if you're apartment hunting! Might be worth waiting a bit or negotiating your current rent."
    },
    {
      id: 3,
      title: "New student loan terms announced",
      summary: "Repayment period extended, interest rates adjusted",
      date: "2025-11-13",
      tags: ["loans", "education"],
      detail: "Student loans now have a 20-year repayment period (up from 15) and slightly lower interest rates, making monthly payments more manageable.",
      youthImpact: "If you're taking out student loans, the longer repayment means smaller monthly bills when you graduate."
    },
    {
      id: 4,
      title: "Popular subscription services raising prices",
      summary: "Streaming and music apps getting pricier — time to audit?",
      date: "2025-11-14",
      tags: ["subscriptions", "money"],
      detail: "Major streaming platforms are hiking prices by €1-3/month. Time to check which subscriptions you actually use!",
      youthImpact: "Check your subscriptions! You might be paying for stuff you forgot about. Student discounts still available for some."
    }
  ],
  finances: [
    { category: "Groceries", monthly: 210, trend: [195, 205, 210, 215, 210], change: -3 },
    { category: "Subscriptions", monthly: 45, trend: [40, 40, 45, 45, 45], change: 12 },
    { category: "Transport", monthly: 85, trend: [90, 85, 80, 85, 85], change: -5 },
    { category: "Rent", monthly: 450, trend: [450, 450, 450, 450, 450], change: 0 },
    { category: "Other", monthly: 120, trend: [100, 130, 110, 125, 120], change: -4 }
  ],
  transactions: [
    { id: 1, date: "2025-11-15", merchant: "S-Market", amount: 23.50, category: "Groceries" },
    { id: 2, date: "2025-11-14", merchant: "Netflix", amount: 11.99, category: "Subscriptions" },
    { id: 3, date: "2025-11-13", merchant: "HSL", amount: 32.00, category: "Transport" },
    { id: 4, date: "2025-11-12", merchant: "Alepa", amount: 15.20, category: "Groceries" },
    { id: 5, date: "2025-11-11", merchant: "Spotify", amount: 5.99, category: "Subscriptions" }
  ],
  pastResults: [
    { correct: true, xp: 25 },
    { correct: true, xp: 25 },
    { correct: false, xp: 5 }
  ]
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'onboarding' | 'chatMode' | 'chat' | 'loading' | 'main' | 'lesson'>('welcome');
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'news' | 'finance' | 'profile'>('home');
  const [userData, setUserData] = useState(initialData.user);
  const [leaderboard, setLeaderboard] = useState(initialData.leaderboard);
  const [appData, setAppData] = useState(initialData);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'warning' | 'success' } | null>(null);
  const [crazyPaymentCount, setCrazyPaymentCount] = useState(0);
  const [chatMode, setChatMode] = useState<'type' | 'voice' | 'mcq' | null>(null);

  const updateUserXP = (xpGain: number) => {
    setUserData(prev => {
      const newXP = prev.xp + xpGain;
      setLeaderboard(current => {
        const updated = current.map(user => 
          user.id === prev.id ? { ...user, xp: newXP } : user
        );
        return updated.sort((a, b) => b.xp - a.xp);
      });
      return { ...prev, xp: newXP };
    });
  };

  const updateStreak = () => {
    setUserData(prev => ({ ...prev, streak: prev.streak + 1 }));
  };

  const handleOnboardingComplete = (data: any) => {
    setUserData(prev => ({ ...prev, ...data }));
    if (data.skipChat) {
      setCurrentScreen('main');
    } else {
      setCurrentScreen('chatMode');
    }
  };

  const handleChatModeSelected = (mode: 'type' | 'voice' | 'mcq') => {
    setChatMode(mode);
    setCurrentScreen('chat');
  };

  const handleChatComplete = () => {
    setCurrentScreen('loading');
    setTimeout(() => {
      setCurrentScreen('main');
    }, 4000);
  };

  const handleStartLesson = () => {
    setCurrentScreen('lesson');
  };

  const handleLessonComplete = (earnedXP: number) => {
    updateUserXP(earnedXP);
    updateStreak();
    setCurrentScreen('main');
    setNotification({ message: `Awesome! +${earnedXP} XP — keep stacking that streak`, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCrazyPayment = (amount: number, category: string) => {
    const newCount = crazyPaymentCount + 1;
    setCrazyPaymentCount(newCount);
    
    const message = newCount === 1 
      ? `Heads up — unusual payment detected. Review your spending to stay on track.`
      : `You did this ${newCount} times this month. Want tips to avoid overspending?`;
    
    setNotification({ message, type: 'warning' });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[430px] h-[932px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative">
        <AnimatePresence mode="wait">
          {currentScreen === 'welcome' && (
            <Welcome 
              key="welcome"
              onGetStarted={() => setCurrentScreen('onboarding')}
            />
          )}
          
          {currentScreen === 'onboarding' && (
            <OnboardingFlow 
              key="onboarding"
              onComplete={handleOnboardingComplete}
            />
          )}

          {currentScreen === 'chatMode' && (
            <ChatModeSelector
              key="chatMode"
              onSelectMode={handleChatModeSelected}
            />
          )}
          
          {currentScreen === 'chat' && (
            <Chat 
              key="chat"
              messages={chatMessages}
              setMessages={setChatMessages}
              onComplete={handleChatComplete}
              userData={userData}
              setUserData={setUserData}
              chatMode={chatMode}
            />
          )}
          
          {currentScreen === 'loading' && (
            <LoadingAnimation key="loading" />
          )}
          
          {currentScreen === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1 overflow-y-auto pb-20">
                {activeTab === 'home' && (
                  <Home 
                    userData={userData}
                    leaderboard={leaderboard}
                    pastResults={appData.pastResults}
                    onStartLesson={handleStartLesson}
                  />
                )}
                {activeTab === 'learn' && (
                  <Learn userData={userData} />
                )}
                {activeTab === 'news' && (
                  <News news={appData.news} />
                )}
                {activeTab === 'finance' && (
                  <Finance 
                    finances={appData.finances}
                    transactions={appData.transactions}
                    userData={userData}
                    onCrazyPayment={handleCrazyPayment}
                    crazyPaymentCount={crazyPaymentCount}
                  />
                )}
                {activeTab === 'profile' && (
                  <Profile 
                    userData={userData}
                    setUserData={setUserData}
                    onReopenChat={() => setCurrentScreen('chatMode')}
                  />
                )}
              </div>
              
              <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
            </motion.div>
          )}
          
          {currentScreen === 'lesson' && (
            <LessonView
              key="lesson"
              questions={appData.questions}
              facts={appData.facts}
              onComplete={handleLessonComplete}
              onBack={() => setCurrentScreen('main')}
              userData={userData}
            />
          )}
        </AnimatePresence>

        {notification && (
          <NotificationToast
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
}

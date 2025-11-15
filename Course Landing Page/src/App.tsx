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
import { generateLesson } from './services/gemini';

// Sample data structure
const initialData = {
  user: {
    id: 1,
    name: "Demo User",
    country: "Finland",
    role: "student",
    streak: 4,
    xp: 0,
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
    { id: 1, name: "Demo User", xp: 0, avatar: "img3" }
  ],
  friendsLeaderboard: [
    { id: 6, name: "Emma", xp: 650, avatar: "img1" },
    { id: 7, name: "Lauri", xp: 580, avatar: "img2" },
    { id: 1, name: "Demo User", xp: 0, avatar: "img3" },
    { id: 8, name: "Sofia", xp: 390, avatar: "img4" },
    { id: 9, name: "Ville", xp: 320, avatar: "img5" }
  ],
  questions: [
    {
      id: 1,
      type: "slider",
      prompt: "Rate the risk 0–100: Someone on Facebook Marketplace asks you to pay via gift card for concert tickets.",
      answer: 95,
      explanation: "Gift card payments are a massive red flag — scammers love them because they're untraceable! Never pay for anything with gift cards unless you're actually buying a gift card."
    },
    {
      id: 2,
      type: "scam",
      prompt: "You get a text saying 'Your Kela payment is on hold, click here to verify.' What do you do?",
      choices: ["Click the link immediately", "Call Kela directly to verify", "Reply to the text asking questions", "Share it with friends first"],
      correct: 1,
      explanations: [
        "Nope! Never click links in unexpected messages. Scammers create fake Kela sites to steal your info.",
        "Perfect! Kela will never text you links like this. Always verify through official channels.",
        "Don't engage! Scammers can use your reply to target you more.",
        "Don't risk your friends falling for it. Report it instead!"
      ]
    },
    {
      id: 3,
      type: "trueFalse",
      prompt: "True or False: If a deal seems too good to be true (like 90% off designer shoes), it probably is.",
      correct: true,
      explanation: "Absolutely true! Scammers use unbelievable deals to lure victims. Always research the site, check reviews, and compare prices before buying."
    },
    {
      id: 4,
      type: "scam",
      prompt: "You're at S-Market and see a deal: Buy €100 gift cards, get €20 free. Your friend says to load up. Smart move?",
      choices: ["Buy as many as possible", "Buy one to test it", "Check if you'll actually use them", "Skip it completely"],
      correct: 2,
      explanations: [
        "Whoa there! Only buy gift cards if you know you'll use them. Otherwise it's just tying up your money.",
        "Better, but still risky if you forget to use it. Gift cards often expire or get lost.",
        "Exactly! Gift card deals only make sense if you shop there regularly. Otherwise you're just giving them an interest-free loan.",
        "Not necessarily skip it, but definitely think it through first."
      ]
    },
    {
      id: 5,
      type: "slider",
      prompt: "Rate the risk 0–100: Clicking a link in an email about a package delivery you weren't expecting from Posti.",
      answer: 90,
      explanation: "Super risky! These phishing emails try to steal your login info or install malware. Always go directly to Posti's official website or app if you're expecting something."
    },
    {
      id: 6,
      type: "scam",
      prompt: "A study abroad program DMs you on Instagram offering scholarships. They need a €50 'application fee' by tomorrow. What's your move?",
      choices: ["Pay quickly before the deadline", "Ignore it completely", "Research the program thoroughly first", "Ask them for more time"],
      correct: 2,
      explanations: [
        "Stop! Legitimate scholarships never require upfront fees or pressure you with tight deadlines.",
        "Safe choice, but you might miss real opportunities. Better to investigate first.",
        "Perfect! Real programs will have official websites, reviews, and won't pressure you. Scams rush you into paying.",
        "Real programs will give extensions. But fake ones will keep pressuring you. Best to verify first."
      ]
    },
    {
      id: 7,
      type: "trueFalse",
      prompt: "True or False: In Finland, student apartments from official organizations (like HOAS) are safer than random Facebook listings.",
      correct: true,
      explanation: "100% true! Official student housing organizations are regulated and safe. Facebook/Craigslist listings can be scams — always verify through official channels and never pay deposits to 'landlords' you haven't met in person."
    },
    {
      id: 8,
      type: "slider",
      prompt: "Rate the risk 0–100: A new friend you met online asks to borrow €200 for an 'emergency' and promises to pay back next week.",
      answer: 85,
      explanation: "Major red flag! This is a common scam. Real friends won't ask strangers for money, especially online. Scammers build quick 'friendships' to gain trust, then disappear with your cash."
    },
    {
      id: 9,
      type: "scam",
      prompt: "You see an ad for a part-time job: €500/week for simple online tasks, no experience needed. What should you do?",
      choices: ["Apply immediately", "Check if it's a legitimate company", "Ask for upfront payment", "Share with everyone you know"],
      correct: 1,
      explanations: [
        "Hold on! This screams scam. Legitimate jobs don't promise crazy money for 'simple tasks' with no experience.",
        "Smart! Research the company on Google, check reviews, look for a real website and contact info. Most 'too good to be true' jobs are scams or MLMs.",
        "You should never pay to work somewhere. That's a red flag!",
        "Don't spread potential scams! Verify it first."
      ]
    },
    {
      id: 10,
      type: "trueFalse",
      prompt: "True or False: If someone sends you money by accident and asks you to send it back, you should do it right away.",
      correct: false,
      explanation: "False! This is a common scam. Scammers send you money from a stolen account, ask you to 'return' it to them, then the original payment gets reversed (because it was fraudulent), and you lose your money. Report it to your bank instead."
    }
  ],
  facts: [
    "In Finland, a typical coffee at university campus café costs €2-3 — that's about €60/month if you buy one daily. Making coffee at home could save you €600/year!",
    "Student discounts in Finland can save you 50% on public transport, movies, and museums. Always ask 'Do you have a student discount?' — you'd be surprised how much you can save!",
    "The average Finnish student spends €800-900/month (including rent). About €350-450 goes to rent alone in major cities.",
    "Kela (Finnish Social Insurance Institution) provides study grants and housing supplements to students. Make sure you've applied for all benefits you're eligible for!",
    "S-Market, K-Market, and Lidl often have loyalty programs that give you discounts and points. These can add up to €10-20/month in savings if you shop smart!"
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
  
  // Initialize streak from localStorage and check if it should be reset
  const checkAndResetStreak = () => {
    const storedStreak = localStorage.getItem('currentStreak');
    const lastCompletionDate = localStorage.getItem('lastLessonCompletion');
    
    if (!lastCompletionDate || !storedStreak) {
      return 0;
    }
    
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastCompletion = new Date(lastCompletionDate);
    const yesterdayString = yesterday.toDateString();
    const lastCompletionString = lastCompletion.toDateString();
    const todayString = today.toDateString();
    
    // If last completion was today or yesterday, keep the streak
    if (lastCompletionString === todayString || lastCompletionString === yesterdayString) {
      return parseInt(storedStreak);
    }
    
    // Otherwise, streak is broken - reset to 0
    localStorage.setItem('currentStreak', '0');
    return 0;
  };
  
  const initialStreak = checkAndResetStreak();
  const initialXP = parseInt(localStorage.getItem('userXP') || '0');
  const [userData, setUserData] = useState({...initialData.user, streak: initialStreak, xp: initialXP});
  const [leaderboard, setLeaderboard] = useState(initialData.leaderboard);
  const [friendsLeaderboard, setFriendsLeaderboard] = useState(initialData.friendsLeaderboard);
  const [appData, setAppData] = useState(initialData);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'warning' | 'success' } | null>(null);
  const [crazyPaymentCount, setCrazyPaymentCount] = useState(0);
  const [chatMode, setChatMode] = useState<'type' | 'voice' | null>(null);
  const [currentLesson, setCurrentLesson] = useState<{ questions: any[]; facts: string[] } | null>(null);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [detailedHistory, setDetailedHistory] = useState<any[]>([]);

  const updateUserXP = (xpGain: number) => {
    setUserData(prev => {
      const newXP = prev.xp + xpGain;
      localStorage.setItem('userXP', newXP.toString());
      setLeaderboard(current => {
        const updated = current.map(user => 
          user.id === prev.id ? { ...user, xp: newXP } : user
        );
        return updated.sort((a, b) => b.xp - a.xp);
      });
      setFriendsLeaderboard(current => {
        const updated = current.map(user => 
          user.id === prev.id ? { ...user, xp: newXP } : user
        );
        return updated.sort((a, b) => b.xp - a.xp);
      });
      return { ...prev, xp: newXP };
    });
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastCompletionDate = localStorage.getItem('lastLessonCompletion');
    const storedStreak = localStorage.getItem('currentStreak');
    const currentStreak = storedStreak ? parseInt(storedStreak) : 0;
    
    // If already completed today, don't increment
    if (lastCompletionDate === today) {
      return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    let newStreak = currentStreak;
    
    if (!lastCompletionDate) {
      // First time completing
      newStreak = 1;
    } else if (lastCompletionDate === yesterdayString) {
      // Completed yesterday, increment streak
      newStreak = currentStreak + 1;
    } else {
      // Missed days, reset to 1
      newStreak = 1;
    }
    
    localStorage.setItem('currentStreak', newStreak.toString());
    setUserData(prev => ({ ...prev, streak: newStreak }));
  };

  const handleOnboardingComplete = (data: any) => {
    const updatedUserData = { ...userData, ...data };
    setUserData(updatedUserData);
    
    // Update leaderboards with new name
    if (data.name) {
      setLeaderboard(current => 
        current.map(user => user.id === userData.id ? { ...user, name: data.name } : user)
      );
      setFriendsLeaderboard(current =>
        current.map(user => user.id === userData.id ? { ...user, name: data.name } : user)
      );
    }
    
    if (data.skipChat) {
      setCurrentScreen('main');
    } else {
      setCurrentScreen('chatMode');
    }
  };

  const handleChatModeSelected = (mode: 'type' | 'voice') => {
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
    // Use sample lesson data when starting from Home
    const lesson = {
      questions: initialData.questions,
      facts: initialData.facts
    };
    setCurrentLesson(lesson);
    setCurrentScreen('lesson');
  };

  const handleStartAILesson = async (topic: string) => {
    setIsGeneratingLesson(true);
    setCurrentScreen('loading');
    
    try {
      const lessonData = await generateLesson(
        topic,
        userData.country || 'Finland',
        userData.role || 'student',
        userData
      );
      
      // Validate lesson data before setting
      if (!lessonData || !lessonData.questions || lessonData.questions.length === 0) {
        throw new Error('Invalid lesson data received');
      }
      
      setCurrentLesson({
        questions: lessonData.questions,
        facts: lessonData.facts || []
      });
      
      setCurrentScreen('lesson');
    } catch (error) {
      console.error('Failed to generate lesson:', error);
      setNotification({ 
        message: 'Failed to generate lesson. Please try again.', 
        type: 'warning' 
      });
      setTimeout(() => setNotification(null), 3000);
      setCurrentScreen('main');
      setActiveTab('learn');
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  const handleLessonComplete = (earnedXP: number, history: any[]) => {
    updateUserXP(earnedXP);
    updateStreak();
    
    // Add to detailed history (keep last 20 results)
    setDetailedHistory(prev => [...history, ...prev].slice(0, 20));
    
    // Save completion date for streak tracking
    const today = new Date().toDateString();
    const lastCompletionDate = localStorage.getItem('lastLessonCompletion');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    // Save the completion date
    localStorage.setItem('lastLessonCompletion', today);
    
    // Show appropriate message
    let message = `Awesome! +${earnedXP} XP — keep stacking that streak`;
    if (lastCompletionDate === yesterdayString) {
      message = `🔥 Streak continued! +${earnedXP} XP — you're on fire!`;
    } else if (!lastCompletionDate || lastCompletionDate !== yesterdayString) {
      message = `Great start! +${earnedXP} XP — complete another lesson tomorrow to build your streak!`;
    }
    
    setCurrentScreen('main');
    setNotification({ message, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCrazyPayment = (_amount: number, _category: string) => {
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
                    friendsLeaderboard={friendsLeaderboard}
                    pastResults={appData.pastResults}
                    detailedHistory={detailedHistory}
                    onStartLesson={handleStartLesson}
                  />
                )}
                {activeTab === 'learn' && (
                  <Learn 
                    userData={userData}
                    onStartLesson={handleStartAILesson}
                  />
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
          
          {currentScreen === 'lesson' && currentLesson && (
            <LessonView
              key="lesson"
              questions={currentLesson.questions}
              facts={currentLesson.facts}
              onComplete={handleLessonComplete}
              onBack={() => setCurrentScreen('main')}
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

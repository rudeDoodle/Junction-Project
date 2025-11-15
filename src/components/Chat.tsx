import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, SkipForward, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { getArpaResponse, type ConversationContext, type UserProfile } from '../services/aiService';

interface ChatProps {
  messages: any[];
  setMessages: (messages: any[]) => void;
  onComplete: () => void;
  userData: any;
  setUserData: (data: any) => void;
  chatMode: 'type' | 'voice' | 'mcq' | null;
}

export default function Chat({ messages, setMessages, onComplete, userData, chatMode }: ChatProps) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        sendInitialMessage();
      }, 500);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendInitialMessage = async () => {
    const userProfile: UserProfile = {
      age: userData.age,
      gender: userData.gender,
      experience: userData.experience,
      country: userData.country,
      role: userData.role
    };

    const context: ConversationContext = {
      userProfile,
      conversationHistory: []
    };

    setIsAIThinking(true);
    const arpaGreeting = await getArpaResponse(
      "Start the conversation by introducing yourself as Arpa and asking your first question to understand the user's financial literacy background. Keep it friendly and casual.",
      context
    );
    setIsAIThinking(false);

    setMessages([{
      id: 1,
      sender: 'arpa',
      text: arpaGreeting,
      timestamp: new Date()
    }]);
  };

  const handleSend = async (answer?: string) => {
    const responseText = answer || input.trim();
    if (!responseText || isAIThinking) return;

    const newMessages = [
      ...messages,
      {
        id: messages.length + 1,
        sender: 'user',
        text: responseText,
        timestamp: new Date()
      }
    ];
    setMessages(newMessages);
    setInput('');

    // Build conversation context
    const userProfile: UserProfile = {
      age: userData.age,
      gender: userData.gender,
      experience: userData.experience,
      country: userData.country,
      role: userData.role
    };

    const conversationHistory = messages.map(msg => ({
      role: msg.sender === 'arpa' ? 'assistant' : 'user' as 'user' | 'assistant',
      content: msg.text
    }));

    conversationHistory.push({
      role: 'user',
      content: responseText
    });

    const context: ConversationContext = {
      userProfile,
      conversationHistory
    };

    // Get AI response
    setIsAIThinking(true);
    const arpaResponse = await getArpaResponse(responseText, context);
    setIsAIThinking(false);

    const updatedMessages = [
      ...newMessages,
      {
        id: newMessages.length + 1,
        sender: 'arpa',
        text: arpaResponse,
        timestamp: new Date()
      }
    ];
    setMessages(updatedMessages);

    // Track question count and complete after 5-6 exchanges
    if (messages.length >= 10) {
      setTimeout(() => {
        setMessages([
          ...updatedMessages,
          {
            id: updatedMessages.length + 1,
            sender: 'arpa',
            text: "Perfect! I've got a great sense of where you're at. Give me a moment to prepare your personalized learning path... 🚀",
            timestamp: new Date()
          }
        ]);
        setTimeout(onComplete, 2000);
      }, 1000);
    }
  };

  const handleMicToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        const mockResponses = ["Somewhat confident", "Once or twice", "Very comfortable", "I'm trying to improve", "A little"];
        setInput(mockResponses[Math.floor(Math.random() * mockResponses.length)]);
      }, 2000);
    }
  };

  const handleSkip = () => {
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: 'arpa',
        text: "No problem! I'll set up a great starting point for you... 😊",
        timestamp: new Date()
      }
    ]);
    setTimeout(onComplete, 1500);
  };

  return (
    <div className="h-full bg-gradient-to-br from-teal-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="text-gray-900">Vatra</h3>
            <p className="text-gray-600 text-sm">AI Finance Guide</p>
          </div>
          <button
            onClick={handleSkip}
            className="ml-auto text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            Skip
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}
          {isAIThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-200 text-gray-900 shadow-sm rounded-lg px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
                <span>Arpa is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg">
        {chatMode === 'voice' ? (
          <div className="flex flex-col items-center gap-3">
            <motion.button
              onClick={handleMicToggle}
              animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
              className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                isRecording
                  ? 'bg-gradient-to-br from-red-500 to-pink-500'
                  : 'bg-gradient-to-br from-teal-500 to-cyan-500'
              } text-white shadow-lg`}
            >
              <Mic className="w-7 h-7" />
            </motion.button>
            <p className="text-gray-600 text-sm">
              {isRecording ? 'Listening...' : 'Tap to speak'}
            </p>
            {input && (
              <div className="w-full flex items-center gap-2">
                <div className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-900">
                  {input}
                </div>
                <Button
                  onClick={() => handleSend()}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white h-10 w-10 rounded-md p-0 shadow-md"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your answer..."
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-400"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white h-12 w-12 rounded-md p-0 shadow-md disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
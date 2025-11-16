import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, SkipForward, Edit3, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { generatePersonalizedQuestions } from '../services/gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatProps {
  messages: any[];
  setMessages: (messages: any[]) => void;
  onComplete: () => void;
  userData: any;
  setUserData: (data: any) => void;
  chatMode: 'type';
  mode?: 'onboarding' | 'freeChat';
  onBack?: () => void;
}

export default function Chat({ messages, setMessages, onComplete, userData, setUserData, mode = 'onboarding', onBack }: ChatProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [input, setInput] = useState('');
  const [chatQuestions, setChatQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherInput, setOtherInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Guard against corrupted histories from localStorage
  const safeMessages = Array.isArray(messages) ? messages : [];

  useEffect(() => {
    if (!Array.isArray(messages)) {
      console.warn('Resetting malformed chat history');
      setMessages([]);
    }
  }, [messages, setMessages]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questions = await generatePersonalizedQuestions(userData);
        setChatQuestions(questions);
        
        // Start with first question
        setTimeout(() => {
          const firstMessage = {
            id: 1,
            sender: 'arpa',
            text: questions[0].text,
            timestamp: new Date()
          };
          setMessages([firstMessage]);
          setIsLoadingQuestions(false);
        }, 500);
      } catch (error) {
        console.error('Failed to generate questions:', error);
        // Fallback to basic questions
        const fallbackQuestions = [
          { 
            id: 1, 
            text: "What's your gender?", 
            field: "gender",
            options: ["Male", "Female", "Non-binary", "Prefer not to say"]
          }
        ];
        setChatQuestions(fallbackQuestions);
        const firstMessage = {
          id: 1,
          sender: 'arpa',
          text: fallbackQuestions[0].text,
          timestamp: new Date()
        };
        setMessages([firstMessage]);
        setIsLoadingQuestions(false);
      }
    };

    // Only load questions for onboarding mode
    if (mode === 'onboarding' && safeMessages.length === 0) {
      loadQuestions();
    } else if (mode === 'freeChat' && safeMessages.length === 0) {
      // For free chat, start with a greeting if no messages
      const greetingMessage = {
        id: 1,
        sender: 'arpa',
        text: `Hey ${userData.name || 'there'}! I remember our last conversation. I know about your spending habits, your role as a ${userData.role}, and everything you've shared before. What would you like to talk about today?`,
        timestamp: new Date()
      };
      setMessages([greetingMessage]);
      setIsLoadingQuestions(false);
    } else if (mode === 'freeChat') {
      // Already has messages, just mark as loaded
      setIsLoadingQuestions(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [safeMessages.length]);

  const validateAnswer = async (answer: string, question: any): Promise<{ isValid: boolean; feedback?: string }> => {
    // Skip validation for choice questions or if answer is too short
    if (question.inputType === 'choice' || answer.length < 3) {
      return { isValid: true };
    }

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `You are a helpful AI assistant validating user responses in a financial literacy app.

QUESTION: ${question.text}
USER ANSWER: ${answer}

Your task: Determine if this answer is clearly wrong or nonsensical. Only flag answers that are:
- Completely irrelevant to the question
- Contain gibberish or random characters
- Are obviously joke/troll answers
- Contain harmful or inappropriate content

Do NOT flag answers for:
- Grammar mistakes
- Informal language
- Different perspectives or opinions
- Reasonable estimates or approximations

Respond with JSON only:
{
  "isValid": true/false,
  "feedback": "Brief friendly message asking them to try again (only if isValid is false)"
}

Example valid answers for "How much did you spend at Prisma?": "50", "around 30 euros", "maybe 25", "idk like 40?"
Example invalid answers: "asdfgh", "lol no", "your mom", "🤣🤣🤣"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const validation = JSON.parse(text);
      return validation;
    } catch (error) {
      console.error('Validation error:', error);
      return { isValid: true }; // Default to accepting on error
    }
  };

  const generateFreeChatResponse = async (userMessage: string, conversationHistory: any[]): Promise<string> => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Build context from conversation history
      const conversationContext = conversationHistory
        .slice(-6) // Last 6 messages for context
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Vatra'}: ${msg.text}`)
        .join('\n');

      const prompt = `You are Vatra, a friendly and knowledgeable AI financial advisor for young people. You have access to the user's complete financial profile and spending history.

USER PROFILE:
- Name: ${userData.name}
- Country: ${userData.country}
- Role: ${userData.role}
- Age: ${userData.age || 'Not specified'}
- Gender: ${userData.gender || 'Not specified'}
- Financial preparedness: ${userData.preparedness || 'Not specified'}

SPENDING CONTEXT:
You know about their spending habits, financial goals, and previous conversations. Be personalized and reference their specific situation when relevant.

CONVERSATION HISTORY:
${conversationContext}

USER'S LATEST MESSAGE: ${userMessage}

Respond naturally as Vatra. Keep responses:
- Friendly and conversational (use their name occasionally)
- Personalized based on their profile and context
- Actionable with practical financial advice when appropriate
- Brief (2-4 sentences max unless explaining something complex)
- Focused on youth finance topics relevant to their country and role

If they ask about their spending, reference that you have access to their transaction history and can help them analyze it.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Free chat response error:', error);
      return "I'm having trouble connecting right now. Could you try asking again?";
    }
  };

  const handleSend = async (answer?: string) => {
    const responseText = answer || input.trim() || otherInput.trim();
    if (!responseText || isLoadingQuestions || isValidating) return;

    const newMessages = [
      ...safeMessages,
      {
        id: safeMessages.length + 1,
        sender: 'user',
        text: responseText,
        timestamp: new Date()
      }
    ];
    setMessages(newMessages);
    
    setInput('');
    setOtherInput('');
    setShowOtherInput(false);

    // Handle free chat mode differently
    if (mode === 'freeChat') {
      setIsValidating(true);
      
      const aiResponse = await generateFreeChatResponse(responseText, newMessages);
      
      const aiMessage = {
        id: newMessages.length + 1,
        sender: 'arpa',
        text: aiResponse,
        timestamp: new Date()
      };
      setMessages([...newMessages, aiMessage]);
      setIsValidating(false);
      return;
    }

    // Onboarding mode logic
    const currentQuestion = chatQuestions[currentQuestionIndex];

    // Validate the answer with AI
    setIsValidating(true);
    const validation = await validateAnswer(responseText, currentQuestion);
    setIsValidating(false);

    if (!validation.isValid) {
      // Add validation feedback message
      const feedbackMessage = {
        id: safeMessages.length + 1,
        sender: 'arpa',
        text: validation.feedback || "Hmm, that doesn't quite make sense. Could you try answering again?",
        timestamp: new Date()
      };
      setMessages([...safeMessages, feedbackMessage]);
      return;
    }
    
    // Save the answer
    const updatedUserData = { ...userData };
    updatedUserData[currentQuestion.field] = responseText;
    setUserData(updatedUserData);

    setTimeout(() => {
      if (currentQuestionIndex < chatQuestions.length - 1) {
        const nextQuestion = chatQuestions[currentQuestionIndex + 1];
        const nextMessage = {
          id: newMessages.length + 1,
          sender: 'arpa',
          text: nextQuestion.text,
          timestamp: new Date()
        };
        setMessages([...newMessages, nextMessage]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        const completionMessage = {
          id: newMessages.length + 1,
          sender: 'arpa',
          text: "Perfect! I've learned a lot about you. Give me a moment to create your personalized learning path...",
          timestamp: new Date()
        };
        setMessages([...newMessages, completionMessage]);
        
        setTimeout(onComplete, 2000);
      }
    }, 300);
  };



  const handleSkip = () => {
    setMessages([
      ...safeMessages,
      {
        id: safeMessages.length + 1,
        sender: 'arpa',
        text: "No problem! I'll set up a great starting point for you...",
        timestamp: new Date()
      }
    ]);
    setTimeout(onComplete, 1500);
  };

  const currentQuestion = chatQuestions[currentQuestionIndex];

  if (isLoadingQuestions) {
    return (
      <div className="h-full bg-gradient-to-br from-teal-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl shadow-lg mx-auto mb-4 animate-pulse">
            🤖
          </div>
          <p className="text-gray-600">Preparing personalized questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-teal-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          {mode === 'freeChat' && onBack && (
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md relative">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="text-gray-900">Vatra</h3>
            <p className="text-gray-600 text-sm">
              {mode === 'freeChat' ? 'Your AI Finance Coach' : 'AI Finance Guide'}
            </p>
          </div>
          {mode === 'onboarding' && (
            <button
              onClick={handleSkip}
              className="ml-auto text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence>
          {safeMessages.map((message, index) => (
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
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg">
        {mode === 'freeChat' ? (
          // Free chat mode - always show text input
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about finances..."
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-400"
              disabled={isValidating}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isValidating}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white h-12 w-12 rounded-md p-0 shadow-md disabled:opacity-50"
            >
              {isValidating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        ) : currentQuestion ? (
          // Onboarding mode - show options or text input based on question type
          currentQuestion.inputType === 'choice' && currentQuestion.options ? (
            <div className="space-y-2">
              {currentQuestion.options.map((option: string) => (
                <button
                  key={option}
                  onClick={() => handleSend(option)}
                  disabled={isValidating}
                  className="w-full p-3 bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-md rounded-md text-gray-900 text-left transition-all disabled:opacity-50"
                >
                  {option}
                </button>
              ))}
              {/* Other option */}
              {!showOtherInput ? (
                <button
                  onClick={() => setShowOtherInput(true)}
                  className="w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 hover:shadow-md rounded-md text-gray-900 text-left transition-all flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Other (write your own)
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={otherInput}
                    onChange={(e) => setOtherInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your answer..."
                    className="flex-1 px-4 py-3 bg-white border-2 border-purple-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    autoFocus
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!otherInput.trim() || isValidating}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 w-12 rounded-md p-0 shadow-md disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
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
                disabled={!input.trim() || isValidating}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white h-12 w-12 rounded-md p-0 shadow-md disabled:opacity-50"
              >
                {isValidating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          )
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
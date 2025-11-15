import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, SkipForward, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { generatePersonalizedQuestions } from '../services/gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatProps {
  messages: any[];
  setMessages: (messages: any[]) => void;
  onComplete: () => void;
  userData: any;
  setUserData: (data: any) => void;
  chatMode: 'type' | 'voice' | null;
}

// ElevenLabs configuration
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'BlAlpGV1KY8jfuqWubtQ';

export default function Chat({ messages, setMessages, onComplete, userData, setUserData, chatMode }: ChatProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chatQuestions, setChatQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherInput, setOtherInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
          
          // Play TTS for the first message
          playTextToSpeech(questions[0].text);
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
        
        // Play TTS for the fallback message
        playTextToSpeech(fallbackQuestions[0].text);
      }
    };

    if (messages.length === 0) {
      loadQuestions();
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const playTextToSpeech = async (text: string) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setIsPlayingAudio(true);

      // Get ElevenLabs API key
      let apiKey = ELEVENLABS_API_KEY;
      if (!apiKey) {
        if (typeof window !== 'undefined' && (window as any).ELEVEN_LABS_API_KEY) {
          apiKey = (window as any).ELEVEN_LABS_API_KEY;
        }
        if (!apiKey) {
          apiKey = localStorage.getItem('elevenlabs_api_key') || '';
        }
      }
      
      if (!apiKey) {
        console.log('No ElevenLabs API key found, skipping TTS');
        setIsPlayingAudio(false);
        return;
      }

      console.log('Converting text to speech:', text.substring(0, 50) + '...');

      // Use Rachel voice (popular female voice for conversational content)
      const voiceId = ELEVENLABS_VOICE_ID;
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('TTS API Error:', errorText);
        setIsPlayingAudio(false);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        console.error('Audio playback error');
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
      console.log('Playing TTS audio');

    } catch (error) {
      console.error('TTS error:', error);
      setIsPlayingAudio(false);
    }
  };

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

  const handleSend = async (answer?: string) => {
    const responseText = answer || input.trim() || otherInput.trim();
    if (!responseText || isLoadingQuestions || isValidating) return;

    const currentQuestion = chatQuestions[currentQuestionIndex];

    // Validate the answer with AI
    setIsValidating(true);
    const validation = await validateAnswer(responseText, currentQuestion);
    setIsValidating(false);

    if (!validation.isValid) {
      // Add validation feedback message
      const feedbackMessage = {
        id: messages.length + 1,
        sender: 'arpa',
        text: validation.feedback || "Hmm, that doesn't quite make sense. Could you try answering again?",
        timestamp: new Date()
      };
      setMessages([...messages, feedbackMessage]);
      
      // Play TTS for validation feedback
      playTextToSpeech(feedbackMessage.text);
      
      setInput('');
      setOtherInput('');
      setShowOtherInput(false);
      return;
    }

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
    
    // Save the answer
    const updatedUserData = { ...userData };
    updatedUserData[currentQuestion.field] = responseText;
    setUserData(updatedUserData);

    setInput('');
    setOtherInput('');
    setShowOtherInput(false);

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
        
        // Play TTS for the next question
        playTextToSpeech(nextQuestion.text);
      } else {
        const completionMessage = {
          id: newMessages.length + 1,
          sender: 'arpa',
          text: "Perfect! I've learned a lot about you. Give me a moment to create your personalized learning path...",
          timestamp: new Date()
        };
        setMessages([...newMessages, completionMessage]);
        
        // Play TTS for the completion message
        playTextToSpeech(completionMessage.text);
        
        setTimeout(onComplete, 2000);
      }
    }, 300);
  };

  const handleMicToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        const mockResponses = ["Somewhat confident", "Once or twice", "Very comfortable", "I'm trying to improve", "A little"];
        setInput(mockResponses[currentQuestionIndex] || "Sample response");
      }, 2000);
    }
  };

  const handleSkip = () => {
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
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
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md relative">
            <span className="text-xl">🤖</span>
            {isPlayingAudio && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <div>
            <h3 className="text-gray-900">Vatra</h3>
            <p className="text-gray-600 text-sm">
              {isPlayingAudio ? '🔊 Speaking...' : 'AI Finance Guide'}
            </p>
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
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg">
        {chatMode === 'type' && currentQuestion ? (
          // For text mode, show options if available, otherwise show text input
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
        ) : chatMode === 'voice' ? (
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
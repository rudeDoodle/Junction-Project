import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import QuestionCard from './QuestionCard';
import { evaluateTextAnswer } from '../services/gemini';

// ElevenLabs configuration
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'BlAlpGV1KY8jfuqWubtQ';

interface LessonViewProps {
  questions: any[];
  facts: string[];
  onComplete: (earnedXP: number, history: any[]) => void;
  onBack: () => void;
  userData?: any;
}

export default function LessonView({ questions, facts, onComplete, onBack, userData = {} }: LessonViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const correctSoundRef = useRef<HTMLAudioElement>(null);
  const wrongSoundRef = useRef<HTMLAudioElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-read question when it changes if autoRead is enabled
  useEffect(() => {
    if (autoRead && !showFeedback && currentQuestion) {
      playTextToSpeech(currentQuestion.prompt);
    }
  }, [currentQuestionIndex, autoRead, showFeedback]);

  // Error handling for empty or invalid data
  if (!questions || questions.length === 0) {
    return (
      <div className="h-full bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md text-center"
        >
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-slate-900 mb-2">Oops!</h3>
          <p className="text-slate-700 mb-6">No questions available for this lesson.</p>
          <Button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white h-12 rounded-xl"
          >
            Go Back to Learn
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const totalXP = answers.reduce((sum, a) => sum + (a.xpEarned || 0), 0);

  const handleAnswer = async (answer: any) => {
    let isCorrect = false;
    let xpEarned = 0;
    let aiFeedback = '';

    // Handle text input with AI evaluation
    if (currentQuestion.type === 'textInput') {
      setIsEvaluating(true);
      try {
        const evaluation = await evaluateTextAnswer(
          currentQuestion.prompt,
          answer,
          currentQuestion.evaluationCriteria || 'Evaluate based on accuracy and completeness',
          userData
        );
        
        xpEarned = evaluation.xpEarned;
        aiFeedback = evaluation.feedback;
        isCorrect = evaluation.score >= 70; // Consider 70+ as "correct"
      } catch (error) {
        console.error('AI evaluation failed:', error);
        // Fallback evaluation
        xpEarned = 15;
        aiFeedback = "Thanks for your thoughtful answer! Keep practicing to improve your financial knowledge.";
        isCorrect = true;
      } finally {
        setIsEvaluating(false);
      }
    } else if (currentQuestion.type === 'slider') {
      const difference = Math.abs(answer - currentQuestion.answer);
      isCorrect = difference <= 20;
      xpEarned = isCorrect ? 25 : (difference <= 40 ? 15 : 5);
    } else if (currentQuestion.type === 'scam') {
      isCorrect = answer === currentQuestion.correct;
      xpEarned = isCorrect ? 25 : 5;
    } else if (currentQuestion.type === 'trueFalse') {
      isCorrect = answer === currentQuestion.correct;
      xpEarned = isCorrect ? 25 : 5;
    } else if (currentQuestion.type === 'multiSelect') {
      // Calculate partial credit for multi-select
      const correctAnswers = currentQuestion.correct || [];
      const selectedAnswers = Array.isArray(answer) ? answer : [answer];
      
      // Count correct selections and incorrect selections
      const correctSelections = selectedAnswers.filter((a: number) => correctAnswers.includes(a)).length;
      const incorrectSelections = selectedAnswers.filter((a: number) => !correctAnswers.includes(a)).length;
      
      // Full credit if all correct and no incorrect
      if (correctSelections === correctAnswers.length && incorrectSelections === 0) {
        isCorrect = true;
        xpEarned = 25;
      } else {
        // Partial credit based on percentage correct
        const percentCorrect = correctSelections / correctAnswers.length;
        xpEarned = Math.max(5, Math.floor(25 * percentCorrect));
      }
    }

    setCurrentAnswer({ answer, isCorrect, xpEarned, aiFeedback });
    setShowFeedback(true);
    
    // Play sound effect
    if (isCorrect) {
      correctSoundRef.current?.play();
    } else {
      wrongSoundRef.current?.play();
      // Trigger shake animation
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleNext = () => {
    setAnswers([...answers, currentAnswer]);
    setShowFeedback(false);
    setCurrentAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleComplete = () => {
    const allAnswers = [...answers, currentAnswer].filter(a => a !== null);
    const finalXP = allAnswers.reduce((sum, a) => sum + (a.xpEarned || 0), 0);
    
    // Create detailed history for each question
    const history = allAnswers.map((ans, idx) => {
      const q = questions[idx];
      if (!q) return null;
      
      let userAnswerText = '';
      let correctAnswerText = '';
      
      if (q.type === 'textInput') {
        userAnswerText = ans.answer;
        correctAnswerText = 'Open-ended (AI evaluated)';
      } else if (q.type === 'slider') {
        userAnswerText = `${ans.answer}/100`;
        correctAnswerText = `${q.answer}/100`;
      } else if (q.type === 'scam') {
        userAnswerText = q.choices[ans.answer];
        correctAnswerText = q.choices[q.correct];
      } else if (q.type === 'trueFalse') {
        userAnswerText = ans.answer ? 'True' : 'False';
        correctAnswerText = q.correct ? 'True' : 'False';
      } else if (q.type === 'multiSelect') {
        const selected = Array.isArray(ans.answer) ? ans.answer : [ans.answer];
        userAnswerText = selected.map((i: number) => q.choices[i]).join(', ');
        const correct = Array.isArray(q.correct) ? q.correct : [q.correct];
        correctAnswerText = correct.map((i: number) => q.choices[i]).join(', ');
      }
      
      return {
        question: q.prompt,
        userAnswer: userAnswerText,
        correctAnswer: correctAnswerText,
        correct: ans.isCorrect,
        xp: ans.xpEarned,
        explanation: ans.aiFeedback || (q.type === 'scam' ? q.explanations[ans.answer] : q.explanation)
      };
    }).filter(h => h !== null);
    
    onComplete(finalXP, history);
  };

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

      console.log('Converting question to speech...');

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
      console.log('Playing question audio');

    } catch (error) {
      console.error('TTS error:', error);
      setIsPlayingAudio(false);
    }
  };

  if (showSummary) {
    const finalXP = totalXP + (currentAnswer?.xpEarned || 0);
    const correctCount = [...answers, currentAnswer].filter(a => a?.isCorrect).length;

    return (
      <div className="h-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-teal-600 text-center mb-2">Lesson Complete!</h2>
          <p className="text-slate-600 text-center mb-8">
            Nice work! You're getting bator at this 🎯
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border-2 border-teal-200">
              <div className="text-center">
                <p className="text-slate-600 mb-1">XP Earned</p>
                <p className="text-teal-600">+{finalXP}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-slate-900 mb-1">{correctCount}/{questions.length}</p>
                <p className="text-slate-600 text-sm">Correct</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-slate-900 mb-1">{Math.round((correctCount / questions.length) * 100)}%</p>
                <p className="text-slate-600 text-sm">Accuracy</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white h-12 rounded-xl"
            >
              Continue
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-b from-white to-slate-50 flex flex-col">
      {/* Audio elements */}
      <audio ref={correctSoundRef} src="/correct.mp3" preload="auto" />
      <audio ref={wrongSoundRef} src="/wrong-47985.mp3" preload="auto" />
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
          <span className="text-slate-600">Question {currentQuestionIndex + 1}/{questions.length}</span>
          <div className="w-10" />
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {!showFeedback ? (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              {/* Auto-Read Toggle Button */}
              <div className="mb-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newAutoRead = !autoRead;
                    setAutoRead(newAutoRead);
                    if (newAutoRead) {
                      playTextToSpeech(currentQuestion.prompt);
                    }
                  }}
                  className="gap-2"
                >
                  {autoRead ? (
                    <>
                      <Volume2 className="h-4 w-4 text-green-500" />
                      Auto-Read ON
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-4 w-4" />
                      Auto-Read OFF
                    </>
                  )}
                </Button>
              </div>
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                isEvaluating={isEvaluating}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`feedback-${currentQuestionIndex}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: isShaking ? [0, -10, 10, -10, 10, -5, 5, 0] : 0
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                x: { duration: 0.4, ease: "easeInOut" }
              }}
              className="space-y-6"
            >
              {/* Feedback */}
              <div className={`rounded-2xl p-6 border-2 ${
                currentAnswer.isCorrect
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                  : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {currentAnswer.isCorrect ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-orange-600" />
                  )}
                  <div>
                    <h3 className={currentAnswer.isCorrect ? 'text-green-900' : 'text-orange-900'}>
                      {currentAnswer.isCorrect ? 'Nice!' : 'Not quite'}
                    </h3>
                    <p className={`${currentAnswer.isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                      +{currentAnswer.xpEarned} XP
                    </p>
                  </div>
                </div>
                
                {/* Show AI feedback for text input OR correct answer for other types */}
                {currentQuestion.type === 'textInput' ? (
                  <div className="bg-white/50 rounded-lg p-4 border border-purple-300">
                    <p className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      AI Feedback
                    </p>
                    <p className="text-purple-800">{currentAnswer.aiFeedback}</p>
                  </div>
                ) : (
                  <>
                    {/* Show correct answer for non-text questions */}
                    {!currentAnswer.isCorrect && (
                      <div className="mb-4 p-3 bg-white/50 rounded-lg border border-orange-300">
                        <p className="text-sm font-semibold text-orange-900 mb-1">Correct answer:</p>
                        <p className="text-orange-800">
                          {currentQuestion.type === 'slider' 
                            ? `${currentQuestion.answer}/100`
                            : currentQuestion.type === 'scam'
                            ? currentQuestion.choices[currentQuestion.correct]
                            : currentQuestion.type === 'trueFalse'
                            ? (currentQuestion.correct ? 'True' : 'False')
                            : currentQuestion.type === 'multiSelect'
                            ? (Array.isArray(currentQuestion.correct) 
                                ? currentQuestion.correct.map((i: number) => currentQuestion.choices[i]).join(', ')
                                : currentQuestion.choices[currentQuestion.correct])
                            : 'N/A'
                          }
                        </p>
                      </div>
                    )}
                    
                    <p className="text-slate-700">
                      {currentQuestion.type === 'scam' 
                        ? currentQuestion.explanations[currentAnswer.answer]
                        : currentQuestion.explanation}
                    </p>
                  </>
                )}
              </div>

              {/* Fun Fact */}
              {currentAnswer.isCorrect && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="text-purple-900 mb-1">Fun fact</h4>
                      <p className="text-purple-700">
                        {facts[Math.floor(Math.random() * facts.length)]}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Next Button */}
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white h-12 rounded-xl"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

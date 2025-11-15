import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Sparkles, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import QuestionCard from './QuestionCard';

interface LessonViewProps {
  questions: any[];
  facts: string[];
  onComplete: (earnedXP: number) => void;
  onBack: () => void;
}

export default function LessonView({ questions, facts, onComplete, onBack }: LessonViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Error handling for empty or invalid data
  if (!questions || questions.length === 0) {
    return (
      <div className="h-full bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md text-center">
          <p className="text-slate-700 mb-4">Oops! No questions available for this lesson.</p>
          <Button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white h-12 rounded-xl"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const totalXP = answers.reduce((sum, a) => sum + a.xp, 0);

  const handleAnswer = (answer: any) => {
    let isCorrect = false;
    let xpEarned = 0;

    if (currentQuestion.type === 'slider') {
      const difference = Math.abs(answer - currentQuestion.answer);
      isCorrect = difference <= 20;
      xpEarned = isCorrect ? 25 : (difference <= 40 ? 15 : 5);
    } else if (currentQuestion.type === 'scam') {
      isCorrect = answer === currentQuestion.correct;
      xpEarned = isCorrect ? 25 : 5;
    } else if (currentQuestion.type === 'trueFalse') {
      isCorrect = answer === currentQuestion.correct;
      xpEarned = isCorrect ? 25 : 5;
    }

    setCurrentAnswer({ answer, isCorrect, xpEarned });
    setShowFeedback(true);
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
    const finalXP = answers.reduce((sum, a) => sum + a.xp, 0) + (currentAnswer?.xpEarned || 0);
    onComplete(finalXP);
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
            <button className="w-full flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <Share2 className="w-4 h-4" />
              Share on leaderboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-b from-white to-slate-50 flex flex-col">
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
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`feedback-${currentQuestionIndex}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
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
                
                <p className="text-slate-700">
                  {currentQuestion.type === 'scam' 
                    ? currentQuestion.explanations[currentAnswer.answer]
                    : currentQuestion.explanation}
                </p>
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

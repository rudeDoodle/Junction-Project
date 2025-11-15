import { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from './ui/slider';
import { Button } from './ui/button';

interface QuestionCardProps {
  question: any;
  onAnswer: (answer: any) => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<boolean | null>(null);

  // Handle missing or invalid question
  if (!question) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-200">
        <p className="text-slate-700">Question not available</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (question.type === 'slider') {
      onAnswer(sliderValue);
    } else if (question.type === 'scam' && selectedChoice !== null) {
      onAnswer(selectedChoice);
    } else if (question.type === 'trueFalse' && selectedTrueFalse !== null) {
      onAnswer(selectedTrueFalse);
    }
  };

  if (question.type === 'slider') {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-slate-900 mb-4">{question.prompt}</h2>
          <p className="text-slate-600">Use the slider to rate your answer</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200">
          <div className="text-center mb-6">
            <motion.div
              key={sliderValue}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="inline-block"
            >
              <span className="text-teal-600">{sliderValue}</span>
            </motion.div>
            <p className="text-slate-500 text-sm mt-2">Risk level (0 = safe, 100 = super risky)</p>
          </div>

          <Slider
            value={[sliderValue]}
            onValueChange={(value) => setSliderValue(value[0])}
            max={100}
            step={1}
            className="mb-8"
          />

          <div className="flex justify-between text-slate-500 text-sm">
            <span>0 - Safe</span>
            <span>100 - Risky</span>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white h-12 rounded-xl"
        >
          Submit Answer
        </Button>
      </div>
    );
  }

  if (question.type === 'scam') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-slate-900 mb-4">{question.prompt}</h2>
          <p className="text-slate-600">Choose the best option</p>
        </div>

        <div className="space-y-3">
          {question.choices.map((choice: string, index: number) => (
            <motion.button
              key={index}
              onClick={() => setSelectedChoice(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedChoice === index
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedChoice === index
                    ? 'border-teal-500 bg-teal-500'
                    : 'border-slate-300'
                }`}>
                  {selectedChoice === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-white rounded-full"
                    />
                  )}
                </div>
                <span className={selectedChoice === index ? 'text-teal-700' : 'text-slate-700'}>
                  {choice}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={selectedChoice === null}
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white h-12 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </Button>
      </div>
    );
  }

  if (question.type === 'trueFalse') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-slate-900 mb-4">{question.prompt}</h2>
          <p className="text-slate-600">Choose True or False</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.button
            onClick={() => setSelectedTrueFalse(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-6 rounded-xl border-2 text-center transition-all ${
              selectedTrueFalse === true
                ? 'border-green-500 bg-green-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="text-4xl mb-2">✓</div>
            <span className={`font-semibold ${selectedTrueFalse === true ? 'text-green-700' : 'text-slate-700'}`}>
              True
            </span>
          </motion.button>

          <motion.button
            onClick={() => setSelectedTrueFalse(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-6 rounded-xl border-2 text-center transition-all ${
              selectedTrueFalse === false
                ? 'border-red-500 bg-red-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="text-4xl mb-2">✗</div>
            <span className={`font-semibold ${selectedTrueFalse === false ? 'text-red-700' : 'text-slate-700'}`}>
              False
            </span>
          </motion.button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={selectedTrueFalse === null}
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white h-12 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </Button>
      </div>
    );
  }

  return null;
}

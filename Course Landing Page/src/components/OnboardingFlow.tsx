import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: any) => void;
}

const countries = ['Finland', 'Sweden', 'Norway', 'Denmark', 'Estonia', 'Other'];
const roles = ['Student', 'Teen', 'Adult'];
const preparednessLevels = [
  { value: 'beginner', label: 'Just starting out', desc: 'I know very little about managing money' },
  { value: 'learning', label: 'Learning the basics', desc: 'I understand some concepts but need more' },
  { value: 'confident', label: 'Pretty confident', desc: 'I handle my finances but want to improve' },
  { value: 'advanced', label: 'Very prepared', desc: 'Im comfortable with most financial topics' }
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedPreparedness, setSelectedPreparedness] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setTimeout(() => setStep(1), 300);
    }
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setTimeout(() => setStep(2), 300);
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setTimeout(() => setStep(3), 300);
  };

  const handlePreparednessSelect = (preparedness: string) => {
    setSelectedPreparedness(preparedness);
    setTimeout(() => setStep(4), 300);
  };

  const handlePersonalizationChoice = (choice: 'yes' | 'skip') => {
    if (isProcessing) return;
    setIsProcessing(true);

    console.log('[Onboarding] Personalization choice:', choice === 'yes' ? 'true' : 'false');

    const onboardingData = {
      name: userName.trim(),
      country: selectedCountry,
      role: selectedRole.toLowerCase(),
      preparedness: selectedPreparedness,
      skipChat: choice === 'skip',
      personalize: choice === 'yes'
    };

    console.log('[Onboarding] Complete data:', onboardingData);

    setTimeout(() => {
      onComplete(onboardingData);
    }, 100);
  };

  return (
    <div className="h-full bg-gradient-to-br from-teal-50 via-white to-purple-50 flex items-center justify-center px-6">
      <div className="w-full max-w-[382px]">
        <AnimatePresence mode="wait">
          {/* Question 0: Name */}
          {step === 0 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-gray-900 mb-3 text-left">What's your name?</h2>
              <p className="text-gray-600 mb-8 text-left">We'll use this to personalize your experience</p>
              
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                placeholder="Enter your name"
                className="w-full p-4 bg-white border-2 border-gray-200 focus:border-teal-400 focus:outline-none rounded-md text-gray-900 mb-4"
                autoFocus
              />
              
              <Button
                onClick={handleNameSubmit}
                disabled={!userName.trim()}
                className="w-full h-14 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Question 1: Country */}
          {step === 1 && (
            <motion.div
              key="country"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-gray-900 mb-3 text-left">Where are you from?</h2>
              <p className="text-gray-600 mb-8 text-left">This helps us personalize your experience</p>
              
              <div className="space-y-3">
                {countries.map((country) => (
                  <motion.button
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-md rounded-md text-gray-900 text-left transition-all"
                  >
                    {country}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Question 2: Role */}
          {step === 2 && (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-gray-900 mb-3 text-left">What describes you better?</h2>
              <p className="text-gray-600 mb-8 text-left">We'll tailor content to your stage of life</p>
              
              <div className="space-y-3">
                {roles.map((role) => (
                  <motion.button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-md rounded-md text-gray-900 text-left transition-all"
                  >
                    {role}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Question 3: Financial Preparedness */}
          {step === 3 && (
            <motion.div
              key="preparedness"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-gray-900 mb-3 text-left">How well-prepared financially are you?</h2>
              <p className="text-gray-600 mb-8 text-left">This helps us match you with the right content</p>
              
              <div className="space-y-3">
                {preparednessLevels.map((level) => (
                  <motion.button
                    key={level.value}
                    onClick={() => handlePreparednessSelect(level.value)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-md rounded-md text-left transition-all"
                  >
                    <div className="text-gray-900 font-medium mb-1">{level.label}</div>
                    <div className="text-gray-600 text-sm">{level.desc}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Question 4: Personalization */}
          {step === 4 && (
            <motion.div
              key="personalization"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-gray-900 mb-3 text-left">Let AI personalize your journey?</h2>
              <p className="text-gray-600 mb-2 text-left">Optional but recommended</p>
              <p className="text-gray-500 text-sm mb-8 text-left">
                Vatra will ask you a few quick questions to create lessons that match your needs
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => handlePersonalizationChoice('yes')}
                  disabled={isProcessing}
                  className="w-full h-14 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed justify-center"
                >
                  Yes, personalize with Vatra
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                
                <button
                  onClick={() => handlePersonalizationChoice('skip')}
                  disabled={isProcessing}
                  className="w-full h-14 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left px-4"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
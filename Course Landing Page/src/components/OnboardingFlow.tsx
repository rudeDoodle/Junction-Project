import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: any) => void;
}

const countries = ['Finland', 'Sweden', 'Norway', 'Denmark', 'Estonia', 'Other'];
const roles = ['Student', 'Teen', 'Adult'];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setTimeout(() => setStep(1), 300);
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setTimeout(() => setStep(2), 300);
  };

  const handlePersonalizationChoice = (choice: 'yes' | 'skip') => {
    if (isProcessing) return;
    setIsProcessing(true);

    console.log('[Onboarding] Personalization choice:', choice === 'yes' ? 'true' : 'false');

    const onboardingData = {
      country: selectedCountry,
      role: selectedRole.toLowerCase(),
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
          {/* Question 1: Country */}
          {step === 0 && (
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
          {step === 1 && (
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

          {/* Question 3: Personalization */}
          {step === 2 && (
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
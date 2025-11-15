import { motion } from 'framer-motion';
import { Button } from './ui/button';

interface WelcomeProps {
  onGetStarted: () => void;
}

export default function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div className="h-full bg-gradient-to-br from-teal-50 via-white to-purple-50 flex items-center justify-center px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md text-center"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <img 
              src="/news.png" 
              alt="Vatra Logo" 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-900 mb-4 tracking-tight"
        >
          Welcome to Vatra
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mb-12 leading-relaxed"
        >
          Your personalized guide to smarter money habits.
        </motion.p>

        {/* Get Started Button - Sharp edges, not pill-shaped */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={onGetStarted}
            className="w-full h-14 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-md shadow-lg shadow-teal-200/50 transition-all duration-200"
          >
            Get Started
          </Button>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-400 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.05, 0.08, 0.05]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400 rounded-full blur-[100px]"
          />
        </div>
      </motion.div>
    </div>
  );
}
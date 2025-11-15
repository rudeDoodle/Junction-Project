import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingAnimation() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center px-8"
      >
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-20 h-20 mx-auto mb-8"
        >
          <div className="w-full h-full border-4 border-gray-200 border-t-teal-500 rounded-md shadow-lg" />
        </motion.div>

        <h2 className="text-gray-900 mb-2">Preparing your personalized questions</h2>
        <p className="text-gray-600 mb-8">Analyzing your answers and crafting lessons just for you...</p>

        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-2 bg-gray-200 rounded-sm overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-gray-600 mt-3 text-sm">{progress}%</p>
        </div>

        {/* Floating particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-teal-500 rounded-sm"
            initial={{
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
              opacity: 0
            }}
            animate={{
              y: [null, Math.random() * -80 - 40],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.4
            }}
            style={{
              left: '50%',
              top: '35%'
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
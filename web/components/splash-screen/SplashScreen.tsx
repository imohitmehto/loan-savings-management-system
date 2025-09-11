'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const steps = [
      { delay: 0, step: 1 }, // Logo entrance
      { delay: 800, step: 2 }, // Company name
      { delay: 1200, step: 3 }, // Tagline
      { delay: 1600, step: 4 }, // Since text
      { delay: 3000, step: 5 }, // Exit
    ];

    const timeouts = steps.map(({ delay, step }) =>
      setTimeout(() => {
        if (step === 5) {
          onFinish();
        } else {
          setCurrentStep(step);
        }
      }, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-slate-50 to-slate-100"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full opacity-5 bg-blue-600" />
        <div className="absolute -bottom-8 -left-12 w-48 h-48 rounded-full opacity-5 bg-green-600" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={currentStep >= 1 ? { scale: 1, opacity: 1 } : {}}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
            duration: 0.8,
          }}
          className="relative"
        >
          <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl bg-white shadow-gray-900/20">
            {/* Replace with your actual logo */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
          </div>
        </motion.div>

        {/* Company Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={currentStep >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide mb-2 text-slate-800">
            Sanskar Malvi Swarnkar
          </h1>

          {/* Decorative Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={currentStep >= 2 ? { width: '100px' } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={currentStep >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="text-lg md:text-xl font-medium text-slate-600">
            Fintech Solutions & Trading
          </p>
        </motion.div>

        {/* Since Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={currentStep >= 4 ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="text-sm font-medium italic tracking-wide text-slate-500">
            Established Since 2013
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={currentStep >= 1 ? { opacity: 1 } : {}}
          className="flex space-x-1 mt-8"
        >
          {[0, 1, 2].map(index => (
            <motion.div
              key={index}
              animate={{
                y: [-2, 2, -2],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
              className="w-2 h-2 rounded-full bg-blue-600"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;

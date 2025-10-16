'use client';

import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { motion, Variants } from 'motion/react';

interface WelcomePopupProps {
  userName: string;
  onClose: () => void;
}

// Define animation variants for the popup
const toastVariants: Variants  = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    y: "40vh",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0, // Move to top position
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  wobble: {
    rotate: [0, -3, 3, -3, 3, -2, 2, 0], // Wobble sequence
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
      delay: 0.5, // Start wobbling
    },
  },
  exit: {
    opacity: 0,
    y: -100, // Exit by moving up
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
};

export default function WelcomePopup({ userName, onClose }: WelcomePopupProps) {
  // Set up the auto-dismiss timer
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const firstName = userName.split(' ')[0];

  return (
    <motion.div
      variants={toastVariants}
      initial="hidden"
      animate={['visible', 'wobble']} // Apply both animations in sequence
      exit="exit"
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center tracking-wide min-w-72 p-4 border rounded-lg shadow-lg bg-background"
    >
      <button
        onClick={onClose}
        className="absolute right-3 p-1 rounded-full hover:bg-muted"
      >
        <X className="size-4" />
      </button>
      <h4 className="pr-6">Welcome back, {firstName}👋</h4>
    </motion.div>
  );
}
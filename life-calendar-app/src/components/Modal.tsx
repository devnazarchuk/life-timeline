// life-calendar-app/src/components/Modal.tsx
'use client';

import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; // For animations

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // <AnimatePresence>
    //   {isOpen && (
        <div
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
          onClick={onClose} // Close on overlay click
        >
          <div
            // initial={{ scale: 0.9, opacity: 0 }}
            // animate={{ scale: 1, opacity: 1 }}
            // exit={{ scale: 0.9, opacity: 0 }}
            // transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-serif font-semibold text-gray-800 dark:text-white">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            {children}
          </div>
        </div>
    //   )}
    // </AnimatePresence>
  );
};

export default Modal;

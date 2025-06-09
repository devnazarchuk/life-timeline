// life-calendar-app/src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { format } from 'date-fns'; // For formatting date to YYYY-MM-DD

// Optional: Framer Motion for animations
// import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const { dob, setDob } = useUserStore();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // If DOB already exists, redirect to dashboard
    // This handles cases where user revisits the landing page
    // or if DOB was set from a previous session.
    if (dob) {
      router.push('/dashboard');
    }
  }, [dob, router]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleAgeSelect = (age: number) => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    // Set to Jan 1st of the birth year as a default
    const birthDate = new Date(birthYear, 0, 1);
    const formattedDate = format(birthDate, 'yyyy-MM-dd');
    setSelectedDate(formattedDate);
    // Automatically submit when an age is selected for quicker UX
    submitDob(formattedDate);
  };

  const handleSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (selectedDate) {
      submitDob(selectedDate);
    }
  };

  const submitDob = (dateToSave: string) => {
    setDob(dateToSave); // Save to Zustand store
    router.push('/dashboard'); // Redirect
  }

  const ageOptions = [10, 18, 25, 30, 40, 50];

  if (!isMounted) {
    // Avoid hydration mismatch by not rendering interactive elements until mounted
    // Or show a loading spinner
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pastel-blue via-pastel-pink to-pastel-green dark:from-gray-800 dark:via-gray-900 dark:to-black text-gray-800 dark:text-white">
      {/* Replace with Framer Motion component if desired */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-white dark:bg-dark-surface shadow-2xl rounded-lg w-full max-w-md text-center"
      > */}
      <div className="p-8 bg-white dark:bg-dark-surface shadow-2xl rounded-lg w-full max-w-md text-center">
        <h1 className="text-4xl font-serif mb-8">Welcome to Your Life Calendar</h1>
        <p className="mb-6 text-lg">
          Let's begin by setting your date of birth. This will help us create your personalized life grid.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="dob" className="block text-sm font-medium mb-2">
              Enter your Date of Birth:
            </label>
            <input
              type="date"
              id="dob"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pastel-blue focus:border-pastel-blue dark:bg-gray-700 dark:text-white"
              max={format(new Date(), 'yyyy-MM-dd')} // Prevent selecting future dates
            />
          </div>

          <div className="flex items-center justify-center">
            <span className="border-b border-gray-300 dark:border-gray-600 w-1/4"></span>
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">OR</span>
            <span className="border-b border-gray-300 dark:border-gray-600 w-1/4"></span>
          </div>

          <div>
            <p className="block text-sm font-medium mb-3">
              Select your approximate age:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {ageOptions.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => handleAgeSelect(age)}
                  className="p-3 bg-pastel-blue hover:bg-opacity-80 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors duration-150"
                >
                  {age} years
                </button>
              ))}
            </div>
          </div>

          {selectedDate && (
             <p className="text-sm text-gray-600 dark:text-gray-300">
               Selected Date: {format(new Date(selectedDate.replace(/-/g, '/')), 'MMMM d, yyyy')}
             </p>
          )}

          <button
            type="submit"
            disabled={!selectedDate}
            className="w-full p-3 bg-pastel-pink hover:bg-opacity-80 dark:bg-pink-600 dark:hover:bg-pink-700 text-white font-bold rounded-md shadow-lg transition-colors duration-150 disabled:bg-gray-300 dark:disabled:bg-gray-500"
          >
            View My Life Calendar
          </button>
        </form>
      {/* </motion.div> */}
      </div>
    </div>
  );
}

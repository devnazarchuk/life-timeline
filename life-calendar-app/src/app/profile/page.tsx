// life-calendar-app/src/app/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import type { UserProfile } from '@/types/calendar';
import ReactMarkdown from 'react-markdown';
// import { motion } from 'framer-motion'; // Optional for animations

const ProfilePage = () => {
  const { profile, updateProfile, dob } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);
  const [editMode, setEditMode] = useState(false); // To toggle between view and edit
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    bio: '',
    avatarUrl: '',
    markdownIntro: '',
  });

  useEffect(() => {
    setIsMounted(true);
    // Initialize formData with profile data from store once mounted
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
        markdownIntro: profile.markdownIntro || '',
      });
    }
  }, [profile]); // Rerun if profile data changes in store

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setEditMode(false); // Exit edit mode after saving
  };

  if (!isMounted || !dob) {
    // dob check ensures user has started the app
    // Or show a loading spinner / redirect if no DOB
    if (isMounted && !dob && typeof window !== 'undefined') {
        // window.location.href = '/'; // Or use router.push if preferred and available
        return <div className="p-4 text-center dark:text-white">Please set your Date of Birth on the homepage first.</div>;
    }
    return <div className="p-4 text-center dark:text-white">Loading profile...</div>;
  }

  const inputClass = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pastel-blue focus:border-pastel-blue dark:bg-gray-700 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    // <motion.div
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    //   className="container mx-auto p-4 md:p-8"
    // >
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif text-gray-800 dark:text-white">Your Profile</h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 text-sm font-medium text-white bg-pastel-blue hover:bg-opacity-80 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md shadow-sm"
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {!editMode ? (
        // View Mode
        <div className="space-y-8">
          {/* Simple Profile Section */}
          <section className="p-6 bg-white dark:bg-dark-surface shadow-lg rounded-lg">
            <div className="flex flex-col md:flex-row items-center md:space-x-6">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.name || 'User Avatar'}
                  className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 shadow-md"
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150/A7C7E7/FFFFFF?Text=Avatar')} // Fallback
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-pastel-blue flex items-center justify-center text-white text-4xl mb-4 md:mb-0 shadow-md">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{formData.name || 'Your Name'}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{formData.bio || 'Your bio goes here.'}</p>
              </div>
            </div>
          </section>

          {/* GitHub-style Profile Section - Markdown Intro */}
          <section className="p-6 bg-white dark:bg-dark-surface shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">About Me (Markdown)</h3>
            {formData.markdownIntro ? (
              <article className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{formData.markdownIntro}</ReactMarkdown>
              </article>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No Markdown introduction set yet.</p>
            )}
          </section>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-dark-surface shadow-lg rounded-lg space-y-6">
          <div>
            <label htmlFor="name" className={labelClass}>Name:</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="bio" className={labelClass}>Bio:</label>
            <textarea name="bio" id="bio" rows={3} value={formData.bio} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="avatarUrl" className={labelClass}>Avatar URL:</label>
            <input type="url" name="avatarUrl" id="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className={inputClass} placeholder="https://example.com/avatar.png"/>
             {formData.avatarUrl && <img src={formData.avatarUrl} alt="Avatar Preview" className="mt-2 w-20 h-20 rounded-full object-cover"/>}
          </div>
          <div>
            <label htmlFor="markdownIntro" className={labelClass}>Markdown Introduction:</label>
            <textarea
              name="markdownIntro"
              id="markdownIntro"
              rows={10}
              value={formData.markdownIntro}
              onChange={handleChange}
              className={inputClass + " font-mono"}
              placeholder="Write about yourself using Markdown..."
            />
            <div className="mt-2 p-4 border dark:border-gray-600 rounded">
                <h4 className="text-sm font-semibold mb-2 dark:text-gray-300">Preview:</h4>
                <article className="prose dark:prose-invert max-w-none text-sm">
                    <ReactMarkdown>{formData.markdownIntro || "Start typing to see a preview..."}</ReactMarkdown>
                </article>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => { setEditMode(false); /* Reset formData if needed */ }} className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 text-white bg-pastel-pink hover:bg-opacity-80 dark:bg-pink-600 dark:hover:bg-pink-700 rounded-md shadow-sm">
              Save Profile
            </button>
          </div>
        </form>
      )}
    {/* </motion.div> */}
    </div>
  );
};

export default ProfilePage;

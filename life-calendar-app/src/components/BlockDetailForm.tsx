// life-calendar-app/src/components/BlockDetailForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import type { LifeBlockId, LifeBlockData } from '@/types/calendar';

interface BlockDetailFormProps {
  blockId: LifeBlockId;
  initialData?: Partial<LifeBlockData>;
  onSave: () => void;
  onClose: () => void;
}

const BlockDetailForm: React.FC<BlockDetailFormProps> = ({ blockId, initialData, onSave, onClose }) => {
  const { updateBlock, deleteBlock, getBlock } = useUserStore();

  // Initialize formState with initialData or defaults
  const [formState, setFormState] = useState<Partial<LifeBlockData>>({
    text: '',
    images: [],
    videos: [],
    spotify: [],
    visibility: 'private',
    ...initialData,
  });

  // Re-sync form if initialData or blockId changes (e.g. opening a new block)
  useEffect(() => {
    const currentBlockData = getBlock(blockId); // Fetch fresh data from store
    setFormState({
        text: '',
        images: [],
        videos: [],
        spotify: [],
        visibility: 'private',
        ...currentBlockData, // Prioritize store data
    });
  }, [blockId, getBlock]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'images' | 'videos' | 'spotify', index: number) => {
    const newValue = e.target.value;
    setFormState(prev => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = newValue;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'images' | 'videos' | 'spotify') => {
    setFormState(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
  };

  const removeArrayItem = (field: 'images' | 'videos' | 'spotify', index: number) => {
    setFormState(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBlock(blockId, formState);
    onSave(); // Typically closes modal and might refresh grid data if needed
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
      deleteBlock(blockId);
      onSave(); // Close modal and refresh
    }
  };

  const inputClass = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pastel-blue focus:border-pastel-blue dark:bg-gray-700 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="text" className={labelClass}>Reflections / Notes (Markdown supported):</label>
        <textarea
          id="text"
          name="text"
          rows={5}
          value={formState.text}
          onChange={handleChange}
          className={inputClass + " min-h-[100px]"}
          placeholder="What happened this week/month/year? What did you feel or learn?"
        />
      </div>

      {(['images', 'videos', 'spotify'] as const).map(field => (
        <div key={field}>
          <label className={labelClass}>{field.charAt(0).toUpperCase() + field.slice(1)} (URLs):</label>
          {(formState[field] || []).map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="url"
                value={item}
                onChange={(e) => handleArrayChange(e, field, index)}
                className={inputClass}
                placeholder={`Enter ${field.slice(0, -1)} URL ${index + 1}`}
              />
              <button type="button" onClick={() => removeArrayItem(field, index)} className="text-red-500 hover:text-red-700 p-1 rounded-md dark:text-red-400 dark:hover:text-red-300">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem(field)} className="text-sm text-pastel-blue hover:underline dark:text-blue-400 dark:hover:text-blue-300">+ Add {field.slice(0, -1)}</button>
        </div>
      ))}

      <div>
        <label htmlFor="visibility" className={labelClass}>Visibility:</label>
        <select
            name="visibility"
            id="visibility"
            value={formState.visibility}
            onChange={handleChange}
            className={inputClass}
        >
            <option value="private">Private (Only you)</option>
            <option value="public">Public (Shown in profile if applicable)</option>
            <option value="friends">Close Friends (Future feature)</option>
        </select>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md border border-red-300 dark:border-red-700"
        >
            Delete Entry
        </button>
        <div className="space-x-3">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-600"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-pastel-pink hover:bg-opacity-80 dark:bg-pink-600 dark:hover:bg-pink-700 rounded-md shadow-sm"
            >
                Save Changes
            </button>
        </div>
      </div>
    </form>
  );
};

export default BlockDetailForm;

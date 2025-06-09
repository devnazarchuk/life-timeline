// life-calendar-app/src/components/LifeGrid.tsx
'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { format, addWeeks, addMonths, addYears, differenceInMonths, differenceInYears } from 'date-fns';
import type { LifeBlockId } from '@/types/calendar';

interface TimeBlockProps {
  id: LifeBlockId;
  date: Date;
  isCurrent: boolean;
  isPast: boolean;
  onClick: () => void;
  onHover: (text: string | null) => void;
}

const TimeBlock: React.FC<TimeBlockProps> = ({ date, isCurrent, isPast, onClick, onHover }) => {
  return (
    <div
      className={`aspect-square rounded-sm transition-colors cursor-pointer ${
        isCurrent
          ? 'bg-yellow-400'
          : isPast
          ? 'bg-gray-800 dark:bg-gray-700'
          : 'bg-gray-200 dark:bg-gray-800'
      }`}
      onClick={onClick}
      onMouseEnter={() => onHover(format(date, 'PPP'))}
      onMouseLeave={() => onHover(null)}
      title={format(date, 'PPP')}
    />
  );
};

export default function LifeGrid() {
  const router = useRouter();
  const { dob, viewMode, setViewMode } = useUserStore();
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const currentBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    if (!dob) {
      router.push('/');
    }
  }, [dob, router]);

  useEffect(() => {
    if (currentBlockRef.current) {
      currentBlockRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [viewMode, dob]);

  const blocks = useMemo(() => {
    if (!dob) return [];

    const birthDate = new Date(dob);
    const today = new Date();
    const blocks = [];

    if (viewMode === 'weeks') {
      const totalWeeks = 90 * 52; // 90 years in weeks
      for (let i = 0; i < totalWeeks; i++) {
        const blockDate = addWeeks(birthDate, i);
        const isPast = blockDate <= today;
        const isCurrent = blockDate.toDateString() === today.toDateString();
        
        blocks.push({
          id: `week_${Math.floor(i / 52)}_${i % 52}` as LifeBlockId,
          date: blockDate,
          isPast,
          isCurrent,
        });
      }
    } else if (viewMode === 'months') {
      const totalMonths = 90 * 12; // 90 years in months
      for (let i = 0; i < totalMonths; i++) {
        const blockDate = addMonths(birthDate, i);
        const isPast = blockDate <= today;
        const isCurrent = differenceInMonths(today, blockDate) === 0;
        
        blocks.push({
          id: `month_${Math.floor(i / 12)}_${i % 12}` as LifeBlockId,
          date: blockDate,
          isPast,
          isCurrent,
        });
      }
    } else {
      // years view
      for (let i = 0; i < 90; i++) {
        const blockDate = addYears(birthDate, i);
        const isPast = blockDate <= today;
        const isCurrent = differenceInYears(today, blockDate) === 0;
        
        blocks.push({
          id: `year_${i}` as LifeBlockId,
          date: blockDate,
          isPast,
          isCurrent,
        });
      }
    }

    return blocks;
  }, [dob, viewMode]);

  if (!isClient || !dob) {
    return <div className="flex justify-center items-center min-h-screen"><p>Loading...</p></div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Life Calendar
          </h1>
          <div className="flex space-x-2">
            {(['weeks', 'months', 'years'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-md ${
                  viewMode === mode
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {tooltip && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-md shadow-lg">
            {tooltip}
          </div>
        )}

        <div className="grid grid-cols-52 gap-1">
          {blocks.map((block) => (
            <div key={block.id} ref={block.isCurrent ? currentBlockRef : null}>
              <TimeBlock
                {...block}
                onClick={() => console.log('Clicked', block.id)}
                onHover={setTooltip}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

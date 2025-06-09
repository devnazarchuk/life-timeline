// life-calendar-app/src/components/LifeGrid.tsx
'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import {
  differenceInWeeks,
  eachWeekOfInterval,
  startOfYear,
  endOfYear,
  addYears,
  format,
  isPast,
  isFuture,
  isSameWeek,
  parseISO,
  eachMonthOfInterval,
  isSameMonth,
  eachYearOfInterval,
  isSameYear,
  getYear,
  getISOWeek,
  getMonth
} from 'date-fns';
import type { LifeBlockId } from '@/types/calendar';

const TOTAL_YEARS = 90;

interface TimeBlockProps {
  id: LifeBlockId;
  date: Date;
  mode: ViewMode;
  isCurrent: boolean;
  isPastBlock: boolean;
  onClick: () => void;
  onHover: (tooltip: string | null) => void;
}

type ViewMode = 'weeks' | 'months' | 'years';

const TimeBlock: React.FC<TimeBlockProps> = ({ id, date, mode, isCurrent, isPastBlock, onClick, onHover }) => {
  let bgColor = 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'; // Future
  if (isCurrent) {
    bgColor = 'bg-yellow-400 dark:bg-yellow-500 animate-pulse';
  } else if (isPastBlock) {
    bgColor = 'bg-gray-800 dark:bg-black hover:bg-gray-700 dark:hover:bg-gray-900';
  }

  const getTooltipText = () => {
    if (mode === 'weeks') return `Week of ${format(date, 'MMM d, yyyy')} (W${getISOWeek(date)}, ${getYear(date)})`;
    if (mode === 'months') return `${format(date, 'MMMM yyyy')}`;
    if (mode === 'years') return `${format(date, 'yyyy')}`;
    return '';
  };

  let squareSizeClasses = "w-4 h-4"; // Default for weeks
  if (mode === 'months') squareSizeClasses = "w-8 h-8"; // Larger for months
  if (mode === 'years') squareSizeClasses = "w-12 h-12"; // Even larger for years


  return (
    <div
      id={id}
      className={`border border-gray-300 dark:border-gray-600 ${squareSizeClasses} ${bgColor} transition-colors duration-150 cursor-pointer`}
      onClick={onClick}
      onMouseEnter={() => onHover(getTooltipText())}
      onMouseLeave={() => onHover(null)}
      title={getTooltipText()} // Basic HTML tooltip as fallback
    />
  );
};

export default function LifeGrid() {
  const router = useRouter();
  const { dob } = useUserStore();
  const [viewMode, setViewMode] = useState<ViewMode>('weeks');
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const currentDateRef = useRef(new Date()); // Keep current date stable for a render pass
  const currentBlockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (!dob) {
      router.push('/');
    }
  }, [dob, router]);

  useEffect(() => {
    // Scroll to current block if it exists
    if (currentBlockRef.current) {
      currentBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [viewMode, dob]); // Re-scroll if mode or DOB changes

  const birthDate = useMemo(() => {
    if (!dob) return null;
    // Safari compatibility: replace '-' with '/'
    const parts = dob.split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  }, [dob]);

  const timeBlocks = useMemo(() => {
    if (!birthDate) return [];

    const today = currentDateRef.current;
    const firstYearStart = startOfYear(birthDate);
    const lastYearEnd = endOfYear(addYears(firstYearStart, TOTAL_YEARS - 1));

    let blocks: Array<{ id: LifeBlockId; date: Date; isCurrent: boolean; isPastBlock: boolean }> = [];

    if (viewMode === 'weeks') {
      const allWeeks = eachWeekOfInterval({ start: firstYearStart, end: lastYearEnd }, { weekStartsOn: 1 /* Monday */ });
      blocks = allWeeks.map(weekDate => {
        const yearNum = getYear(weekDate);
        const weekNum = getISOWeek(weekDate);
        return {
          id: `week_${yearNum}_${weekNum}` as LifeBlockId,
          date: weekDate,
          isCurrent: isSameWeek(weekDate, today, { weekStartsOn: 1 }),
          isPastBlock: isPast(weekDate) && !isSameWeek(weekDate, today, { weekStartsOn: 1 }),
        };
      });
    } else if (viewMode === 'months') {
      const allMonths = eachMonthOfInterval({ start: firstYearStart, end: lastYearEnd });
      blocks = allMonths.map(monthDate => {
        const yearNum = getYear(monthDate);
        const monthNum = getMonth(monthDate) + 1; // 1-indexed
         return {
          id: `month_${yearNum}_${monthNum}` as LifeBlockId,
          date: monthDate,
          isCurrent: isSameMonth(monthDate, today),
          isPastBlock: isPast(monthDate) && !isSameMonth(monthDate, today),
        };
      });
    } else if (viewMode === 'years') {
      const allYears = eachYearOfInterval({ start: firstYearStart, end: lastYearEnd });
       blocks = allYears.map(yearDate => {
        const yearNum = getYear(yearDate);
        return {
          id: `year_${yearNum}_${yearNum}` as LifeBlockId, // year_YYYY_YYYY to keep similar structure
          date: yearDate,
          isCurrent: isSameYear(yearDate, today),
          isPastBlock: isPast(yearDate) && !isSameYear(yearDate, today),
        };
      });
    }
    return blocks;

  }, [birthDate, viewMode]);

  if (!isClient || !birthDate) {
    // Show loading or redirect handled by useEffect
    return <div className="flex justify-center items-center min-h-screen"><p>Loading or redirecting...</p></div>;
  }

  const gridClasses = {
    weeks: 'grid-cols-[repeat(52,minmax(0,1fr))]', // 52 columns for weeks
    months: 'grid-cols-[repeat(12,minmax(0,1fr))]', // 12 columns for months (per year section)
    years: 'grid-cols-[repeat(10,minmax(0,1fr))]', // 10 columns for years (per decade section)
  };

  const getGridWrapperClass = () => {
    if (viewMode === 'weeks') return 'grid grid-cols-[repeat(52,minmax(0,1fr))] gap-px';
    if (viewMode === 'months') return 'space-y-4'; // Years will be sections
    if (viewMode === 'years') return 'space-y-8'; // Decades will be sections
    return '';
  }

  const renderGridContent = () => {
    if (viewMode === 'weeks') {
        return timeBlocks.map(block => (
            <div key={block.id} ref={block.isCurrent ? currentBlockRef : null}>
                <TimeBlock {...block} mode={viewMode} onClick={() => console.log('Clicked', block.id)} onHover={setTooltip} />
            </div>
        ));
    }

    // For months and years, group by year/decade for better layout
    const groupedBlocks: { [groupKey: string]: typeof timeBlocks } = {};
    timeBlocks.forEach(block => {
        const year = getYear(block.date);
        const groupKey = viewMode === 'months' ? year.toString() : Math.floor(year / 10).toString() + "0s";
        if (!groupedBlocks[groupKey]) {
            groupedBlocks[groupKey] = [];
        }
        groupedBlocks[groupKey].push(block);
    });

    return Object.entries(groupedBlocks).map(([groupTitle, blocksInGroup]) => (
        <div key={groupTitle} className="mb-4">
            <h3 className="text-lg font-semibold my-2 dark:text-white">{viewMode === 'months' ? `Year ${groupTitle}` : `Decade ${groupTitle}`}</h3>
            <div className={`grid ${viewMode === 'months' ? gridClasses.months : gridClasses.years} gap-px`}>
                {blocksInGroup.map(block => (
                     <div key={block.id} ref={block.isCurrent ? currentBlockRef : null}>
                        <TimeBlock {...block} mode={viewMode} onClick={() => console.log('Clicked', block.id)} onHover={setTooltip} />
                    </div>
                ))}
            </div>
        </div>
    ));
  };


  return (
    <div className="container mx-auto p-4 relative">
      <h2 className="text-3xl font-serif mb-6 text-center dark:text-white">Your Life in {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</h2>

      <div className="flex justify-center space-x-2 mb-6">
        {(['weeks', 'months', 'years'] as ViewMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                        ${viewMode === mode ? 'bg-pastel-pink text-white dark:bg-pink-600' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'}`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {tooltip && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-black text-white p-2 rounded-md shadow-lg z-50 text-sm">
          {tooltip}
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        <div className={`${getGridWrapperClass()} bg-gray-200 dark:bg-gray-800 p-px`}>
          {renderGridContent()}
        </div>
      </div>

      <div className="mt-8 p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-3 dark:text-white">Legend:</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center"><div className="w-4 h-4 bg-gray-800 dark:bg-black mr-2 border border-gray-400"></div><span className="dark:text-gray-300">Past</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-yellow-400 dark:bg-yellow-500 mr-2 border border-gray-400"></div><span className="dark:text-gray-300">Current</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 mr-2 border border-gray-400"></div><span className="dark:text-gray-300">Future</span></div>
        </div>
      </div>
    </div>
  );
}

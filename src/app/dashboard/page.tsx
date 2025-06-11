"use client";
import { useLifeStore } from "../store/lifeStore";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format, addWeeks, isBefore, isSameWeek, parseISO, addMonths, addYears, isSameMonth, isSameYear, differenceInCalendarWeeks, differenceInCalendarYears } from "date-fns";
import BlockDetailModal from "./BlockDetailModal";
import SearchBar from "./SearchBar";
import { FaCalendarAlt } from "react-icons/fa";
import { LifeBlockId } from "../store/lifeStore";
import { VariableSizeList as List } from 'react-window';
import React from 'react';
import Image from "next/image";

function isLifeBlockId(id: string): id is LifeBlockId {
  return /^week_\d+_\d+$/.test(id) || /^month_\d+_\d+$/.test(id) || /^year_\d+$/.test(id);
}

type WeekBlock = { id: string; year: number; week: number; weekStart: Date; status: "past" | "current" | "future"; type: 'week' };
type MonthBlock = { id: string; year: number; month: number; monthStart: Date; status: "past" | "current" | "future"; type: 'month' };
type YearBlock = { id: string; year: number; yearStart: Date; status: "past" | "current" | "future"; type: 'year' };
type GridBlock = WeekBlock | MonthBlock | YearBlock;

// --- Додаємо режими перегляду ---
type ViewMode = 'grid' | 'timeline' | 'mosaic' | 'journal';

// Dashboard: 90 years x 52 weeks grid
export default function Dashboard() {
  const { userData } = useLifeStore();
  const router = useRouter();
  const [modal, setModal] = useState<string | null>(null);
  const [mode, setMode] = useState<'weeks' | 'months' | 'years'>('weeks');

  // Refs for each block for scroll/highlight
  const blockRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});
  const [highlighted, setHighlighted] = useState<string | null>(null);

  // --- Grid data for each mode, only real blocks, no empties ---
  const grid = useMemo(() => {
    if (!userData?.dob) return [];
    const dob = parseISO(userData.dob);
    const now = new Date();
    if (mode === 'weeks') {
      const end = addYears(dob, 90);
      const totalWeeks = differenceInCalendarWeeks(end, dob);
      return Array.from({ length: totalWeeks }, (_, i) => {
        const weekStart = addWeeks(dob, i);
        const year = differenceInCalendarYears(weekStart, dob);
        const weekOfYear = differenceInCalendarWeeks(weekStart, addYears(dob, year));
        let status: "past" | "current" | "future" = "future";
        if (isBefore(weekStart, now)) status = "past";
        if (isSameWeek(weekStart, now, { weekStartsOn: 1 })) status = "current";
        return {
          id: `week_${year}_${weekOfYear}`,
          year,
          week: weekOfYear,
          weekStart,
          status,
          type: 'week',
        } as WeekBlock;
      });
    } else if (mode === 'months') {
      return Array.from({ length: 90 * 12 }, (_, i) => {
        const year = Math.floor(i / 12);
        const month = i % 12;
        const monthStart = addMonths(dob, i);
        let status: "past" | "current" | "future" = "future";
        if (isBefore(monthStart, now)) status = "past";
        if (isSameMonth(monthStart, now)) status = "current";
        return {
          id: `month_${year}_${month}`,
          year,
          month,
          monthStart,
          status,
          type: 'month',
        } as MonthBlock;
      });
    } else if (mode === 'years') {
      return Array.from({ length: 90 }, (_, year) => {
        const yearStart = addYears(dob, year);
        let status: "past" | "current" | "future" = "future";
        if (isBefore(yearStart, now)) status = "past";
        if (isSameYear(yearStart, now)) status = "current";
        return {
          id: `year_${year}`,
          year,
          yearStart,
          status,
          type: 'year',
        } as YearBlock;
      });
    }
    return [];
  }, [userData, mode]);

  // --- Responsive grid: render all blocks, no virtualization ---
  // No JS columns/rows calculation needed, CSS grid handles it

  // --- Додаємо режими перегляду ---
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // --- Zoom state для Grid view ---
  const minBlockPx = mode === 'years' ? 24 : 12;
  const maxBlockPx = mode === 'years' ? 64 : 32;
  const defaultBlockPx = mode === 'years' ? 36 : 18;
  const [blockPx, setBlockPx] = useState(defaultBlockPx);

  // --- Scroll to Now ---
  const scrollToNow = useCallback(() => {
    const current = grid.find(b => b.status === 'current');
    if (current && blockRefs.current[current.id]) {
      blockRefs.current[current.id]?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      setHighlighted(current.id);
      setTimeout(() => setHighlighted(null), 2000);
    }
  }, [grid]);

  // --- Reset zoom on mode change ---
  useEffect(() => {
    setBlockPx(defaultBlockPx);
  }, [mode, defaultBlockPx]);

  // Redirect to landing if no DOB
  useEffect(() => {
    if (!userData?.dob) router.replace("/");
  }, [userData, router]);

  // Scroll to and highlight block
  const handleScrollToBlock = (blockId: string) => {
    const el = blockRefs.current[blockId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      setHighlighted(blockId);
      setTimeout(() => setHighlighted(null), 2000);
    }
  };

  // Legend for grid colors/icons
  const legend = [
    { label: "Past", color: "bg-gray-800/80 dark:bg-gray-200/80", icon: "🕰️" },
    { label: "Current", color: "bg-yellow-400", icon: "⭐" },
    { label: "Future", color: "bg-blue-100 dark:bg-blue-900", icon: "" },
  ];

  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);

  // --- Keyboard navigation for grid view ---
  useEffect(() => {
    if (viewMode !== 'grid' || !grid.length) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement && (document.activeElement as HTMLElement).tagName === 'INPUT') return;
      if (!focusedBlock) {
        if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Enter", " ", "Escape"].includes(e.key)) {
          setFocusedBlock(grid[0].id);
          e.preventDefault();
        }
        return;
      }
      const idx = grid.findIndex(b => b.id === focusedBlock);
      let nextIdx = idx;
      if (e.key === 'ArrowRight') nextIdx = Math.min(idx + 1, grid.length - 1);
      if (e.key === 'ArrowLeft') nextIdx = Math.max(idx - 1, 0);
      if (e.key === 'ArrowDown') {
        const cols = mode === 'weeks' ? 52 : mode === 'months' ? 12 : 10;
        nextIdx = Math.min(idx + cols, grid.length - 1);
      }
      if (e.key === 'ArrowUp') {
        const cols = mode === 'weeks' ? 52 : mode === 'months' ? 12 : 10;
        nextIdx = Math.max(idx - cols, 0);
      }
      if (nextIdx !== idx) {
        setFocusedBlock(grid[nextIdx].id);
        blockRefs.current[grid[nextIdx].id]?.focus();
        e.preventDefault();
      }
      if ((e.key === 'Enter' || e.key === ' ') && isLifeBlockId(focusedBlock)) {
        setModal(focusedBlock as LifeBlockId);
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        setFocusedBlock(null);
        setModal(null);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, grid, focusedBlock, mode]);

  if (!userData?.dob) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 via-pink-50/60 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <h2 className="text-3xl font-extrabold mb-4 mt-4 flex items-center gap-2"><FaCalendarAlt className="text-blue-400" /> Your Life in {mode.charAt(0).toUpperCase() + mode.slice(1)} <span className="animate-pulse">✨</span></h2>
      {/* View mode switcher */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'grid', label: '🟦 Grid' },
          { key: 'timeline', label: '🧾 Timeline' },
          { key: 'mosaic', label: '🧊 Mosaic' },
          { key: 'journal', label: '💬 Journal' },
        ].map(v => (
          <button
            key={v.key}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition border shadow bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg
              ${viewMode === v.key ? "bg-blue-500 text-white border-blue-500 shadow-lg" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-transparent hover:bg-blue-100 dark:hover:bg-blue-800"}`}
            onClick={() => setViewMode(v.key as ViewMode)}
          >
            {v.label}
          </button>
        ))}
      </div>
      {/* Mode toggle (weeks/months/years) тільки для Grid */}
      {viewMode === 'grid' && (
        <div className="flex gap-2 mb-4">
          {["weeks", "months", "years"].map(m => (
            <button
              key={m}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition border shadow bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg
                ${mode === m ? "bg-blue-500 text-white border-blue-500 shadow-lg" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-transparent hover:bg-blue-100 dark:hover:bg-blue-800"}`}
              onClick={() => setMode(m as 'weeks' | 'months' | 'years')}
            >
              {m === 'weeks' && '🗓️ Weeks'}
              {m === 'months' && '📅 Months'}
              {m === 'years' && '🌟 Years'}
            </button>
          ))}
        </div>
      )}
      <SearchBar onScrollToBlock={handleScrollToBlock} />
      {/* Legend */}
      {viewMode === 'grid' && (
        <div className="flex gap-6 mb-4 items-center justify-center">
          {legend.map(l => (
            <div key={l.label} className="flex items-center gap-2 text-sm">
              <span className={`inline-block w-4 h-4 rounded-full border shadow ${l.color}`}></span>
              <span className="text-lg">{l.icon}</span>
              <span className="text-gray-600 dark:text-gray-300">{l.label}</span>
            </div>
          ))}
        </div>
      )}
      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          {/* Zoom controls + Scroll to Now */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <button
                className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-lg font-bold hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                onClick={() => setBlockPx(px => Math.max(minBlockPx, px - 2))}
                title="Zoom out"
              >-</button>
              <input
                type="range"
                min={minBlockPx}
                max={maxBlockPx}
                value={blockPx}
                onChange={e => setBlockPx(Number(e.target.value))}
                className="mx-1 accent-blue-400 w-24"
                title="Zoom"
              />
              <button
                className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-lg font-bold hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                onClick={() => setBlockPx(px => Math.min(maxBlockPx, px + 2))}
                title="Zoom in"
              >+</button>
            </div>
            <button
              className="px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 font-semibold shadow hover:bg-yellow-300 transition flex items-center gap-1"
              onClick={scrollToNow}
              title="Scroll to current week/month/year"
            >
              <span>⭐</span> Now
            </button>
          </div>
          <div
            className="w-full flex flex-col items-center justify-center px-2 md:px-8 lg:px-16 xl:px-32"
          >
            <div
              className="grid gap-1 aspect-square mx-auto"
              style={{
                gridTemplateColumns:
                  mode === 'weeks'
                    ? 'repeat(52, minmax(0, 1fr))'
                    : mode === 'months'
                    ? 'repeat(12, minmax(0, 1fr))'
                    : 'repeat(10, minmax(0, 1fr))',
                width: '100%',
                maxWidth: '100vw',
                // height will be set by aspect-square
              }}
            >
              {grid.map((block) => {
                const isPast = block.status === "past";
                const isCurrent = block.status === "current";
                const isFuture = block.status === "future";
                const px = blockPx;
                const data = userData?.blocks[block.id as LifeBlockId];
                const isFocused = focusedBlock === block.id;
                return (
                  <TimeBlock
                    key={block.id}
                    block={block}
                    isCurrent={isCurrent}
                    isPast={isPast}
                    isFuture={isFuture}
                    highlighted={highlighted === block.id}
                    onClick={() => isLifeBlockId(block.id) ? setModal(block.id as unknown as LifeBlockId) : undefined}
                    onMouseEnter={() => setHighlighted(block.id)}
                    onMouseLeave={() => setHighlighted(null)}
                    px={px}
                    tags={data?.tags || []}
                    tooltip={
                      `${block.type === 'week' ? format(block.weekStart, "MMM d, yyyy") : block.type === 'month' ? format(block.monthStart, "MMM yyyy") : format(block.yearStart, "yyyy")}` +
                      `\n${block.type === 'week' ? `Year ${block.year}, Week ${block.week}` : block.type === 'month' ? `Year ${block.year}, Month ${block.month}` : `Year ${block.year}`}` +
                      (data?.tags?.length ? `\nTags: ${data.tags.join(", ")}` : "")
                    }
                    refEl={el => { blockRefs.current[block.id] = el; }}
                    tabIndex={0}
                    isFocused={isFocused}
                    onFocus={() => setFocusedBlock(block.id)}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="w-full flex flex-col items-center justify-center min-h-[40vh] p-2 md:p-8">
          {/* Timeline: вертикальний список, групування по роках */}
          <div className="w-full max-w-2xl mx-auto">
            <TimelineList blocks={grid} onBlockClick={blockId => isLifeBlockId(blockId) && setModal(blockId)} />
          </div>
        </div>
      )}
      {/* Mosaic View (заглушка) */}
      {viewMode === 'mosaic' && (
        <div className="w-full flex flex-col items-center justify-center min-h-[40vh] p-4">
          <MosaicGallery
            blocks={grid}
            onBlockClick={(blockId: string) => isLifeBlockId(blockId) && setModal(blockId)}
          />
        </div>
      )}
      {/* Journal View (заглушка) */}
      {viewMode === 'journal' && (
        <div className="w-full flex flex-col items-center justify-center min-h-[40vh] p-4">
          <JournalList
            blocks={grid}
            onBlockClick={(blockId: string) => isLifeBlockId(blockId) && setModal(blockId)}
          />
        </div>
      )}
      {/* Modal */}
      {modal && isLifeBlockId(modal) && (
        <BlockDetailModal blockId={modal} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

/* Add to global CSS or in this file */
// .hide-scrollbar::-webkit-scrollbar { display: none; }
// .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

// --- TimelineList компонент ---
type TimelineListProps = {
  blocks: GridBlock[];
  onBlockClick: (blockId: string) => void;
};

const TimelineList: React.FC<TimelineListProps> = ({ blocks, onBlockClick }) => {
  // Tag filter state
  const { userData } = useLifeStore();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // Get all blocks with tags/content
  const blocksWithTags = useMemo(() => {
    if (!userData?.blocks) return [];
    return blocks
      .map(b => {
        const data = userData.blocks[b.id as LifeBlockId];
        if (data && (data.text || (data.images && data.images.length) || (data.tags && data.tags.length))) {
          return { ...b, tags: data.tags || [] };
        }
        return null;
      })
      .filter(Boolean) as (GridBlock & { tags: string[] })[];
  }, [blocks, userData]);
  // Extract all unique tags
  const allTags = useMemo(() => Array.from(new Set(blocksWithTags.flatMap(b => b.tags || []))).sort(), [blocksWithTags]);
  // Filter by selected tags
  const filteredBlocks = useMemo(() => {
    if (!selectedTags.length) return blocks;
    return blocks.filter(b => {
      const data = userData?.blocks[b.id as LifeBlockId];
      if (!data) return false;
      return selectedTags.every(tag => data.tags?.includes(tag));
    });
  }, [blocks, selectedTags, userData]);

  // Групуємо блоки по роках
  const grouped = useMemo(() => {
    const byYear: { [year: number]: GridBlock[] } = {};
    filteredBlocks.forEach(b => {
      const y = b.type === 'year' ? b.year : b.year;
      if (!byYear[y]) byYear[y] = [];
      byYear[y].push(b);
    });
    // Only include years with at least one block
    return Object.entries(byYear).sort((a, b) => Number(a[0]) - Number(b[0]));
  }, [filteredBlocks]);

  // Для react-window: flat list of items (year header + blocks)
  const items: Array<{ type: 'year'; year: number } | { type: 'block'; block: GridBlock }> = [];
  grouped.forEach(([year, arr]) => {
    items.push({ type: 'year', year: Number(year) });
    arr.forEach(block => items.push({ type: 'block', block }));
  });

  // Висота елемента (header/block)
  const getItemSize = (idx: number) => items[idx].type === 'year' ? 44 : 72;

  return (
    <>
      <TagFilterBar
        tags={allTags}
        selected={selectedTags}
        onSelect={tag => setSelectedTags(sel => sel.includes(tag) ? sel.filter(t => t !== tag) : [...sel, tag])}
        onClear={() => setSelectedTags([])}
      />
      <List
        height={Math.min(600, items.length * 72 + grouped.length * 44)}
        itemCount={items.length}
        itemSize={getItemSize}
        width={"100%"}
        className="hide-scrollbar"
      >
        {({ index, style }: { index: number; style: React.CSSProperties }) => {
          const item = items[index];
          if (item.type === 'year') {
            return (
              <div style={style} className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-blue-100 dark:border-blue-900 px-4 py-2 font-bold text-blue-600 dark:text-blue-300 text-lg shadow-sm">
                {item.year}
              </div>
            );
          } else {
            const block = item.block;
            const isPast = block.status === "past";
            const isCurrent = block.status === "current";
            const isFuture = block.status === "future";
            const data = userData?.blocks[block.id as LifeBlockId];
            return (
              <div
                style={style}
                className={`group flex items-center gap-4 px-4 py-3 my-1 rounded-xl border shadow transition cursor-pointer
                  ${isPast ? "bg-gray-800/80 dark:bg-gray-200/80 border-gray-700 dark:border-gray-300" : ""}
                  ${isCurrent ? "bg-yellow-400 border-yellow-400 animate-pulse ring-2 ring-yellow-300" : ""}
                  ${isFuture ? "bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800" : ""}
                  hover:scale-[1.02] hover:shadow-2xl hover:ring-2 hover:ring-blue-300 active:scale-95 active:shadow-inner`}
                onClick={() => onBlockClick(block.id)}
              >
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-white/40 dark:bg-gray-800/40 text-2xl">
                  {isCurrent ? "⭐" : isPast ? "🕰️" : ""}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {block.type === 'week' && `${format(block.weekStart, "MMM d, yyyy")}`}
                    {block.type === 'month' && `${format(block.monthStart, "MMM yyyy")}`}
                    {block.type === 'year' && `${format(block.yearStart, "yyyy")}`}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {block.type === 'week' && `Year ${block.year}, Week ${block.week}`}
                    {block.type === 'month' && `Year ${block.year}, Month ${block.month}`}
                    {block.type === 'year' && `Year ${block.year}`}
                  </div>
                  {/* Tag chips */}
                  {data?.tags && data.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {data.tags.map(tag => (
                        <span key={tag} className="bg-blue-200 text-blue-800 px-1 py-0.5 rounded-full text-[10px]">#{tag}</span>
                      ))}
                    </div>
                  )}
                  {/* TODO: mini preview (media/text) */}
                </div>
              </div>
            );
          }
        }}
      </List>
    </>
  );
};

// --- JournalList component ---
type JournalListProps = {
  blocks: GridBlock[];
  onBlockClick: (blockId: string) => void;
};

// --- TagFilterBar component ---
type TagFilterBarProps = {
  tags: string[];
  selected: string[];
  onSelect: (tag: string) => void;
  onClear: () => void;
};

const TagFilterBar: React.FC<TagFilterBarProps> = ({ tags, selected, onSelect, onClear }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {tags.map(tag => (
      <button
        key={tag}
        className={`px-2 py-1 rounded-full text-xs font-semibold border transition
          ${selected.includes(tag)
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-transparent hover:bg-blue-100 dark:hover:bg-blue-800'}`}
        onClick={() => onSelect(tag)}
      >
        #{tag}
      </button>
    ))}
    {selected.length > 0 && (
      <button
        className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300"
        onClick={onClear}
      >
        Clear
      </button>
    )}
  </div>
);

const JournalList: React.FC<JournalListProps> = ({ blocks, onBlockClick }) => {
  const { userData } = useLifeStore();
  // Tag filter state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // Get all blocks with text (memories/notes)
  const blocksWithText = useMemo(() => {
    if (!userData?.blocks) return [];
    return blocks
      .map(b => {
        const data = userData.blocks[b.id as LifeBlockId];
        if (data?.text && data.text.trim().length > 0) return { ...b, text: data.text, images: data.images || [], tags: data.tags || [] };
        return null;
      })
      .filter(Boolean) as (GridBlock & { text: string; images: string[]; tags: string[] })[];
  }, [blocks, userData]);
  // Extract all unique tags
  const allTags = useMemo(() => Array.from(new Set(blocksWithText.flatMap(b => b.tags || []))).sort(), [blocksWithText]);
  // Filter by selected tags
  const filteredBlocks = useMemo(() => {
    if (!selectedTags.length) return blocksWithText;
    return blocksWithText.filter(b => selectedTags.every(tag => b.tags?.includes(tag)));
  }, [blocksWithText, selectedTags]);
  if (!blocksWithText.length) {
    return <div className="text-xl text-gray-400 dark:text-gray-500">No journal entries yet. Add some memories!</div>;
  }
  return (
    <>
      <TagFilterBar
        tags={allTags}
        selected={selectedTags}
        onSelect={tag => setSelectedTags(sel => sel.includes(tag) ? sel.filter(t => t !== tag) : [...sel, tag])}
        onClear={() => setSelectedTags([])}
      />
      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
        {filteredBlocks
          .sort((a, b) => {
            // Sort by date ascending
            const getDate = (block: GridBlock) =>
              block.type === "week" ? block.weekStart :
              block.type === "month" ? block.monthStart :
              block.type === "year" ? block.yearStart : new Date(0);
            return getDate(a).getTime() - getDate(b).getTime();
          })
          .map(block => (
            <div
              key={block.id}
              className="group rounded-xl border shadow-lg bg-white/60 dark:bg-gray-900/60 p-4 flex gap-4 items-start cursor-pointer hover:scale-[1.01] hover:shadow-2xl transition"
              onClick={() => onBlockClick(block.id)}
              title={block.text.slice(0, 100)}
            >
              {/* Date and optional image */}
              <div className="flex flex-col items-center min-w-[64px]">
                {block.images && block.images[0] && (
                  <Image src={block.images[0]} alt="Memory" width={48} height={48} className="w-12 h-12 object-cover rounded mb-1 shadow" loading="lazy" />
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {block.type === "week" && format(block.weekStart, "MMM d, yyyy")}
                  {block.type === "month" && format(block.monthStart, "MMM yyyy")}
                  {block.type === "year" && format(block.yearStart, "yyyy")}
                </span>
              </div>
              {/* Text preview */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
                  {block.text.split("\n")[0].slice(0, 64)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {block.text.split("\n").slice(1).join(" ").slice(0, 120)}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {block.tags?.map(tag => (
                    <span key={tag} className="bg-blue-200 text-blue-800 px-1 py-0.5 rounded-full text-[10px]">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

// --- MosaicGallery component ---
type MosaicGalleryProps = {
  blocks: GridBlock[];
  onBlockClick: (blockId: string) => void;
};

const MosaicGallery: React.FC<MosaicGalleryProps> = ({ blocks, onBlockClick }) => {
  const { userData } = useLifeStore();
  // Tag filter state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // Get all blocks with images
  const blocksWithImages = useMemo(() => {
    if (!userData?.blocks) return [];
    return blocks
      .map(b => {
        const data = userData.blocks[b.id as LifeBlockId];
        if (data?.images && data.images.length > 0) return { ...b, images: data.images, text: data.text || "", tags: data.tags || [] };
        return null;
      })
      .filter(Boolean) as (GridBlock & { images: string[]; text: string; tags: string[] })[];
  }, [blocks, userData]);
  // Extract all unique tags
  const allTags = useMemo(() => Array.from(new Set(blocksWithImages.flatMap(b => b.tags || []))).sort(), [blocksWithImages]);
  // Filter by selected tags
  const filteredBlocks = useMemo(() => {
    if (!selectedTags.length) return blocksWithImages;
    return blocksWithImages.filter(b => selectedTags.every(tag => b.tags?.includes(tag)));
  }, [blocksWithImages, selectedTags]);
  if (!blocksWithImages.length) {
    return <div className="text-xl text-gray-400 dark:text-gray-500">No images yet. Add some memories!</div>;
  }
  return (
    <>
      <TagFilterBar
        tags={allTags}
        selected={selectedTags}
        onSelect={tag => setSelectedTags(sel => sel.includes(tag) ? sel.filter(t => t !== tag) : [...sel, tag])}
        onClear={() => setSelectedTags([])}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full max-w-6xl">
        {filteredBlocks
          .sort((a, b) => {
            // Sort by date ascending
            const getDate = (block: GridBlock) =>
              block.type === "week" ? block.weekStart :
              block.type === "month" ? block.monthStart :
              block.type === "year" ? block.yearStart : new Date(0);
            return getDate(a).getTime() - getDate(b).getTime();
          })
          .map(block => (
            <div
              key={block.id}
              className="relative group rounded-xl overflow-hidden shadow-lg border border-blue-100 dark:border-blue-900 bg-white/40 dark:bg-gray-900/40 cursor-pointer transition hover:scale-105 hover:z-10"
              onClick={() => onBlockClick(block.id)}
              title={block.text?.slice(0, 100) || ""}
            >
              <Image
                src={block.images[0]}
                alt="Memory"
                width={128}
                height={128}
                className="w-full h-32 object-cover object-center transition group-hover:brightness-110 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs text-white opacity-0 group-hover:opacity-100 transition">
                {block.type === "week" && format(block.weekStart, "MMM d, yyyy")}
                {block.type === "month" && format(block.monthStart, "MMM yyyy")}
                {block.type === "year" && format(block.yearStart, "yyyy")}
                <div className="truncate">{block.text}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {block.tags?.map(tag => (
                    <span key={tag} className="bg-blue-200 text-blue-800 px-1 py-0.5 rounded-full text-[10px]">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

// --- Minimal, memoized TimeBlock ---
type TimeBlockProps = {
  block: GridBlock;
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
  highlighted: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  px: number;
  tags: string[];
  tooltip: string;
  refEl: (el: HTMLDivElement | null) => void;
  tabIndex?: number;
  isFocused?: boolean;
  onFocus?: () => void;
};

const TimeBlock = React.memo((props: TimeBlockProps) => {
  const { isCurrent, isPast, isFuture, highlighted, onClick, onMouseEnter, onMouseLeave, px, tags, tooltip, refEl, tabIndex = 0, isFocused = false, onFocus } = props;
  const color = isPast ? 'bg-gray-800/80 dark:bg-gray-200/80 border-gray-700 dark:border-gray-300'
    : isCurrent ? 'bg-yellow-400 border-yellow-400 animate-pulse scale-110 ring-2 ring-yellow-300'
    : isFuture ? 'bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800'
    : '';
  return (
    <div
      ref={refEl}
      className={`w-full h-full min-w-[${px}px] min-h-[${px}px] rounded-xl cursor-pointer border transition-all duration-200 shadow-lg backdrop-blur-md ${color} hover:scale-125 hover:shadow-2xl hover:ring-2 hover:ring-blue-300 focus:outline-none focus:ring-4 focus:ring-pink-300 active:scale-95 active:shadow-inner ${highlighted ? "ring-4 ring-blue-400 ring-offset-2" : ""} ${isFocused ? "ring-4 ring-pink-500 ring-offset-2 z-10" : ""}`}
      style={{ boxShadow: isCurrent ? "0 0 16px 4px #fde04788" : isPast ? "0 2px 8px #2224" : isFuture ? "0 1px 4px #3b82f680" : undefined, position: 'relative' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-label={tooltip}
      title={tooltip}
      onFocus={onFocus}
    >
      <span className="block w-full h-full flex items-center justify-center text-xs select-none pointer-events-none">
        {isCurrent ? "⭐" : ""}
      </span>
      {/* Tag chips in bottom right */}
      {tags && tags.length > 0 && (
        <div className="absolute bottom-1 right-1 flex gap-0.5" title={tags.join(", ")}> 
          {tags.slice(0, 2).map(tag => (
            <span key={tag} className="bg-blue-200 text-blue-800 px-1 py-0.5 rounded-full text-[9px] leading-none shadow">#{tag}</span>
          ))}
          {tags.length > 2 && <span className="bg-blue-300 text-blue-900 px-1 py-0.5 rounded-full text-[9px] leading-none shadow">+{tags.length - 2}</span>}
        </div>
      )}
    </div>
  );
});
TimeBlock.displayName = "TimeBlock"; 
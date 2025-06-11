"use client";
import { useState, useRef } from "react";
import { useLifeStore } from "../store/lifeStore";

interface SearchBarProps {
  onScrollToBlock: (blockId: string) => void;
}

export default function SearchBar({ onScrollToBlock }: SearchBarProps) {
  const { userData } = useLifeStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search blocks by date or content
  const handleSearch = () => {
    if (!userData) return;
    const q = query.trim().toLowerCase();
    if (!q) return setResults([]);
    // Date search (YYYY-MM-DD)
    if (/\d{4}-\d{2}-\d{2}/.test(q)) {
      const found = Object.keys(userData.blocks).find(id => id.includes(q));
      if (found) setResults([found]);
      else setResults([]);
      return;
    }
    // Content search
    const matches = Object.entries(userData.blocks)
      .filter(([, block]) =>
        block.text?.toLowerCase().includes(q) ||
        block.images?.some(img => img.toLowerCase().includes(q)) ||
        block.videos?.some(v => v.toLowerCase().includes(q)) ||
        block.spotify?.some(s => s.toLowerCase().includes(q))
      )
      .map(([id]) => id);
    setResults(matches);
  };

  return (
    <div className="flex flex-col gap-2 mb-4 w-full max-w-lg mx-auto">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 rounded border px-3 py-1 text-base bg-white dark:bg-gray-800 dark:text-white"
          placeholder="Search by date (YYYY-MM-DD) or content..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded" onClick={handleSearch}>Search</button>
      </div>
      {results.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {results.map(resultId => (
            <button
              key={resultId}
              className="bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded text-xs hover:scale-110 transition"
              onClick={() => onScrollToBlock(resultId)}
            >
              {resultId}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 
"use client";
import { useState, useRef, useMemo } from "react";
import { useLifeStore, LifeBlockId, LifeBlockData } from "../store/lifeStore";
import Image from "next/image";

interface BlockDetailModalProps {
  blockId: LifeBlockId;
  onClose: () => void;
}

const defaultBlock: LifeBlockData = {
  text: "",
  images: [],
  videos: [],
  spotify: [],
  visibility: "private",
  tags: [],
};

export default function BlockDetailModal({ blockId, onClose }: BlockDetailModalProps) {
  const { userData, updateBlock } = useLifeStore();
  const block = userData?.blocks[blockId] || defaultBlock;
  const [edit, setEdit] = useState(!block.text);
  const [text, setText] = useState(block.text);
  const [images, setImages] = useState<string[]>(block.images || []);
  const [videos, setVideos] = useState<string[]>(block.videos || []);
  const [spotify, setSpotify] = useState<string[]>(block.spotify || []);
  const [visibility, setVisibility] = useState<"public" | "private" | "friends">(block.visibility);
  const [tags, setTags] = useState<string[]>(block.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Tag suggestions logic
  const allTags = useMemo(() => {
    if (!userData?.blocks) return [];
    const tagCounts: Record<string, number> = {};
    Object.values(userData.blocks).forEach(b => {
      (b.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [userData]);
  const filteredSuggestions = useMemo(() => {
    if (!tagInput.trim()) return allTags.filter(tag => !tags.includes(tag)).slice(0, 8);
    return allTags.filter(tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag)).slice(0, 8);
  }, [allTags, tagInput, tags]);

  // Save block data
  const handleSave = () => {
    updateBlock(blockId, { text, images, videos, spotify, visibility, tags });
    setEdit(false);
  };

  // Delete block data
  const handleDelete = () => {
    updateBlock(blockId, { text: "", images: [], videos: [], spotify: [], visibility: "private", tags: [] });
    setText(""); setImages([]); setVideos([]); setSpotify([]); setVisibility("private"); setTags([]);
    setEdit(true);
  };

  // Add tag on Enter/comma/space
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", " "].includes(e.key) && tagInput.trim()) {
      const newTag = tagInput.trim().replace(/[, ]+$/, "");
      if (newTag && !tags.includes(newTag)) setTags([...tags, newTag]);
      setTagInput("");
      setShowSuggestions(false);
      e.preventDefault();
    }
  };

  // Remove tag
  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  // Add tag from suggestion
  const addTagFromSuggestion = (tag: string) => {
    if (!tags.includes(tag)) setTags([...tags, tag]);
    setTagInput("");
    setShowSuggestions(false);
  };

  // Handle image upload (base64 for now)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setImages(imgs => [...imgs, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInput.current) fileInput.current.value = "";
  };

  // Add YouTube video by URL
  const handleAddVideo = (url: string) => {
    if (!url) return;
    setVideos(vs => [...vs, url]);
  };

  // Add Spotify by URL/ID
  const handleAddSpotify = (url: string) => {
    if (!url) return;
    setSpotify(sp => [...sp, url]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={onClose}>✕</button>
        <h3 className="text-lg font-bold mb-2">Block: {blockId}</h3>
        <div className="mb-2 flex gap-2 items-center">
          <span className="text-xs text-gray-500">Visibility:</span>
          <select value={visibility} onChange={e => setVisibility(e.target.value as "public" | "private" | "friends")} className="rounded px-2 py-1 text-xs">
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends</option>
          </select>
        </div>
        {edit ? (
          <>
            <textarea
              className="w-full h-32 rounded border p-2 mb-2 reflection bg-white dark:bg-gray-800 dark:text-white"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write your memory, story, or reflection... (Markdown supported)"
            />
            <div className="mb-2 flex flex-wrap gap-2 items-center relative">
              {tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  #{tag}
                  <button type="button" className="ml-1 text-blue-400 hover:text-red-500" onClick={() => removeTag(tag)} title="Remove tag">×</button>
                </span>
              ))}
              <input
                type="text"
                className="rounded px-2 py-1 text-xs border w-24"
                placeholder="Add tag"
                value={tagInput}
                onChange={e => { setTagInput(e.target.value); setShowSuggestions(true); }}
                onKeyDown={handleTagInput}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
                autoComplete="off"
              />
              {/* Tag suggestions dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 top-8 z-20 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded shadow-lg w-32 max-h-40 overflow-auto">
                  {filteredSuggestions.map(tag => (
                    <div
                      key={tag}
                      className="px-2 py-1 text-xs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                      onMouseDown={() => addTagFromSuggestion(tag)}
                    >
                      #{tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-2">
              <input type="file" accept="image/*" multiple ref={fileInput} onChange={handleImageUpload} className="mb-1" />
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <Image key={i} src={img} alt="uploaded" width={48} height={48} className="w-12 h-12 object-cover rounded" />
                ))}
              </div>
            </div>
            <div className="mb-2 flex gap-2">
              <input type="text" placeholder="YouTube URL" className="rounded px-2 py-1 flex-1" onBlur={e => handleAddVideo(e.target.value)} />
              <input type="text" placeholder="Spotify URL/ID" className="rounded px-2 py-1 flex-1" onBlur={e => handleAddSpotify(e.target.value)} />
            </div>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded" onClick={handleSave}>Save</button>
              <button className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-1 rounded" onClick={() => setEdit(false)}>Cancel</button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded ml-auto" onClick={handleDelete}>Delete</button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-2 reflection whitespace-pre-wrap text-base min-h-[4rem]">{text || <span className="text-gray-400">No entry yet.</span>}</div>
            {tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2 items-center">
                {tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">#{tag}</span>
                ))}
              </div>
            )}
            {images.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {images.map((img, i) => (
                  <Image key={i} src={img} alt="uploaded" width={64} height={64} className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            )}
            {videos.map((url, i) => (
              <iframe key={i} src={url.replace("watch?v=", "embed/")} className="w-full h-40 rounded my-2" allowFullScreen />
            ))}
            {spotify.map((url, i) => (
              <iframe key={i} src={`https://open.spotify.com/embed/${url.split("/track/")[1] || url}`} className="w-full h-20 rounded my-2" allow="encrypted-media" />
            ))}
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded" onClick={() => setEdit(true)}>Edit</button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded ml-auto" onClick={handleDelete}>Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 
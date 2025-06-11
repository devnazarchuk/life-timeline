"use client";
import { useLifeStore } from "../store/lifeStore";
import { useState } from "react";
import { FaUser, FaBirthdayCake, FaThumbtack, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Image from "next/image";

export default function ProfilePage() {
  const { userData, setProfile } = useLifeStore();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(userData?.profile.name || "");
  const [bio, setBio] = useState(userData?.profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(userData?.profile.avatarUrl || "");
  const [markdownIntro, setMarkdownIntro] = useState(userData?.profile.markdownIntro || "");

  if (!userData) return <div className="p-8 text-center">No user data.</div>;

  // Save profile changes
  const handleSave = () => {
    setProfile({ name, bio, avatarUrl, markdownIntro });
    setEdit(false);
  };

  // Pinned/important: all public blocks with text
  const pinned = Object.entries(userData.blocks)
    .filter(([, b]) => b.visibility === "public" && b.text)
    .slice(0, 10);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100/60 via-pink-50/60 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="bg-white/60 dark:bg-gray-900/60 rounded-3xl shadow-2xl p-10 flex flex-col gap-6 items-center w-full max-w-md mt-8 border border-blue-100 dark:border-blue-900 backdrop-blur-lg ring-1 ring-blue-200/40 dark:ring-blue-900/30 animate-fadein">
        <h2 className="text-3xl font-extrabold mb-2 flex items-center gap-2"><FaUser className="text-blue-400" /> Profile</h2>
        <div className="flex flex-col items-center gap-2">
          {/* Avatar image, optimized with Next.js <Image> */}
          <Image
            src={avatarUrl || "/avatar.png"}
            alt="avatar"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 shadow-lg mb-2"
            priority
          />
          {edit ? (
            <input
              type="text"
              className="rounded px-2 py-1 text-sm w-full border border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-800/80"
              placeholder="Avatar URL"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
            />
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
          <FaBirthdayCake className="text-pink-400" />
          <span>Date of Birth:</span>
          <span className="font-mono text-blue-600 dark:text-blue-300">{userData.dob || <span className="text-gray-400">N/A</span>}</span>
        </div>
        {edit ? (
          <>
            <input
              type="text"
              className="rounded px-2 py-1 text-lg w-full mb-2 border border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-800/80"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <textarea
              className="rounded px-2 py-1 w-full mb-2 border border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-800/80"
              placeholder="Bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
            <textarea
              className="rounded px-2 py-1 w-full mb-2 reflection min-h-[80px] border border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-800/80"
              placeholder="Markdown intro (optional)"
              value={markdownIntro}
              onChange={e => setMarkdownIntro(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded flex items-center gap-1" onClick={handleSave}><FaSave /> Save</button>
              <button className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-1 rounded flex items-center gap-1" onClick={() => setEdit(false)}><FaTimes /> Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div className="text-xl font-semibold mb-1 flex items-center gap-2">{name || <span className="text-gray-400">No name</span>}</div>
            <div className="text-gray-600 dark:text-gray-300 mb-2">{bio || <span className="text-gray-400">No bio</span>}</div>
            {markdownIntro && (
              <div className="reflection bg-gray-50/80 dark:bg-gray-800/80 rounded p-2 w-full mb-2 whitespace-pre-wrap border border-blue-100 dark:border-blue-900">{markdownIntro}</div>
            )}
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded mt-2 flex items-center gap-1" onClick={() => setEdit(true)}><FaEdit /> Edit Profile</button>
          </>
        )}
        <div className="w-full mt-4">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><FaThumbtack className="text-yellow-400" /> Pinned Memories</h3>
          {pinned.length === 0 && <div className="text-gray-400">No public memories yet.</div>}
          <ul className="flex flex-col gap-2">
            {pinned.map(([id, b]) => (
              <li key={id} className="bg-blue-100/80 dark:bg-blue-900/80 rounded-xl p-3 flex flex-col gap-1 border border-blue-200 dark:border-blue-800 shadow">
                <div className="font-mono text-xs text-gray-500 mb-1 flex items-center gap-1"><FaThumbtack className="text-yellow-400" /> {id}</div>
                <div className="reflection whitespace-pre-wrap">{b.text.slice(0, 120)}{b.text.length > 120 ? "..." : ""}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 
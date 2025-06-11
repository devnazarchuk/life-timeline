"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLifeStore } from "./store/lifeStore";
import { FaBirthdayCake, FaMagic } from "react-icons/fa";

// Minimalist DOB entry page
export default function Landing() {
  const router = useRouter();
  const { userData, setUserData } = useLifeStore();
  const [dob, setDob] = useState("");
  const [showError, setShowError] = useState(false);

  // If DOB already exists, redirect to dashboard
  useEffect(() => {
    if (userData?.dob) router.replace("/dashboard");
  }, [userData, router]);

  // Handle DOB submit
  const handleSubmit = (date: string) => {
    if (!date) return setShowError(true);
    setUserData({
      dob: date,
      profile: { name: "", bio: "", avatarUrl: "" },
      blocks: {},
    });
    router.push("/dashboard");
  };

  // Quick age buttons
  const handleAge = (age: number) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - age);
    handleSubmit(d.toISOString().slice(0, 10));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="bg-white/60 dark:bg-gray-900/60 rounded-3xl shadow-2xl p-10 flex flex-col gap-6 items-center w-full max-w-xs border border-blue-100 dark:border-blue-900 backdrop-blur-lg ring-1 ring-blue-200/40 dark:ring-blue-900/30 animate-fadein">
        <h1 className="text-3xl font-extrabold text-center mb-2 flex items-center gap-2">
          <FaBirthdayCake className="text-pink-400" /> Welcome to <span className="text-blue-500">Life Timeline</span> <FaMagic className="text-yellow-400 animate-bounce" />
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-2">Enter your <span className="font-semibold">date of birth</span> to begin your journey ✨</p>
        <input
          type="date"
          className="w-full rounded border px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 dark:text-white"
          value={dob}
          onChange={e => { setDob(e.target.value); setShowError(false); }}
        />
        <button
          className="w-full bg-gradient-to-r from-blue-400 to-pink-400 hover:from-blue-500 hover:to-pink-500 text-white font-bold py-2 rounded-xl shadow-lg transition"
          onClick={() => handleSubmit(dob)}
        >
          Start
        </button>
        <div className="flex gap-2 flex-wrap justify-center mt-2">
          {[10, 20, 25, 30, 40, 50].map(age => (
            <button
              key={age}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full px-3 py-1 text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition shadow"
              onClick={() => handleAge(age)}
            >
              🎂 {age} yrs
            </button>
          ))}
        </div>
        {showError && <div className="text-red-500 text-sm mt-2">Please enter your date of birth</div>}
      </div>
    </div>
  );
}

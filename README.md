# Life Timeline

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A highly interactive, visual, and emotional life-tracking app. See your entire lifetime (up to 90 years) as a grid of weeks, months, or years. Reflect on your past, live more consciously, and plan for the future by associating memories, media, and stories with each moment of your life.

---

## ✨ Features
- **Landing Page:** Enter your date of birth or select age to start
- **Life Grid Dashboard:** 90x52 week grid (also months/years), color-coded for past/current/future
- **Block Detail Modal:** Add/edit text (Markdown), images, YouTube, Spotify, privacy per block
- **Search:** Find blocks by date or content, jump and highlight
- **Profile Page:** Avatar, name, bio, markdown intro, pinned public memories
- **Dark Mode:** Toggle anytime
- **All data stored locally:** No backend, everything in your browser (localStorage + Zustand)

---

## 🛠️ Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **State Management:** Zustand (with localStorage persistence)
- **Date Logic:** date-fns
- **Media Preview:** Native (images), YouTube/Spotify embeds
- **Animations:** Tailwind transitions (Framer Motion ready)

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### 3. Build for production
```bash
npm run build
npm start
```

---

## 📸 Screenshots

> _Add screenshots here_

---

## 📦 Data Storage
- All user data is stored in `localStorage` under the key `life_calendar_user`.
- State is managed with Zustand and synced automatically.
- No backend or cloud required.

---

## 📝 License
MIT

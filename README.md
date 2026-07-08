# 🎬 Hypertube

> A modern full-stack web application that lets users search for and stream videos via the BitTorrent protocol directly in the browser—with on-the-fly video transcoding.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Method 1: Running with Docker (Recommended)](#method-1-running-with-docker-recommended)
  - [Method 2: Running Locally](#method-2-running-locally)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Security](#security)
- [License](#license)

---

## Overview

Hypertube is a full-stack media platform. When a user selects a video, the server downloads it using the BitTorrent protocol and streams it to the web browser immediately. For video formats not natively supported by modern browsers (e.g., MKV, AVI), the backend performs real-time transcoding using FFmpeg to deliver a seamless streaming experience.

> ⚠️ Only royalty-free or legally distributable content is used (e.g., archive.org, legittorrents.info).

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Code Quality:** ESLint 9

### Backend
- **Framework:** Node.js + Express.js
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JWT + Passport.js (Local, 42 OAuth, Google OAuth)
- **Streaming & Torrents:** `torrent-stream` + `webtorrent`
- **Video Processing:** FFmpeg (`fluent-ffmpeg`)
- **Task Scheduler:** `node-cron` (auto-deleting cached torrents after 1 month)

### External APIs
- **TMDb / OMDb** — Movie metadata, ratings, and cover images
- **OpenSubtitles** — Automated subtitle downloading

---

## 📁 Project Structure

```text
hypertube/
├── backend/
│   ├── config/                  # Database & OAuth configs
│   ├── controllers/             # Request handlers
│   ├── docs/                    # API Documentation
│   ├── middlewares/             # JWT Auth & Upload guards
│   ├── models/                  # Mongoose Schemas (User, Movie, Comment)
│   ├── routes/                  # Express API endpoints
│   ├── services/                # Torrent, transcode, subtitles, and cleanup logic
│   ├── downloads/               # Cached video files
│   ├── subtitles/               # Cached subtitle files
│   ├── Dockerfile               # Backend container recipe
│   ├── server.js                # Entry point
│   └── package.json
├── frontend/
│   ├── app/                     # Next.js App Router Pages
│   │   ├── (marketing)/         # Public landing & static pages
│   │   ├── (onboarding)/        # Auth flows (login, sign-up)
│   │   └── (platform)/          # Main dashboard & video library
│   ├── core/                    # Reusable UI components & React Contexts
│   ├── public/                  # Static assets (images, icons)
│   ├── Dockerfile               # Frontend container recipe
│   └── package.json
├── docker-compose.yml           # Multi-container orchestration
└── Makefile                     # Orchestration helper commands
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have installed:
* [Docker & Docker Compose](https://www.docker.com/)
* [Node.js](https://nodejs.org/) v18+ (if running locally without Docker)
* [FFmpeg](https://ffmpeg.org/) (if running locally without Docker)

---

### Method 1: Running with Docker (Recommended)

You can manage the entire application using the root [Makefile](file:///Users/macuser/Documents/Work/Hyber_folder/hypertube/Makefile).

1. **Configure Environment Variables:**
   * Create a `.env` file in the `backend/` directory based on `backend/.env.example`.
   * Create a `.env` file in the `frontend/` directory based on `frontend/.env.example`.

2. **Run commands:**
   * **Start application:**
     ```bash
     make
     ```
     This builds and spins up both the frontend (on port `3001`) and the backend (on port `3000`) in the background.
   
   * **Watch logs:**
     ```bash
     make logs
     ```
   
   * **Check container status:**
     ```bash
     make status
     ```

   * **Stop services:**
     ```bash
     make down
     ```

---

### Method 2: Running Locally

If you prefer to run the services bare-metal without containerization:

#### 1. Start the Backend
```bash
cd backend
npm install
cp .env.exemple .env  # Update your credentials inside .env
npm run dev           # Runs server with nodemon
```
The server will start on [http://localhost:3000](http://localhost:3000).

#### 2. Start the Frontend
```bash
cd frontend
npm install
cp .env.example .env  # Update variables if needed
npm run dev           # Runs Next.js dev server
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## ✨ Features

### 👤 User Authentication & Profile
- Local registration and login with email verification.
- OAuth2 single sign-on (42 OAuth + Google OAuth).
- Secure password resets via email.
- Customizable profile settings (first name, last name, avatar image upload, and language choice).
- Public profile pages for other users.

### 🎞 Media Library
- Automated search across multiple legal torrent providers.
- Grid layout with infinite scroll pagination.
- Sort and filter results by name, genre, IMDb rating, release year, and watch status.
- Watched/unwatched indicators on movie cards.

### 📺 Video Player & Streaming
- Stream torrents directly while they are downloading.
- On-the-fly transcoding for non-browser-native formats (MKV, AVI, etc.) using FFmpeg.
- Subtitle synchronization with OpenSubtitles API.
- Live comment section per movie.
- Automated cleanup background cron job to prune torrent cache.

---

## 📡 API Documentation

| Module | Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | POST | `/auth/register` | Register new user | ❌ |
| | POST | `/auth/login` | Login and get token | ❌ |
| | POST | `/oauth/token` | Get OAuth2 token | ❌ |
| **Users** | GET | `/users` | Get all users | ✅ |
| | GET | `/users/:id` | Get user by ID | ✅ |
| | PATCH | `/users/:id` | Update profile information | ✅ |
| **Movies** | GET | `/movies` | Get top popular movies | ❌ |
| | GET | `/movies/:id` | Get movie details | ✅ |
| **Stream** | POST | `/stream/start` | Trigger movie torrent fetch | ✅ |
| | GET | `/stream/:movieId`| Stream video chunks | ✅ |
| **Subtitles**| GET | `/subtitles/:imdbId`| Get subtitles file | ✅ |
| **Comments** | GET | `/comments` | Get latest comments | ✅ |
| | POST | `/comments` | Post a comment | ✅ |
| | DELETE| `/comments/:id` | Delete a comment | ✅ |

---

## 🔒 Security

- **Cryptographic Hashing:** Passwords hashed securely using `bcryptjs`.
- **Session Tokens:** Secure JWT authorization headers.
- **SQL/NoSQL Injection Mitigation:** Input sanitization and Schema enforcement using Joi and Mongoose ODM.
- **XSS Prevention:** Escaped and sanitized text inputs on all user-facing comments and profiles.

---

## 📜 License

This project is part of the **42 school** curriculum. All video contents used are royalty-free or legally distributable.
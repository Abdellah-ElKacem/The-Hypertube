# 🎬 Hypertube

> A web application that lets you search for and stream videos using the BitTorrent protocol — directly in your browser.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Team](#team)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Security](#security)

---

## Overview

Hypertube is a full-stack web application where users can search for and watch royalty-free videos. When a user selects a video, the server downloads it via the BitTorrent protocol and streams it directly to the browser — no waiting for the full download to complete.

> ⚠️ Only royalty-free or legally distributable content is used (archive.org, legittorrents.info, etc.)

---

## 👥 Team

| Name     | Role                             |
| -------- | -------------------------------- |
| Member 1 | Backend — Auth & API             |
| Member 2 | Backend — Streaming & Torrent    |
| Member 3 | Frontend — UI & Library          |
| Member 4 | Frontend — Video Player & Search |

---

## 🛠 Tech Stack

### Backend

- **Node.js** + **Express.js** — REST API server
- **MongoDB** + **Mongoose** — Database
- **JWT** + **bcryptjs** — Authentication
- **FFmpeg** — Video transcoding (mkv → mp4)
- **torrent-stream** — Torrent downloading
- **node-cron** — Scheduled cleanup jobs

### Frontend

- To be defined by frontend team

### External APIs

- **TMDb / OMDb** — Movie metadata, ratings, cover images
- **OpenSubtitles** — Subtitle downloading
- **42 OAuth** + one additional OAuth provider

---

## ✨ Features

### 👤 User

- Register with email, username, first name, last name, password
- Login with username/password
- OAuth login (42 + one other provider)
- Password reset via email
- Edit profile (picture, email, info)
- View other users' public profiles
- Choose preferred language (default: English)

### 🎞 Library (authenticated only)

- Search videos from at least 2 legal torrent sources
- Results displayed as thumbnails sorted by name
- Default view shows most popular videos
- Each thumbnail shows: title, year, IMDb rating, cover image
- Watched / unwatched indicator on thumbnails
- Infinite scroll pagination (no load more button)
- Sort and filter by name, genre, rating, year

### 📺 Video Player (authenticated only)

- Full movie details: summary, cast, director, length, rating
- Torrent downloaded server-side, streamed immediately
- On-the-fly transcoding for non-browser-native formats (mkv, avi, etc.)
- Subtitle support (English default + user preferred language)
- Comment section per video
- Downloaded files cached and auto-deleted after 1 month unwatched

### 🔌 REST API (OAuth2)

- Full user management endpoints
- Movie listing and detail endpoints
- Comment CRUD endpoints
- OAuth2 token authentication

---

## 📁 Project Structure

```
hypertube/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js              # JWT protect middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js        # /auth/register, /auth/login
│   │   ├── userRoutes.js        # /users
│   │   ├── movieRoutes.js       # /movies
│   │   ├── streamRoutes.js      # /stream
│   │   ├── subtitleRoutes.js    # /subtitles
│   │   └── commentRoutes.js     # /comments
│   ├── services/
│   │   ├── torrentService.js    # torrent download management
│   │   ├── transcodeService.js  # ffmpeg conversion
│   │   ├── subtitleService.js   # subtitle fetching
│   │   └── cleanupService.js    # auto-delete old files
│   ├── downloads/               # cached video files
│   ├── subtitles/               # cached subtitle files
│   ├── .env                     # environment variables (not in git)
│   └── server.js
│
└── frontend/
    └── ...
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org) v18+
- [FFmpeg](https://www.gyan.dev/ffmpeg/builds/) (added to PATH)
- [Git](https://git-scm.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/hypertube.git
cd hypertube

# Install backend dependencies
cd backend
npm install

# Create your .env file
cp .env.example .env
# Fill in your values in .env

# Start the backend server
npm run dev
```

### Available Scripts

```bash
npm run dev     # Start with nodemon (auto-restart on save)
npm start       # Start in production mode
```

---

## 🔐 Environment Variables

Create a `.env` file in the `/backend` folder:

```bash
# Server
PORT=3000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hypertube

# Authentication
JWT_SECRET=your_very_long_random_secret_here

# OAuth - 42
FORTYTWO_CLIENT_ID=your_42_client_id
FORTYTWO_CLIENT_SECRET=your_42_client_secret

# OAuth - (your second provider e.g. Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# External APIs
TMDB_API_KEY=your_tmdb_api_key
OPENSUBTITLES_API_KEY=your_opensubtitles_api_key

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

---

## 📡 API Documentation

### Auth

| Method | Endpoint         | Description         | Auth |
| ------ | ---------------- | ------------------- | ---- |
| POST   | `/auth/register` | Register new user   | ❌   |
| POST   | `/auth/login`    | Login and get token | ❌   |
| POST   | `/oauth/token`   | Get OAuth2 token    | ❌   |

### Users

| Method | Endpoint     | Description    | Auth |
| ------ | ------------ | -------------- | ---- |
| GET    | `/users`     | Get all users  | ✅   |
| GET    | `/users/:id` | Get user by id | ✅   |
| PATCH  | `/users/:id` | Update user    | ✅   |

### Movies

| Method | Endpoint      | Description                 | Auth |
| ------ | ------------- | --------------------------- | ---- |
| GET    | `/movies`     | Get top movies (front page) | ❌   |
| GET    | `/movies/:id` | Get movie details           | ✅   |

### Stream

| Method | Endpoint           | Description            | Auth |
| ------ | ------------------ | ---------------------- | ---- |
| POST   | `/stream/start`    | Start torrent download | ✅   |
| GET    | `/stream/:movieId` | Stream video           | ✅   |

### Subtitles

| Method | Endpoint             | Description       | Auth |
| ------ | -------------------- | ----------------- | ---- |
| GET    | `/subtitles/:imdbId` | Get subtitle file | ✅   |

### Comments

| Method | Endpoint               | Description           | Auth |
| ------ | ---------------------- | --------------------- | ---- |
| GET    | `/comments`            | Get latest comments   | ✅   |
| GET    | `/comments/:id`        | Get one comment       | ✅   |
| POST   | `/comments`            | Post a comment        | ✅   |
| POST   | `/movies/:id/comments` | Post comment on movie | ✅   |
| PATCH  | `/comments/:id`        | Edit a comment        | ✅   |
| DELETE | `/comments/:id`        | Delete a comment      | ✅   |

---

## 🔒 Security

This project implements the following security measures:

- Passwords hashed with **bcryptjs** (never stored as plain text)
- **JWT tokens** for session management
- Protection against **SQL/NoSQL injection** via Mongoose
- **XSS protection** — all user inputs sanitized
- **Form validation** on all endpoints
- **File upload validation** — only allowed types accepted
- All credentials stored in `.env` and excluded from git

---

## 📜 License

This project is part of the **42 school** curriculum.
Only royalty-free or legally distributable video content is used.

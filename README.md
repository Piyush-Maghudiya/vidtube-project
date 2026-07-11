# 🎬 Vidtube: Premium Full-Stack Video Sharing Platform

Vidtube is a modern, premium, feature-rich YouTube-inspired video streaming and sharing platform. It features a stunning dark-mode cyberpunk/neon user interface on the frontend, backed by a robust, secure, and production-ready Express API with MongoDB.

This project is structured as a monorepo, keeping the **Frontend** and **Backend** decoupled and well-organized, making it easy to build, deploy, and scale.

---

## 🚀 Key Features

- 👤 **Secure User Authentication**: Secure login, registration, password updates, profile management, and token-based session validation (JWT with HTTP-only cookies).
- 📹 **Video Hosting & Streaming**: Upload videos and cover images, store metadata in MongoDB, and host files securely using Cloudinary.
- 💬 **Interactive Comments & Likes**: Fully functional comment threads and direct like/dislike interactions for videos, tweets, and comments.
- 📈 **Creator Studio & Dashboard**: A comprehensive dashboard displaying channel performance, subscriber counts, total views, like rates, and video upload statistics.
- 📑 **Playlists & Tweets**: Users can create/update playlists and post micro-blog "tweets" to interact with their subscribers.
- 🔔 **Subscriptions System**: Subscribe to channels, view subscription counts, and fetch a tailored feed of videos from subscribed creators.
- 🎨 **Premium Cyberpunk UI**: Sleek dark UI with vibrant neon accents, glassmorphic card designs, and fluid micro-animations powered by Tailwind CSS v4 and Framer Motion.
- 🔄 **Offline-Resilient Demo Mode**: Frontend automatically switches to rich mockup data if the backend server is offline, ensuring a smooth demo experience.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite** — High-performance frontend library and build tool.
- **Tailwind CSS v4** — Sleek utility-first styling with neon design systems.
- **Zustand** — Lightweight and clean global state management.
- **React Router v7** — Declarative routing with custom page transition hooks.
- **Framer Motion** — Smooth micro-interactions and page transitions.
- **Sonner** — Modern, clean toast notifications.
- **Axios** — Custom client instance configured with credentials and interceptors.

### Backend
- **Node.js** & **Express** — Flexible and fast REST API layer.
- **MongoDB** & **Mongoose** — Document database with schema modeling and pagination aggregates.
- **Cloudinary** — Professional cloud media pipeline for video and image optimization.
- **Multer** — Multipart form-data middleware for handling file uploads safely.
- **JWT (JSON Web Tokens)** — Secure stateless auth using Access and Refresh tokens.
- **Bcrypt** — Industry-standard password hashing.

---

## 📁 Repository Structure

```text
vidtube-fullstack-project/
├── backend/            # Express REST API & Database Models
│   ├── src/
│   │   ├── controllers/ # Request handlers & business logic
│   │   ├── db/          # Database connection settings
│   │   ├── middleware/  # Auth guards, upload validation (Multer)
│   │   ├── models/      # MongoDB (Mongoose) schemas
│   │   ├── routes/      # Express Router mappings
│   │   ├── utils/       # Utility classes (Cloudinary, ApiError)
│   │   └── app.js       # App configurations (CORS, Express JSON)
│   └── package.json
│
└── frontend/           # React + Vite Frontend App
    ├── src/
    │   ├── components/  # Reusable UI components & layouts
    │   ├── pages/       # Route-level views (Watch, Channel, Studio)
    │   ├── store/       # Zustand global stores (Auth, Video)
    │   ├── services/    # Axios HTTP request configurations
    │   └── data/        # Mock fallback data for demo purposes
    └── package.json
```

---

## ⚙️ Getting Started

Follow the steps below to run Vidtube locally:

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from the sample template:
   ```bash
   cp .env.sample .env
   ```
4. Open the newly created `.env` file and configure your credentials:
   - Your MongoDB Connection String.
   - Access & Refresh Token secrets.
   - Your Cloudinary cloud credentials (name, API key, and API secret).
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:8000`.

### 2. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   *(Ensure `VITE_API_URL` points to your backend: `http://localhost:8000`)*
4. Start the frontend dev server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 🔒 Security Best Practices Implemented

- **CORS Configuration**: Restricts access only to permitted client origins.
- **HTTP-Only Cookies**: JWT tokens are sent via HTTP-only, secure cookies, preventing XSS-based token theft.
- **Schema Validation**: Explicit Mongoose data types, indexes, and aggregate pipelines.
- **Secure File Cleanup**: Temporary uploads stored by Multer are unlinked immediately after successful/failed uploads to Cloudinary to save disk space and protect assets.

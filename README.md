# Events Media Platform

A full-stack web application for managing and sharing event media — built for **CIG, IIT Roorkee**. Members can upload photos/videos from events, discover their own photos using AI-powered face recognition, organize media into albums, and interact through likes, comments, and favourites.

---

## Features

- **Auth** — Register, login, JWT-protected routes, role-based access (admin / moderator / member)
- **Media Upload** — Upload photos and videos via Cloudinary
- **Face Recognition** — Upload a selfie; the app finds all event photos you appear in (powered by Face++ API)
- **Albums** — Organize media into named albums
- **Gallery** — Browse all event media with search and filters
- **Interactions** — Like, comment, favourite, and share media
- **Notifications** — Real-time notifications via Socket.io
- **Admin Panel** — User management, content moderation, activity feed
- **Dashboard** — Stats and recent activity overview

---

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router DOM
- Socket.io Client

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (media storage)
- Socket.io
- Face++ API (face recognition)

---

## Project Structure

```
├── frontend/         # React app (deployed on Vercel)
├── backend/          # Express API (deployed on Render)
```

---

## Environment Variables

### Backend (`/backend/.env`)

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FACEPP_API_KEY=
FACEPP_API_SECRET=
FRONTEND_URL=https://your-frontend.vercel.app
CLUB_NAME=CIG
```

### Frontend (`/frontend/.env`)

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account
- Face++ account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/events-media-platform.git
cd events-media-platform
```

### 2. Backend

```bash
cd backend
npm install
# create .env file and fill in the variables above
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
# create .env file with VITE_API_URL
npm run dev
```

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render (free tier) |
| Media Storage | Cloudinary |
| Face Recognition | Face++ API |
| Database | MongoDB Atlas |

> **Note:** Render's free tier spins down after inactivity — first request may take ~50 seconds.

---

## Face Recognition Flow

1. User uploads a reference selfie via the **My Photos** page
2. The selfie is stored on Cloudinary and linked to their account
3. On search, the backend calls the Face++ `/compare` endpoint for each event photo
4. Photos with a confidence score ≥ 75 are returned as matches
5. Cloudinary URL transformations are used to auto-resize images before sending to Face++ (keeping within the 2MB limit)

---

## Roles

| Role | Permissions |
|---|---|
| `member` | Upload, browse, interact with media |
| `moderator` | All member permissions + content moderation |
| `admin` | Full access including user management |

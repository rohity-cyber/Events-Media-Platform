# Events Media Platform — API Documentation

> Full-stack event media management platform built for **CIG, IIT Roorkee**.
> Upload photos/videos, discover yourself via AI face recognition, and interact in real time.

---

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Roles & Permissions](#roles--permissions)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Users](#users)
  - [Media](#media)
  - [Albums](#albums)
  - [Interactions](#interactions)
  - [Face Recognition](#face-recognition)
  - [Notifications](#notifications)
  - [Admin](#admin)
- [Socket.io Events](#socketio-events)
- [Data Models](#data-models)

---

## Overview

| Property | Value |
|---|---|
| Protocol | HTTPS / REST |
| Data Format | JSON |
| Auth Method | JWT Bearer Token |
| Real-time | Socket.io |
| Media Storage | Cloudinary |
| Face AI | Face++ API |
| Runtime | Node.js + Express |
| Database | MongoDB + Mongoose |

---

## Base URL

```
# Production
https://your-backend.onrender.com/api

# Local Development
http://localhost:5000/api
```

> **⚠️ Cold Start:** The backend is hosted on Render's free tier. The first request after inactivity may take up to ~50 seconds.

---

## Authentication

The API uses **JWT Bearer Token** authentication. Obtain a token by registering or logging in, then include it in every protected request.

```http
Authorization: Bearer <your_jwt_token>
```

Tokens are issued on login and registration. Role-based middleware restricts certain routes to `moderator` or `admin` roles.

---

## Roles & Permissions

| Role | Permissions |
|---|---|
| `member` | Upload media, browse gallery, like/comment/favourite/share, use face recognition, manage own profile |
| `moderator` | All member permissions + approve/reject uploads, remove content, access moderation dashboard |
| `admin` | Full access — user management, role assignment, content moderation, activity monitoring |

---

## Error Handling

All error responses return a JSON body with a `message` field.

| Status | Meaning | Common Cause |
|---|---|---|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created (user, media, album) |
| `400` | Bad Request | Missing or invalid fields |
| `401` | Unauthorized | Missing or expired JWT token |
| `403` | Forbidden | Insufficient role or ownership |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Email/username already registered |
| `500` | Server Error | Unhandled exception, DB or external API failure |

**Error response body:**

```json
{
  "message": "Token is not valid",
  "error": "jwt expired"
}
```

---

## Environment Variables

### Backend (`/backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | Required | Server port (default: `5000`) |
| `MONGODB_URI` | Required | MongoDB Atlas connection string |
| `JWT_SECRET` | Required | Secret key for signing JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Required | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Required | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Required | Cloudinary API secret |
| `FACEPP_API_KEY` | Required | Face++ API key |
| `FACEPP_API_SECRET` | Required | Face++ API secret |
| `FRONTEND_URL` | Required | Allowed CORS origin (e.g. `https://your-app.vercel.app`) |
| `CLUB_NAME` | Optional | Club name label (default: `CIG`) |

### Frontend (`/frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Required | Full backend URL (e.g. `https://your-backend.onrender.com`) |

---

## Endpoints

---

### Auth

All auth routes are **public** — no token required.

---

#### `POST /auth/register`

Register a new user account. Returns a JWT token on success. New users are assigned the `member` role by default.

**Request body:**

```json
{
  "name": "Rohit Kumar",
  "email": "rohit@iitr.ac.in",
  "password": "securepassword",
  "rollNumber": "21CE001"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Full name |
| `email` | string | ✅ | Unique email address |
| `password` | string | ✅ | Password (min 6 characters) |
| `rollNumber` | string | ➖ | Student roll number |

**Response `201 Created`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1f2c3...",
    "name": "Rohit Kumar",
    "email": "rohit@iitr.ac.in",
    "role": "member"
  }
}
```

---

#### `POST /auth/login`

Authenticate with email and password. Returns a JWT token.

**Request body:**

```json
{
  "email": "rohit@iitr.ac.in",
  "password": "securepassword"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | ✅ | Registered email address |
| `password` | string | ✅ | Account password |

**Response `200 OK`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1f2c3...",
    "name": "Rohit Kumar",
    "role": "member"
  }
}
```

---

#### `GET /auth/me`

🔒 **Auth required**

Returns the profile of the currently authenticated user.

**Response `200 OK`:**

```json
{
  "_id": "64a1f2c3...",
  "name": "Rohit Kumar",
  "email": "rohit@iitr.ac.in",
  "role": "member",
  "rollNumber": "21CE001",
  "profilePicture": "https://res.cloudinary.com/...",
  "createdAt": "2024-06-01T10:20:30Z"
}
```

---

### Users

---

#### `GET /users/:userId`

🔒 **Auth required**

Returns the public profile of a specific user.

| Parameter | Type | Description |
|---|---|---|
| `userId` | string | MongoDB ObjectId of the user |

---

#### `PUT /users/profile`

🔒 **Auth required**

Update the current user's own profile. All fields are optional.

**Request body (JSON):**

| Field | Type | Description |
|---|---|---|
| `name` | string | Display name |
| `bio` | string | Short about text |
| `rollNumber` | string | Student roll number |
| `profilePicture` | string | Cloudinary URL |

---

#### `POST /users/selfie`

🔒 **Auth required**

Upload a reference selfie used by the face recognition system. The image is stored on Cloudinary and linked to the user account.

**Request body:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `selfie` | file | ✅ | Image file (JPEG/PNG, max 2MB) |

**Response `200 OK`:**

```json
{
  "message": "Selfie uploaded successfully",
  "selfieUrl": "https://res.cloudinary.com/demo/image/upload/..."
}
```

---

#### `PUT /users/change-password`

🔒 **Auth required**

Change the current user's account password.

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `currentPassword` | string | ✅ | Current password |
| `newPassword` | string | ✅ | New password (min 6 characters) |

---

### Media

Media files are stored on **Cloudinary**. Newly uploaded media enters `pending` status and must be approved by a moderator or admin before appearing in the public gallery.

---

#### `GET /media`

🔒 **Auth required**

Returns a paginated list of approved media items.

**Query parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `page` | number | ➖ | Page number (default: `1`) |
| `limit` | number | ➖ | Items per page (default: `20`) |
| `type` | string | ➖ | `photo` or `video` |
| `event` | string | ➖ | Filter by event name or ID |
| `search` | string | ➖ | Text search across titles, tags, event names |
| `album` | string | ➖ | Filter by album ID |

**Response `200 OK`:**

```json
{
  "media": [
    {
      "_id": "64b2a1...",
      "title": "Techfest Opening Ceremony",
      "type": "photo",
      "url": "https://res.cloudinary.com/...",
      "thumbnail": "https://res.cloudinary.com/.../thumbnail",
      "uploadedBy": { "_id": "...", "name": "Rohit Kumar" },
      "likesCount": 42,
      "event": "Techfest 2024",
      "tags": ["techfest", "opening"],
      "status": "approved",
      "createdAt": "2024-11-01T09:00:00Z"
    }
  ],
  "total": 120,
  "page": 1,
  "totalPages": 6
}
```

---

#### `POST /media/upload`

🔒 **Auth required**

Upload a photo or video. Media enters `pending` status until approved.

**Request body:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | file | ✅ | Photo (JPEG/PNG) or video (MP4/MOV) |
| `title` | string | ✅ | Title or caption |
| `event` | string | ➖ | Event name |
| `tags` | string | ➖ | Comma-separated tags |
| `album` | string | ➖ | Album ID to add this media to |

**Response `201 Created`:**

```json
{
  "message": "Media uploaded successfully, pending approval",
  "media": {
    "_id": "64c3b2...",
    "url": "https://res.cloudinary.com/...",
    "status": "pending"
  }
}
```

---

#### `GET /media/:mediaId`

🔒 **Auth required**

Get full details of a single media item including like count, comments, and album.

---

#### `DELETE /media/:mediaId`

🔒 **Auth required**

Delete a media item. Users can only delete their own uploads. Moderators and admins can delete any media. The file is also removed from Cloudinary.

---

#### `GET /media/my-uploads`

🔒 **Auth required**

Returns all media uploaded by the current user, including `pending` and `rejected` items.

---

### Albums

---

#### `GET /albums`

🔒 **Auth required**

Returns all albums with cover photo and media count.

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `page` | number | Page number (default: `1`) |
| `limit` | number | Items per page (default: `12`) |

---

#### `POST /albums`

🔒 **Auth required**

Create a new album.

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Album name |
| `description` | string | ➖ | Album description |
| `event` | string | ➖ | Associated event name |
| `coverImage` | string | ➖ | Media ID to use as cover photo |

---

#### `GET /albums/:albumId`

🔒 **Auth required**

Returns album metadata and a paginated list of its media items.

---

#### `PUT /albums/:albumId`

🔒 **Auth required**

Update album metadata. Only the creator, moderators, or admins can update an album.

---

#### `DELETE /albums/:albumId`

🔒 **Auth required**

Delete an album. Media within the album is **not** deleted — only the album container is removed.

---

#### `POST /albums/:albumId/media`

🔒 **Auth required**

Add media items to an album.

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `mediaIds` | string[] | ✅ | Array of media ObjectIds to add |

---

#### `DELETE /albums/:albumId/media/:mediaId`

🔒 **Auth required**

Remove a media item from an album without deleting the media itself.

---

### Interactions

Real-time updates for likes and comments are pushed via Socket.io.

---

#### `POST /media/:mediaId/like`

🔒 **Auth required**

Toggle a like on a media item. Calling this endpoint again removes the like.

**Response `200 OK`:**

```json
{
  "liked": true,
  "likesCount": 43
}
```

---

#### `POST /media/:mediaId/comments`

🔒 **Auth required**

Add a comment to a media item.

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | ✅ | Comment text (max 500 characters) |

---

#### `GET /media/:mediaId/comments`

🔒 **Auth required**

Returns a paginated list of comments sorted by most recent.

**Response `200 OK`:**

```json
{
  "comments": [
    {
      "_id": "64d4c3...",
      "text": "Amazing shot!",
      "user": { "_id": "...", "name": "Priya Sharma" },
      "createdAt": "2024-11-02T15:30:00Z"
    }
  ],
  "total": 8
}
```

---

#### `DELETE /media/:mediaId/comments/:commentId`

🔒 **Auth required**

Delete a comment. Users can delete their own comments; moderators and admins can delete any comment.

---

#### `POST /media/:mediaId/favourite`

🔒 **Auth required**

Toggle a media item in/out of the user's favourites collection.

---

#### `GET /users/favourites`

🔒 **Auth required**

Returns all media items the current user has favourited.

---

#### `GET /media/:mediaId/share`

🔒 **Auth required**

Returns a public shareable URL and metadata for the media item.

---

### Face Recognition

AI-powered feature that finds all event photos a user appears in, using the **Face++ API**.

**Flow:**
1. User uploads a reference selfie via `POST /users/selfie`
2. The selfie is stored on Cloudinary and linked to the user account
3. On search, the backend calls the Face++ `/compare` endpoint for each approved event photo
4. Photos with a confidence score **≥ 75** are returned as matches
5. Cloudinary URL transformations auto-resize images before sending to Face++ (to stay within the 2MB limit)

---

#### `POST /face/search`

🔒 **Auth required**

Runs a face comparison across all approved photos using the user's uploaded selfie. This request may take several seconds depending on the number of photos.

**Request body (optional):**

| Field | Type | Required | Description |
|---|---|---|---|
| `threshold` | number | ➖ | Confidence threshold (default: `75`, range: `0–100`) |

**Response `200 OK`:**

```json
{
  "matches": [
    {
      "_id": "64b2a1...",
      "url": "https://res.cloudinary.com/...",
      "confidence": 91.5,
      "event": "Thomso 2024",
      "title": "Cultural Night"
    }
  ],
  "count": 7
}
```

---

#### `GET /face/my-photos`

🔒 **Auth required**

Returns the cached results of the most recent face search without re-running the comparison.

---

### Notifications

Notifications are delivered in real time via Socket.io and also stored for later retrieval.

---

#### `GET /notifications`

🔒 **Auth required**

Returns a paginated list of the current user's notifications, sorted by most recent.

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `unread` | boolean | If `true`, returns only unread notifications |
| `page` | number | Page number (default: `1`) |

**Response `200 OK`:**

```json
{
  "notifications": [
    {
      "_id": "64e5d4...",
      "type": "like",
      "message": "Priya liked your photo",
      "media": { "_id": "...", "thumbnail": "..." },
      "read": false,
      "createdAt": "2024-11-03T11:00:00Z"
    }
  ],
  "unreadCount": 3
}
```

---

#### `PUT /notifications/:notifId/read`

🔒 **Auth required**

Mark a single notification as read.

---

#### `PUT /notifications/read-all`

🔒 **Auth required**

Mark all unread notifications for the current user as read in a single operation.

---

### Admin

All admin routes require the `moderator` or `admin` role.

---

#### `GET /admin/dashboard`

🔒 **Admin+**

Returns aggregate platform stats and recent activity.

**Response `200 OK`:**

```json
{
  "stats": {
    "totalUsers": 248,
    "totalMedia": 1420,
    "pendingApprovals": 12,
    "totalLikes": 5840,
    "totalComments": 920
  },
  "recentActivity": [ ]
}
```

---

#### `GET /admin/media/pending`

🔒 **Moderator+**

Returns all media uploads with `pending` status awaiting moderation.

---

#### `PUT /admin/media/:mediaId/approve`

🔒 **Moderator+**

Approve a pending media upload. Makes it visible in the public gallery and triggers a notification to the uploader.

---

#### `PUT /admin/media/:mediaId/reject`

🔒 **Moderator+**

Reject a pending media upload.

**Request body (optional):**

| Field | Type | Description |
|---|---|---|
| `reason` | string | Rejection reason sent to the uploader |

---

#### `GET /admin/users`

🔒 **Admin only**

Returns a paginated list of all platform users.

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `role` | string | Filter by `member` / `moderator` / `admin` |
| `search` | string | Search by name or email |
| `page` | number | Page number (default: `1`) |

---

#### `PUT /admin/users/:userId/role`

🔒 **Admin only**

Promote or demote a user's role. Admins cannot change their own role.

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `role` | string | ✅ | `member`, `moderator`, or `admin` |

---

#### `DELETE /admin/users/:userId`

🔒 **Admin only**

Permanently delete a user account and all associated media. **This action cannot be undone.**

---

#### `GET /admin/activity`

🔒 **Admin+**

Returns a chronological feed of platform activity: uploads, approvals, rejections, user registrations, and role changes.

---

## Socket.io Events

The backend runs a Socket.io server on the same port as the HTTP API.

**Connect with JWT auth:**

```js
const socket = io("https://your-backend.onrender.com", {
  auth: { token: "<jwt_token>" }
});
```

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `notification` | `{ type, message, media, createdAt }` | New notification received (like, comment, approval) |
| `media:approved` | `{ mediaId, title }` | Uploader's media was approved |
| `media:rejected` | `{ mediaId, reason }` | Uploader's media was rejected |
| `comment:new` | `{ comment, mediaId }` | New comment posted on a media item |

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `join:media` | `{ mediaId }` | Subscribe to live updates for a media item |
| `leave:media` | `{ mediaId }` | Unsubscribe from updates for a media item |

**Example:**

```js
// Subscribe to a media item's live updates
socket.emit("join:media", { mediaId: "64b2a1..." });

// Listen for new comments
socket.on("comment:new", ({ comment }) => {
  console.log("New comment:", comment.text);
});

// Listen for notifications
socket.on("notification", (notif) => {
  console.log(notif.message);
});
```

---

## Data Models

### User

```js
{
  _id:            ObjectId,
  name:           String,          // required
  email:          String,          // required, unique
  password:       String,          // bcrypt hashed
  role:           String,          // "member" | "moderator" | "admin"
  rollNumber:     String,
  profilePicture: String,          // Cloudinary URL
  selfieUrl:      String,          // reference selfie for face recognition
  bio:            String,
  favourites:     [ObjectId],      // ref: Media
  createdAt:      Date
}
```

### Media

```js
{
  _id:             ObjectId,
  title:           String,         // required
  type:            String,         // "photo" | "video"
  url:             String,         // Cloudinary URL
  thumbnail:       String,         // Cloudinary thumbnail URL
  publicId:        String,         // Cloudinary public ID (for deletion)
  uploadedBy:      ObjectId,       // ref: User
  event:           String,
  tags:            [String],
  album:           ObjectId,       // ref: Album
  status:          String,         // "pending" | "approved" | "rejected"
  rejectionReason: String,
  likes:           [ObjectId],     // ref: User
  comments:        [ObjectId],     // ref: Comment
  createdAt:       Date
}
```

### Comment

```js
{
  _id:       ObjectId,
  text:      String,               // required, max 500 chars
  user:      ObjectId,             // ref: User
  media:     ObjectId,             // ref: Media
  createdAt: Date
}
```

### Album

```js
{
  _id:         ObjectId,
  name:        String,             // required
  description: String,
  event:       String,
  coverImage:  String,             // Cloudinary URL
  media:       [ObjectId],         // ref: Media
  createdBy:   ObjectId,           // ref: User
  createdAt:   Date
}
```

### Notification

```js
{
  _id:       ObjectId,
  recipient: ObjectId,             // ref: User
  sender:    ObjectId,             // ref: User
  type:      String,               // "like" | "comment" | "approved" | "rejected"
  message:   String,
  media:     ObjectId,             // ref: Media (optional)
  read:      Boolean,              // default: false
  createdAt: Date
}
```

---

*Generated from [rohity-cyber/Events-Media-Platform](https://github.com/rohity-cyber/Events-Media-Platform)*

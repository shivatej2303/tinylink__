# TinyLink – Minimal URL Shortener with Click Analytics

TinyLink is a lightweight URL shortener built with **Node.js**, **Express**, and **MongoDB**, with a **vanilla JavaScript** frontend.  
It lets users generate compact short links, handles fast redirection, and tracks basic engagement metrics like click counts and timestamps.

Live demo: https://tinylink-seven-iota.vercel.app/

---

## ✨ Features

- 🔗 **URL Shortening** – Convert long URLs into compact TinyLink codes.
- ⚡ **Fast Redirection** – Optimized MongoDB indexing on short codes for low-latency lookups.
- 📊 **Click Analytics** – Track click count and access timestamps for each short link.
- ✅ **Client-side Validation** – Real-time form validation in the browser (no page reloads).
- 🛡️ **Input Hardening** – Backend validation to guard against invalid / malformed payloads.
- 📱 **Responsive UI** – Frontend built without heavy frameworks; works smoothly on desktop and mobile.
- ☁️ **Ready for Serverless Deployment** – Configured for deployment on platforms like Vercel.

---

## 🏗 Tech Stack

**Frontend**
- HTML5, CSS3
- Vanilla JavaScript (ES6+)
- Fetch API for REST calls
- Responsive layout (no frontend framework)

**Backend**
- Node.js
- Express.js
- MongoDB (short-code + URL storage, click tracking)
- Mongoose / MongoDB driver (for schema & queries)

**DevOps & Tooling**
- npm
- Vercel for deployment (with `vercel.json`)
- Git & GitHub for version control

---

## 📂 Project Structure

```bash
tinylink__/
├─ public/             # Static assets served by Express (HTML, CSS, client JS)
│  ├─ index.html
│  ├─ styles.css
│  └─ script.js
├─ server.js           # Express server, API routes, MongoDB connection
├─ package.json        # Dependencies and npm scripts
├─ package-lock.json
└─ vercel.json         # Deployment configuration

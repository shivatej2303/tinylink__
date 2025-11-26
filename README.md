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
## 🚀 Run Locally

Follow these steps to run the TinyLink project on your local machine.

1. Clone the repository:
git clone https://github.com/shivatej2303/tinylink__.git
cd tinylink__

2. Install dependencies:
npm install

3. Create a .env file in the project root:
MONGODB_URI=<your-mongodb-connection-string>
BASE_URL=http://localhost:3000
PORT=3000

4. Start the server:
npm run dev
(or)
node server.js

Expected output:
Server running on port 3000
Connected to MongoDB...

5. Open the app in your browser:
http://localhost:3000

6. Test the API endpoints:

Create a short URL:
POST http://localhost:3000/api/shorten
Body:
{
  "originalUrl": "https://google.com"
}

Redirect:
http://localhost:3000/<shortCode>

Analytics:
GET http://localhost:3000/api/stats/<shortCode>

------------------------------

## 🧰 Common Issues & Fixes

Error: MONGODB_URI not defined
Fix: Create a valid .env file with the correct MongoDB connection string.

Error: npm.ps1 cannot be loaded
Fix (PowerShell):
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

Error: CORS / Fetch issues
Fix: Ensure BASE_URL in .env matches your frontend requests.

------------------------------

## ✔️ Summary
To run locally:
git clone
npm install
create .env
npm run dev
open in browser at http://localhost:3000


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

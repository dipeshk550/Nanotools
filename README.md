# NanoTools AI

A full-stack AI-powered productivity platform with 200+ tools.

## Tech Stack
**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router, Zustand, Axios, react-icons
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Auth:** JWT, Google OAuth, GitHub OAuth, Email OTP
**Storage:** Cloudinary, AWS S3
**Payments:** Stripe
**AI:** Anthropic Claude API
**Email:** Nodemailer | **Logging:** Winston | **Cache:** Redis (optional)

## Quick Start

```bash
# Backend
cd server
npm install
cp .env.example .env     # fill in MONGODB_URI at minimum
npm run dev               # http://localhost:5000

# Frontend (new terminal)
cd client
npm install
cp .env.example .env
npm run dev                # http://localhost:5173

# Seed the database with starter tools + admin account
cd server
npm run seed
```

**Minimum required env vars to boot the server:**
```
MONGODB_URI=mongodb://localhost:27017/nanotools
JWT_SECRET=any_random_32_char_string
JWT_REFRESH_SECRET=another_random_32_char_string
```
Everything else (Google/GitHub OAuth, Stripe, Cloudinary, AWS, Redis) is optional —
the server detects placeholder values and skips those features gracefully instead of crashing.

## Project Structure
```
nanotools-ai/
├── client/      React frontend (Vite) — uses react-icons, no emoji
├── server/      Express API backend
├── docker/      Docker & Nginx configs
└── docs/        API documentation
```

## What was fixed in this version
- `connectRedis` import bug (destructuring fix) that crashed server on boot
- Redis is now fully optional — server runs fine without it installed
- Removed `multer-storage-cloudinary` (unused, caused npm peer-dependency conflict with `cloudinary@2.x`)
- Google/GitHub OAuth strategies only register when real credentials are present — placeholder `.env` values no longer crash passport on boot
- Logger now writes to an absolute `logs/` path and auto-creates the directory
- Removed deprecated Mongoose connection options (not needed in Mongoose 8)
- Tailwind color tokens renamed to flat names (`brand`, `accent`, etc.) so they work inside `@apply` — this was the root cause of the `text-teal-DEFAULT does not exist` PostCSS error
- All emoji replaced with `react-icons` (Feather + Hero icons) across every page and component
- Verified `npm run build` and `npm run dev` both complete with zero errors

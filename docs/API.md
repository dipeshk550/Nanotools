# NanoTools AI — API Reference

Base URL: `https://api.nanotools.ai` (production) or `http://localhost:5000` (dev)

All authenticated endpoints require: `Authorization: Bearer <token>`

---

## Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with name, email, password |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/auth/login` | Login with email + password |
| POST | `/api/auth/refresh` | Refresh access token (uses cookie) |
| POST | `/api/auth/logout` | Logout & clear refresh cookie |
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET  | `/api/auth/google` | OAuth via Google |
| GET  | `/api/auth/github` | OAuth via GitHub |

## AI Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/run` | Run an AI tool (returns full response) |
| POST | `/api/ai/stream` | Stream AI output (SSE) |
| POST | `/api/ai/recommend` | Get tool recommendations |

**POST /api/ai/run body:**
```json
{
  "toolName": "AI Content Writer",
  "input": "Write a blog post about React hooks",
  "category": "AI",
  "systemPrompt": "optional override"
}
```

## Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tools` | List all tools (filterable) |
| GET | `/api/tools/trending` | Top 10 trending tools |
| GET | `/api/tools/:slug` | Get single tool |
| POST | `/api/tools/:id/run` | Record a tool run |

## Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | ✅ | Get current user profile |
| PATCH | `/api/users/me` | ✅ | Update name, preferences |
| POST | `/api/users/bookmark/:toolId` | ✅ | Toggle tool bookmark |
| GET | `/api/users/me/history` | ✅ | Get tool run history |

## Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/create-checkout` | ✅ | Create Stripe checkout session |
| POST | `/api/payments/webhook` | — | Stripe webhook handler |
| GET | `/api/payments/portal` | ✅ | Open billing portal |

## Admin (admin role required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform KPIs |
| GET | `/api/admin/users` | List users (paginated) |
| GET | `/api/admin/tools` | List all tools |
| POST | `/api/admin/tools` | Create a tool |
| PATCH | `/api/admin/tools/:id` | Update a tool |
| DELETE | `/api/admin/tools/:id` | Delete a tool |

## Rate Limits

| Tier | Global | AI tools |
|------|--------|----------|
| Free | 300 req/15min | 20 req/min |
| Pro | 600 req/15min | 60 req/min |
| Team | Unlimited | 200 req/min |

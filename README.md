<div align="center">

# 💼 CareerSync — Frontend

**A modern career sync platform to search jobs, manage profiles, and analyse resumes.**  
Built with React · Vite · TailwindCSS · Axios

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?logo=netlify&logoColor=white)](https://careersyncplatform.netlify.app)

**[🌐 Live Demo →](https://careersyncplatform.netlify.app)**

</div>

---

## 📖 About

CareerSync Frontend is a fast, responsive single-page application that provides a complete career management experience — from job discovery to resume analysis to profile management. It connects to the [CareerSync Backend](https://github.com/itsmrajguru/CareerSync_Backend) REST API.

---

## ✨ Features

- 🔐 **Two-Step OTP Login** — Enter credentials → receive 6-digit OTP on email → securely logged in
- 📝 **User Registration** — Simple signup with username, email, and password
- 🔑 **Forgot / Reset Password** — Email-based secure password reset flow
- 🏠 **Landing Page** — Modern, animated homepage with feature highlights
- 📊 **Dashboard** — Central hub for your career activity and quick actions
- 💼 **Job Search** — Search real job listings (powered by Adzuna), with pagination
- 📄 **Resume Analyser** — Upload your PDF resume and get an instant ATS score + skill gap report
- 👤 **Profile Management** — Build and update your career profile
- 🔒 **Protected Routes** — Unauthenticated users are automatically redirected to login
- ♻️ **Automatic Token Refresh** — Expired access tokens are silently refreshed without interrupting the user

---

## 🗂️ Project Structure

```
CareerSync-Frontend/
├── public/
│   └── logo.svg                  # App logo
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx           # Landing page
│   │   ├── LoginPage.jsx          # Two-step OTP login
│   │   ├── SignupPage.jsx         # Registration
│   │   ├── DashboardPage.jsx      # Main app dashboard
│   │   ├── JobsPage.jsx           # Job search & listing
│   │   ├── JobDetailsPage.jsx     # Individual job detail
│   │   ├── ProfilePage.jsx        # User profile view/edit
│   │   ├── ResumePage.jsx         # Resume upload & analysis
│   │   ├── ForgotPasswordPage.jsx # Password reset request
│   │   ├── ResetPasswordPage.jsx  # Password reset form
│   │   └── VerifyEmailPage.jsx    # Email verification
│   ├── components/
│   │   ├── Navbar.jsx             # Sticky navigation bar
│   │   ├── Footer.jsx             # Page footer
│   │   ├── ProtectedRoute.jsx     # Auth guard wrapper
│   │   ├── PageLayout.jsx         # Shared layout (Navbar + content)
│   │   ├── ProfileForm.jsx        # Profile edit form
│   │   ├── ProfileSummaryCard.jsx # Compact profile display
│   │   ├── ResumeCard.jsx         # Resume upload card
│   │   ├── ResumeAnalysis.jsx     # ATS score & skill display
│   │   ├── JobCard.jsx            # Job listing card
│   │   ├── JobList.jsx            # Job list container
│   │   ├── TopMatches.jsx         # Top matched jobs
│   │   └── ActionItems.jsx        # Dashboard action buttons
│   ├── api.js                     # Axios instance + interceptors + API functions
│   ├── App.jsx                    # Route definitions
│   ├── main.jsx                   # React app entry point
│   └── index.css                  # Global styles & Tailwind directives
├── .env                           # Local environment variables
├── .env.production                # Production environment variables
├── netlify.toml                   # Netlify build & redirect config
├── tailwind.config.js             # TailwindCSS customisation
└── vite.config.js                 # Vite config
```

---

## 🔀 Application Routes

| Route | Page | Protected |
|-------|------|-----------|
| `/` | Home | ❌ |
| `/login` | Login (OTP) | ❌ |
| `/signup` | Sign Up | ❌ |
| `/forgot-password` | Forgot Password | ❌ |
| `/reset-password` | Reset Password | ❌ |
| `/verify` | Email Verification | ❌ |
| `/dashboard` | Dashboard | ✅ |
| `/jobs` | Job Search | ✅ |
| `/jobs/:id` | Job Detail | ✅ |
| `/profile` | User Profile | ✅ |
| `/resume` | Resume Analyser | ✅ |
| `*` | → Redirect to `/dashboard` | — |

---

## 🔐 Login Flow

```
User enters email + password → clicks Continue
        │
        ▼
POST /api/auth/login
  → Backend validates credentials
  → Sends 6-digit OTP to email
        │
        ▼
User enters OTP from email
        │
        ▼
POST /api/auth/verify-otp
  → JWT access token stored in localStorage
  → Refresh token stored in httpOnly cookie
  → User redirected to /dashboard
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

For production (`.env.production`):

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- The [CareerSync Backend](https://github.com/itsmrajguru/CareerSync_Backend) running locally or deployed

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/itsmrajguru/CareerSync_Frontend.git
cd CareerSync_Frontend

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Set VITE_API_BASE_URL in .env

# 4. Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The production bundle is output to the `dist/` directory.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🌐 Deployment (Netlify)

The project is configured for one-click Netlify deployment via `netlify.toml`.

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 18 |
| SPA redirect | `/*` → `/index.html` (status 200) |

> ⚠️ Make sure to set `VITE_API_BASE_URL` in your Netlify environment variables to point to your deployed backend.

---

## 🧰 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| React Router DOM v7 | Client-side routing |
| TailwindCSS 3 | Utility-first styling |
| Axios | HTTP client with interceptors |
| Lucide React | Icon library |

---

## 🏗️ Architecture Notes

### `api.js` — Axios Instance

All API calls go through a single `axios` instance in `api.js`:

- **Request interceptor** — Automatically injects `Authorization: Bearer <token>` from `localStorage` on every request.
- **Response interceptor** — On a `401 Unauthorized`, silently calls `POST /auth/token/refresh/` using the `httpOnly` cookie, updates the stored token, and retries the original request — all without the user noticing.

### Protected Routes

`ProtectedRoute` wraps all authenticated pages. If no token is found in `localStorage`, the user is immediately redirected to `/login`.

---

## 🤝 Related

- **Backend API:** [CareerSync Backend](https://github.com/itsmrajguru/CareerSync_Backend)
- **Live App:** [careersyncplatform.netlify.app](https://careersyncplatform.netlify.app)

---

<div align="center">

Made with ❤️ by **Mangesh Rajguru**

</div>

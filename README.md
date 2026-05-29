# CVision AI — Resume Intelligence Platform

A fully functional, production-ready SaaS web application that analyzes resumes using rule-based AI scoring. No paid APIs required — everything runs locally.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | TailwindCSS + CSS Variables |
| Database | SQLite via Node.js 22 built-in `node:sqlite` |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| PDF Parsing | pdf-parse |
| DOCX Parsing | mammoth |
| Language | TypeScript |

---

## ✨ Features

- **Authentication** — Email/password register & login with JWT sessions
- **Resume Upload** — Drag & drop PDF, DOCX, DOC, TXT support
- **ATS Scoring** — Rule-based algorithm scoring structure, keywords, grammar
- **Keyword Analysis** — Detects 80+ tech skills, highlights missing ones
- **Grammar Check** — Detects passive voice, weak verbs, pronouns
- **Job Match** — Paste any job description → get match % + missing keywords
- **Dashboard** — Score history, trends, improvement suggestions
- **Dark Mode** — Full dark/light theme toggle
- **Report Download** — Download analysis as `.txt` report
- **No paid APIs** — 100% local, open-source logic

---

## 📋 Prerequisites

- **Node.js 22+** (required for built-in SQLite support)
- npm 10+

Check your Node version:
```bash
node --version   # Must be v22+
```

---

## 🛠 Quick Start

### 1. Clone / extract the project
```bash
cd cvision-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment
```bash
# .env already exists with defaults — no changes needed for local dev
# For production, update JWT_SECRET:
echo 'JWT_SECRET="your-super-secret-key-here"' >> .env
```

### 4. Run development server
```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

The SQLite database (`data/cvision.db`) is created automatically on first run.

---

## 🗂 Project Structure

```
cvision-ai/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       # POST /api/auth/login
│   │   │   ├── register/route.ts    # POST /api/auth/register
│   │   │   ├── logout/route.ts      # POST /api/auth/logout
│   │   │   └── me/route.ts          # GET  /api/auth/me
│   │   ├── upload-resume/route.ts   # POST /api/upload-resume
│   │   ├── analyze-resume/route.ts  # POST /api/analyze-resume
│   │   ├── match-job/route.ts       # POST /api/match-job
│   │   └── history/route.ts         # GET  /api/history
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # SPA root with client-side routing
│
├── components/
│   ├── Navbar.tsx
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── landing/
│   │   └── LandingPage.tsx
│   ├── dashboard/
│   │   └── DashboardPage.tsx        # Sidebar + all dashboard views
│   ├── upload/
│   │   └── UploadPage.tsx
│   └── results/
│       └── ResultsPage.tsx
│
├── lib/
│   ├── db.ts                        # SQLite database (Node 22 built-in)
│   ├── auth.ts                      # JWT utilities
│   ├── ats-scorer.ts                # ATS scoring algorithm
│   ├── resume-parser.ts             # PDF + DOCX text extraction
│   ├── useAuth.tsx                  # React auth context
│   └── useTheme.tsx                 # Dark/light theme context
│
├── data/
│   └── cvision.db                   # SQLite database (auto-created)
│
├── .env                             # Environment variables
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔌 API Reference

### Auth
```
POST /api/auth/register   { name, email, password }
POST /api/auth/login      { email, password }
POST /api/auth/logout
GET  /api/auth/me
```

### Resume
```
POST /api/upload-resume   multipart/form-data: { resume: File }
POST /api/analyze-resume  { resumeId }
POST /api/match-job       { resumeId, jobDescription }
GET  /api/history
```

---

## 🧠 ATS Scoring Algorithm

The scoring engine (`lib/ats-scorer.ts`) uses rule-based logic:

| Score | Weight | Logic |
|---|---|---|
| ATS Score | 40% | Section detection + length + formatting signals + keyword density |
| Grammar Score | 30% | Action verb count, pronoun penalty, quantified achievements |
| Keyword Score | 30% | Match against 80+ tech skills database |
| Overall | — | Weighted average of above three |

### Detected Skills (80+ keywords)
JavaScript, TypeScript, Python, React, Node.js, Docker, Kubernetes, AWS, PostgreSQL, MongoDB, GraphQL, and many more.

---

## 🗃 Database Schema

```sql
users (id, email, name, password, created_at)
resumes (id, user_id, file_name, file_size, file_type, extracted_text, created_at)
analysis_results (id, resume_id, ats_score, grammar_score, keyword_score, overall_score,
                  missing_skills, present_skills, suggestions, word_count, section_count,
                  job_description, match_score, missing_keywords, created_at)
```

---

## 🌙 Dark Mode

Click the moon/sun icon in the navbar. Preference is saved to `localStorage`.

---

## 📦 Production Build

```bash
npm run build
npm start
```

**Environment variables for production:**
```env
DATABASE_URL="file:./data/cvision.db"
JWT_SECRET="strong-random-secret-min-32-chars"
NEXTAUTH_URL="https://your-domain.com"
```

---

## 🔒 Security Notes

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens stored in httpOnly cookies (XSS-safe)
- File size limited to 10MB
- File type validation on both extension and MIME type
- SQL injection protected via parameterized queries

---

## 🐛 Troubleshooting

**"node:sqlite not found"**
→ Upgrade to Node.js 22+: `nvm install 22 && nvm use 22`

**PDF parsing returns empty text**
→ The PDF may be image-based/scanned. Use a text-based PDF or convert with OCR first.

**Port 3000 in use**
→ `npm run dev -- -p 3001`

---

Built with ❤️ — CVision AI Resume Intelligence Platform

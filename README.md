# Career Gap Architect - Frontend

Frontend application for Career Gap Architect using Next.js 15, TypeScript, and Tailwind CSS.

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Project Structure](#project-structure)
5. [Configuration](#configuration)
6. [Development](#development)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Simple and functional frontend for Career Gap Architect with features:
- ✅ Resume & job description input form
- ✅ Real-time character counter
- ✅ Loading states & error handling
- ✅ Cache indicator
- ✅ Markdown rendering for roadmap
- ✅ Responsive design
- ✅ TypeScript type safety

---

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js**: v18 or higher
- **npm** or **yarn** or **pnpm**
- **Backend API**: Must be running at http://localhost:5000

Check Node.js version:
```bash
node -v
# Output: v18.x.x or higher
```

---

## 📦 Installation

### Step 1: Navigate to Frontend Folder

```bash
# From project root
cd frontend

# Or if cloning from repo
git clone <your-repo-url>
cd career-gap-architect/frontend
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# OR using yarn
yarn install

# OR using pnpm
pnpm install
```

**Expected output:**
```
added 312 packages in 45s
```

**Installed dependencies:**
- `next@15.1.3` - React framework
- `react@19.0.0` - React library
- `react-markdown@9.0.1` - Markdown rendering
- `tailwindcss@3.4.17` - Utility CSS
- `typescript@5.7.2` - Type safety

### Step 3: Setup Environment Variables

```bash
# Copy template
cp .env.local.example .env.local
```

**Edit `.env.local` file:**
```env
# Development (default)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Production (uncomment when deploying)
# NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

**⚠️ IMPORTANT:**
- Environment variables **MUST** be prefixed with `NEXT_PUBLIC_` to be accessible in the browser
- Make sure backend URL is **without** trailing slash
- For development, use `http://localhost:5000/api`

### Step 4: Verify Setup

```bash
# Check if all files exist
ls -la

# Should have:
# - package.json
# - node_modules/
# - .env.local
# - app/
# - components/
# - lib/
```

### Step 5: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 15.1.3
- Local:        http://localhost:3000
- Network:      http://192.168.1.100:3000

✓ Ready in 2.1s
```

### Step 6: Test in Browser

1. Open browser: `http://localhost:3000`
2. Should display:
   - Header "Career Gap Architect"
   - Form with 2 textareas
   - "Analyze Gap" button (disabled if form is empty)

Server will start at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page (home)
│   └── globals.css         # Global styles
├── components/
│   ├── AnalysisForm.tsx    # Resume & JD input form
│   └── AnalysisResults.tsx # Display analysis results
├── lib/
│   ├── api.ts              # API client
│   └── types.ts            # TypeScript types
├── public/                 # Static files
├── .env.local.example      # Environment variables template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🔧 Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

## 🎨 Features

- ✅ Simple and clean UI
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Cache indicator
- ✅ Markdown rendering for roadmap
- ✅ Responsive design
- ✅ TypeScript type safety

## 📡 API Integration

Frontend communicates with backend through API client in `lib/api.ts`:

```typescript
// Analyze gap
const response = await ApiClient.analyzeGap({
  resumeText: "...",
  jobDescriptionText: "..."
});
```

## 🛠 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🎯 Usage Flow

1. User pastes resume and job description
2. Click "Analyze Gap"
3. Frontend sends request to backend API
4. Loading indicator appears (5-10 seconds for cache miss)
5. Results are displayed:
   - Missing skills (red badges)
   - Learning steps (numbered list)
   - Interview questions (numbered list)
   - Learning roadmap (markdown)
6. User can "Start New Analysis"

## 🎨 Styling

- **Tailwind CSS** for utility classes
- **@tailwindcss/typography** for markdown styling
- **Custom CSS** for scrollbar and prose improvements

## 📱 Responsive Design

UI is responsive and works well on:
- Desktop (1024px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect GitHub repo in Vercel dashboard.

### Environment Variables in Vercel

Set in Vercel dashboard:
```
NEXT_PUBLIC_API_URL = https://your-backend-api.com/api
```

## 🔗 Integration with Backend

Make sure:
1. Backend is running on the correct port
2. CORS is enabled for frontend URL
3. `.env.local` has the correct `NEXT_PUBLIC_API_URL`

## 📦 Dependencies

### Production
- `next` - React framework
- `react` & `react-dom` - React library
- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown

### Development
- `typescript` - Type safety
- `tailwindcss` - Utility CSS
- `@tailwindcss/typography` - Prose styling
- `@types/*` - TypeScript types

## 🐛 Troubleshooting

### Error: Cannot connect to backend

**Solution:**
1. Make sure backend is running on port 5000
2. Check `.env.local` exists and is correct
3. Restart Next.js dev server

### Error: CORS policy

**Solution:**
1. Check backend `.env` → `FRONTEND_URL` should be `http://localhost:3000`
2. Restart backend server

### Styling not showing

**Solution:**
```bash
# Delete .next folder
rm -rf .next

# Restart dev server
npm run dev
```

## ✅ Testing Checklist

- [ ] Form can be submitted
- [ ] Loading indicator appears
- [ ] Error messages are displayed
- [ ] Results render correctly
- [ ] Missing skills appear as badges
- [ ] Markdown roadmap is rendered
- [ ] Cache indicator appears (for second request)
- [ ] Back button works

## 📄 License

MIT

---

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout (metadata, fonts)
│   ├── page.tsx             # Main page (home)
│   └── globals.css          # Global styles + Tailwind
│
├── components/              # React Components
│   ├── AnalysisForm.tsx    # Resume & JD input form
│   └── AnalysisResults.tsx # Display analysis results
│
├── lib/                     # Utilities
│   ├── api.ts              # API client (backend integration)
│   └── types.ts            # TypeScript type definitions
│
├── public/                  # Static files
│
├── Configuration:
├── .env.local.example      # Environment template
├── .env.local              # Your environment (gitignored)
├── package.json            # Dependencies & scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── setup.sh                # Auto setup script
└── README.md               # This file
```

---

## ⚙️ Configuration

### Environment Variables

`.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Notes:**
- Variables **MUST** be prefixed with `NEXT_PUBLIC_` for client-side access
- Development: `http://localhost:5000/api`
- Production: Your production backend URL

---

## 🛠 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

### Development Workflow

1. **Start Backend:**
```bash
cd ../backend
npm run dev
```

2. **Start Frontend:**
```bash
npm run dev
```

3. **Development:**
- Edit files in `app/` or `components/`
- Hot reload is automatic
- Check browser for changes

---

## 🧪 Testing

### Test Form Validation

1. Empty form → Button disabled
2. Type <50 chars in Resume → Button disabled
3. Type ≥50 chars in Resume + ≥20 chars in JD → Button enabled

### Test API Integration

**Prerequisites:** Backend running at http://localhost:5000

1. Paste resume (≥50 chars)
2. Paste job description (≥20 chars)
3. Click "Analyze Gap"
4. Wait 5-10 seconds
5. Results should appear

### Test Cache

1. After getting results, click "← Start New Analysis"
2. Paste **same data**
3. Click "Analyze Gap"
4. Blue banner "Loaded from cache" appears
5. Results in <1 second

---

## 🚀 Deployment

### Build Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
# Via CLI
npm i -g vercel
vercel

# Or connect GitHub at vercel.com
```

Set environment variable:
- `NEXT_PUBLIC_API_URL` = `https://your-backend-api.com/api`

---

## 🐛 Troubleshooting

### Cannot connect to backend

**Solutions:**
1. Check backend is running: `curl http://localhost:5000/health`
2. Check `.env.local` exists and is correct
3. Restart frontend: `npm run dev`

### CORS Error

**Solution:**
Backend `.env` should have:
```env
FRONTEND_URL="http://localhost:3000"
```

Restart backend.

### Styling not showing

**Solution:**
```bash
rm -rf .next
npm run dev
```

### Port 3000 in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

---

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Backend running on http://localhost:5000
- [ ] Dependencies installed
- [ ] `.env.local` created and configured
- [ ] Dev server starts without errors
- [ ] Browser can access http://localhost:3000
- [ ] Form renders correctly
- [ ] Can submit and get results

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Markdown](https://github.com/remarkjs/react-markdown)

---

## 🎉 Done!

Frontend is ready! 

**Next steps:**
1. Start backend: `cd ../backend && npm run dev`
2. Start frontend: `npm run dev`
3. Open: `http://localhost:3000`

Happy coding! 🚀
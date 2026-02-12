# 🚀 Vercel Deployment Guide

## Persiapan Sebelum Deploy

### 1. Pastikan Code Sudah Siap
- ✅ `package.json` memiliki script `build`, `start`, dan `dev`
- ✅ Next.js configuration sudah benar
- ✅ `.env.example` sudah dibuat
- ✅ `vercel.json` sudah dibuat
- ✅ Build test berhasil

### 2. Buat Akun Vercel
1. Kunjungi https://vercel.com
2. Sign up dengan GitHub account
3. Verifikasi email

---

## 📦 Langkah Deploy ke Vercel

### Step 1: Buat Project Baru di Vercel

#### Option A: Via Vercel Dashboard (Recommended)
1. Login ke Vercel Dashboard
2. Klik **"Add New..."** → **"Project"**
3. **Import Git Repository**
4. Pilih repository `gap-arch-solvara`
5. Vercel akan auto-detect Next.js framework

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd fe-gap-arch
vercel
```

### Step 2: Configure Project Settings

Di Vercel project settings:

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `fe-gap-arch` (jika deploy dari monorepo)

**Build Command:** `npm run build` (default)

**Output Directory:** `.next` (default)

**Install Command:** `npm install` (default)

### Step 3: Set Environment Variables

Di Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Production Environment Variable
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
```

**⚠️ PENTING:**
- Ganti `https://your-backend.up.railway.app/api` dengan URL Railway backend Anda
- Pastikan URL **TANPA** trailing slash
- Variable harus diawali dengan `NEXT_PUBLIC_` untuk accessible di browser

**Environment Scope:**
- ✅ Production
- ✅ Preview (optional)
- ✅ Development (optional)

### Step 4: Deploy!

1. Vercel akan otomatis trigger deployment
2. Tunggu proses build (±2-3 menit)
3. Jika sukses, akan muncul URL deployment (contoh: `https://your-app.vercel.app`)

---

## 🔍 Verifikasi Deployment

### 1. Test Homepage
```bash
curl https://your-app.vercel.app
```

**Expected:** HTML page dengan form resume & job description

### 2. Test API Connection
1. Buka `https://your-app.vercel.app` di browser
2. Paste resume text (≥50 characters)
3. Paste job description (≥20 characters)
4. Klik "Analyze Gap"
5. Verify hasil analysis muncul

### 3. Check Vercel Logs
Di Vercel Dashboard:
- Klik project → **"Deployments"**
- Pilih deployment terbaru
- Tab **"Build Logs"** untuk melihat build output
- Tab **"Function Logs"** untuk runtime logs

---

## 🔧 Troubleshooting

### Error: "Build failed"
**Solusi:**
1. Check build logs di Vercel Dashboard
2. Test build locally: `npm run build`
3. Fix errors dan push ke GitHub
4. Vercel akan auto-redeploy

### Error: "Cannot connect to backend API"
**Solusi:**
1. Verify `NEXT_PUBLIC_API_URL` di Vercel Environment Variables
2. Pastikan backend Railway sudah running
3. Test backend health: `curl https://your-backend.up.railway.app/health`
4. Redeploy frontend

### Error: "CORS policy blocked"
**Solusi:**
1. Update `FRONTEND_URL` di Railway backend environment variables
2. Set ke: `https://your-app.vercel.app`
3. Redeploy backend
4. Test lagi dari frontend

### Error: "Environment variable not found"
**Solusi:**
1. Check Environment Variables di Vercel Settings
2. Pastikan variable name benar: `NEXT_PUBLIC_API_URL`
3. Pastikan scope: Production, Preview, Development
4. Redeploy project

### Build Timeout
**Solusi:**
- Vercel free tier: 45 minutes build time
- Check dependencies size
- Remove unused packages
- Optimize build process

---

## 📊 Monitoring

### Vercel Dashboard Metrics
- **Deployments**: History dan status
- **Analytics**: Page views, visitors
- **Speed Insights**: Performance metrics
- **Logs**: Build dan runtime logs

### Performance
- Vercel Edge Network untuk fast delivery
- Automatic CDN caching
- Image optimization (jika ada)
- Code splitting otomatis

---

## 🔄 Update & Redeploy

### Auto Deploy (Recommended)
1. Push code ke GitHub
2. Vercel otomatis detect changes
3. Auto trigger new deployment
4. Production URL tetap sama

### Manual Deploy
1. Di Vercel Dashboard
2. Klik project → **"Deployments"**
3. Klik **"Redeploy"** pada deployment terakhir

### Rollback
1. Di Vercel Dashboard → **"Deployments"**
2. Pilih deployment sebelumnya
3. Klik **"Promote to Production"**

---

## 🎯 Post-Deployment

### 1. Update Backend CORS
Di Railway backend, set environment variable:
```env
FRONTEND_URL=https://your-app.vercel.app
```

Redeploy backend.

### 2. Test End-to-End
1. Buka `https://your-app.vercel.app`
2. Upload resume
3. Paste job description
4. Klik "Analyze Gap"
5. Verify hasil analysis muncul
6. Test cache (submit data yang sama lagi)

### 3. Setup Custom Domain (Optional)
1. Di Vercel Dashboard → Project → **"Settings"** → **"Domains"**
2. Add custom domain (e.g., `gap-architect.yourdomain.com`)
3. Update DNS records sesuai instruksi Vercel
4. Update `FRONTEND_URL` di Railway backend

---

## 💰 Pricing

Vercel menyediakan:
- **Hobby (Free)**: 
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS
  - Perfect untuk personal projects
  
- **Pro Plan**: $20/month
  - Unlimited bandwidth
  - Advanced analytics
  - Team collaboration

**Estimasi Usage:**
- Frontend hosting: **FREE** (Hobby tier)
- Bandwidth: ~1-5GB/month (dalam free tier)

---

## 🔐 Security Checklist

- ✅ `.env.local` di-gitignore (tidak ter-commit)
- ✅ Environment variables di Vercel Dashboard (aman)
- ✅ HTTPS otomatis enabled
- ✅ API URL dari environment variable (tidak hardcoded)
- ✅ No sensitive data di client-side code

---

## 📝 Next Steps

### Setelah Frontend Deploy:

1. **Copy Frontend URL**
   - Dari Vercel Dashboard
   - Format: `https://your-app.vercel.app`

2. **Update Backend CORS**
   - Set `FRONTEND_URL` di Railway Variables
   - Redeploy backend

3. **Test Integration**
   - Test analyze endpoint dari frontend
   - Verify cache works
   - Check error handling

4. **Monitor**
   - Check Vercel Analytics
   - Review deployment logs
   - Monitor performance

5. **Custom Domain** (Optional)
   - Add custom domain di Vercel
   - Update DNS records
   - Update backend CORS

---

## 📞 Resources

- Vercel Docs: https://vercel.com/docs
- Next.js + Vercel: https://nextjs.org/docs/deployment
- Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables

---

**Status**: ✅ **FRONTEND SIAP DEPLOY KE VERCEL!**

Semua konfigurasi sudah lengkap. Tinggal:
1. Push ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy!

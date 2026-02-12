# ✅ Vercel Deployment Checklist

## 📋 Pre-Deployment Checklist

### 1. Code & Configuration
- [x] `package.json` memiliki script `build`, `start`, `dev`
- [x] `vercel.json` sudah dibuat
- [x] `.env.example` sudah dibuat
- [x] `.gitignore` mencakup `.env.local` dan `.next`
- [x] Next.js configuration sudah benar
- [x] Build test berhasil (no errors)

### 2. Environment Variables yang Diperlukan
Siapkan nilai-nilai berikut untuk di-set di Vercel:

```env
# ✅ Required - Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
```

**⚠️ PENTING:**
- Ganti `https://your-backend.up.railway.app/api` dengan URL Railway backend Anda
- URL **TANPA** trailing slash
- Variable **HARUS** diawali dengan `NEXT_PUBLIC_`

### 3. Backend Prerequisites
- [x] Backend sudah deployed di Railway
- [ ] Copy backend URL dari Railway Dashboard
- [ ] Backend health endpoint accessible: `/health`

---

## 🚀 Deployment Steps

### Step 1: Push ke GitHub
```bash
git add .
git commit -m "chore: add Vercel deployment configuration"
git push origin main
```

### Step 2: Setup Vercel Project

#### Option A: Via Vercel Dashboard (Recommended)
1. Login ke https://vercel.com
2. Klik **"Add New..."** → **"Project"**
3. **Import Git Repository**
4. Pilih repository `gap-arch-solvara`
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `fe-gap-arch`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from fe-gap-arch directory
cd fe-gap-arch
vercel
```

### Step 3: Set Environment Variables
Di Vercel Dashboard → Project → Settings → Environment Variables:

**Add Variable:**
- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://your-backend.up.railway.app/api`
- **Environment**: Production, Preview, Development

### Step 4: Deploy
Vercel akan otomatis:
1. Detect Next.js framework
2. Run `npm install`
3. Run `npm run build`
4. Deploy ke Edge Network
5. Generate production URL

### Step 5: Get Deployment URL
Setelah deploy sukses:
- Production URL: `https://your-app.vercel.app`
- Copy URL ini untuk update backend CORS

---

## 🔍 Post-Deployment Verification

### 1. Check Deployment Status
- [ ] Build completed successfully
- [ ] No build errors
- [ ] Deployment status: Ready
- [ ] Production URL accessible

### 2. Test Frontend
```bash
# Test homepage
curl https://your-app.vercel.app

# Expected: HTML page
```

### 3. Test API Integration
1. Buka `https://your-app.vercel.app` di browser
2. Paste resume text (≥50 chars)
3. Paste job description (≥20 chars)
4. Klik "Analyze Gap"
5. Verify hasil analysis muncul

### 4. Update Backend CORS
Di Railway backend → Environment Variables:
```env
FRONTEND_URL=https://your-app.vercel.app
```

Redeploy backend Railway.

### 5. Test End-to-End
- [ ] Frontend dapat connect ke backend
- [ ] Analyze endpoint works
- [ ] Results display correctly
- [ ] Cache indicator works
- [ ] No CORS errors

---

## 🔧 Common Issues & Solutions

### Issue: "Build failed"
**Solution:**
- Check build logs di Vercel Dashboard
- Test locally: `npm run build`
- Fix errors dan push ke GitHub
- Vercel auto-redeploy

### Issue: "Cannot connect to backend"
**Solution:**
- Verify `NEXT_PUBLIC_API_URL` di Vercel Environment Variables
- Test backend: `curl https://your-backend.up.railway.app/health`
- Check backend is running di Railway
- Redeploy frontend

### Issue: "CORS error"
**Solution:**
- Update `FRONTEND_URL` di Railway backend
- Set to: `https://your-app.vercel.app`
- Redeploy backend
- Clear browser cache

### Issue: "Environment variable undefined"
**Solution:**
- Check variable name: `NEXT_PUBLIC_API_URL`
- Check environment scope: Production
- Redeploy project after adding variable

---

## 📊 Monitoring

### Vercel Dashboard
- **Deployments**: View history dan status
- **Analytics**: Page views, visitors (Pro plan)
- **Speed Insights**: Performance metrics
- **Logs**: Build dan function logs

### Performance Checks
- [ ] Page load time < 3 seconds
- [ ] No console errors
- [ ] API calls successful
- [ ] Images load correctly (if any)

---

## 🔄 Update & Redeploy

### Auto Deploy (Default)
1. Push code ke GitHub
2. Vercel auto-detect changes
3. Auto-trigger deployment
4. Production URL stays the same

### Manual Redeploy
1. Vercel Dashboard → Project → Deployments
2. Select latest deployment
3. Click **"Redeploy"**

### Rollback
1. Vercel Dashboard → Deployments
2. Select previous deployment
3. Click **"Promote to Production"**

---

## 🎯 Next Steps After Frontend Deploy

1. **Copy Frontend URL**
   - Format: `https://your-app.vercel.app`

2. **Update Backend CORS**
   - Railway → Environment Variables
   - Set `FRONTEND_URL=https://your-app.vercel.app`
   - Redeploy backend

3. **Test Integration**
   - Test analyze dari frontend
   - Verify cache works
   - Check error handling

4. **Monitor**
   - Check Vercel Analytics
   - Review logs
   - Monitor performance

5. **Custom Domain** (Optional)
   - Add domain di Vercel Settings
   - Update DNS records
   - Update backend CORS

---

## 💡 Tips

- **Free Tier**: Vercel Hobby plan is FREE (perfect untuk project ini)
- **Auto Deploy**: Enable GitHub integration untuk auto-deploy on push
- **Preview Deployments**: Setiap PR gets preview URL
- **Instant Rollback**: Easy rollback ke deployment sebelumnya
- **Edge Network**: Global CDN untuk fast loading

---

## 📞 Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables

---

**Status**: ✅ **FRONTEND SIAP DEPLOY KE VERCEL!**

Semua konfigurasi sudah lengkap. Tinggal:
1. Push ke GitHub
2. Import project di Vercel
3. Set `NEXT_PUBLIC_API_URL`
4. Deploy!

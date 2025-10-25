# Vercel CLI Setup & Auto-Deploy Configuration

## Quick Setup (Automated)

Run the setup script:

```bash
cd /Volumes/MrMoe28Hub/dev-workspace/Apps/countcraft
chmod +x setup-vercel.sh
./setup-vercel.sh
```

This will:
1. ✅ Install Vercel CLI globally
2. ✅ Login to Vercel (opens browser)
3. ✅ Link project to Vercel
4. ✅ Set up environment variables
5. ✅ Deploy to production
6. ✅ Enable auto-deploy on GitHub push

---

## Manual Setup (Step-by-Step)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

This opens your browser for authentication.

### 3. Link Your Project

```bash
cd /Volumes/MrMoe28Hub/dev-workspace/Apps/countcraft
vercel link
```

Answer the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Select your account
- **Link to existing project?** No
- **What's your project's name?** countcraft
- **In which directory is your code located?** ./

### 4. Add Environment Variables

```bash
# Add OpenAI API Key
vercel env add OPENAI_API_KEY production
# Paste your OpenAI API key when prompted

# Add Database URL
vercel env add DATABASE_URL production
# Enter: file:./prod.db
```

**For production, consider PostgreSQL:**
```bash
# Using Vercel Postgres
vercel postgres create
vercel env pull
```

### 5. Deploy to Production

```bash
vercel --prod
```

---

## GitHub Auto-Deploy

Once you've linked your project, **Vercel automatically integrates with GitHub**:

### ✅ What's Enabled:

1. **Every push to `main`** triggers a production deployment
2. **Pull requests** create preview deployments
3. **Deployment status** shows in GitHub commits
4. **Automatic rollback** on failed deployments

### How It Works:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically:
# ✓ Detects the push
# ✓ Builds your app
# ✓ Runs tests
# ✓ Deploys to production
```

### Verify Integration:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. Go to **Settings** → **Git**
4. You should see `mrmoe28/count-craft` connected

### Deployment Logs:

```bash
# View recent deployments
vercel ls

# View logs for a specific deployment
vercel logs [deployment-url]

# Stream production logs
vercel logs --follow
```

---

## Useful Vercel Commands

```bash
# Preview deployment (non-production)
vercel

# Production deployment
vercel --prod

# View all deployments
vercel ls

# View environment variables
vercel env ls

# Add environment variable
vercel env add KEY_NAME production

# Pull env vars to local
vercel env pull .env.local

# View project details
vercel inspect

# Remove project
vercel remove countcraft

# View logs
vercel logs

# Open project in browser
vercel open

# Add custom domain
vercel domains add yourdomain.com
```

---

## Deployment Status

Check deployment status:

### Via CLI:
```bash
vercel ls
```

### Via GitHub:
- Go to your repository
- Check the **Deployments** section
- See commit statuses (✓ or ✗)

### Via Vercel Dashboard:
- Visit [vercel.com/dashboard](https://vercel.com/dashboard)
- Click your project
- View deployment history

---

## Troubleshooting

### Build Fails

1. Check logs:
   ```bash
   vercel logs [deployment-url]
   ```

2. Common issues:
   - Missing dependencies
   - TypeScript errors
   - Environment variables not set

3. Test locally first:
   ```bash
   npm run build
   ```

### Auto-Deploy Not Working

1. **Verify GitHub integration:**
   - Vercel Dashboard → Project → Settings → Git
   - Should show `mrmoe28/count-craft` connected

2. **Check webhook:**
   - GitHub repo → Settings → Webhooks
   - Should see Vercel webhook active

3. **Re-link if needed:**
   ```bash
   vercel link --yes
   ```

### Environment Variables Not Applied

1. **Add to all environments:**
   ```bash
   vercel env add KEY_NAME production
   vercel env add KEY_NAME preview
   vercel env add KEY_NAME development
   ```

2. **Redeploy after adding:**
   ```bash
   vercel --prod --force
   ```

---

## Production Checklist

Before going live:

- [ ] Environment variables set in Vercel Dashboard
- [ ] OpenAI API key configured
- [ ] Database connection tested
- [ ] Custom domain added (optional)
- [ ] Deployment logs reviewed
- [ ] Test deployment works
- [ ] Auto-deploy verified (push → deploy)

---

## Next Steps

1. **Run the setup script** or follow manual steps
2. **Push to GitHub** to test auto-deploy
3. **Visit your live site** at `https://countcraft.vercel.app`
4. **Add custom domain** (optional)

---

**Need help?**
- Vercel Docs: https://vercel.com/docs
- CLI Reference: https://vercel.com/docs/cli
- Support: https://vercel.com/support

**Your app will be live at:** `https://countcraft-[hash].vercel.app`

🎉 Happy deploying!

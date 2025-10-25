# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (already done!)
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import `mrmoe28/count-craft` repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**

   In Vercel Dashboard → Project Settings → Environment Variables, add:

   ```
   DATABASE_URL=file:./prod.db
   ```

   **⚠️ Important Database Note:**
   - SQLite works for development but has limitations in serverless environments
   - For production, consider migrating to:
     - **PostgreSQL** (Vercel Postgres, Neon, Supabase)
     - **Turso** (SQLite-compatible, serverless-optimized)
     - **PlanetScale** (MySQL-compatible)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Post-Deployment Setup

### 1. Database Migration (if using PostgreSQL)

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

Then in Vercel:
```bash
# Add Vercel Postgres
vercel postgres create

# Link to project
vercel env pull

# Push schema
npx prisma db push
```

### 2. Test Your Deployment

- ✅ Upload an audio file
- ✅ Generate 8-count grid
- ✅ Edit count annotations
- ✅ Test speak-to-fill (requires HTTPS)
- ✅ Export JSON/CSV

### 3. Custom Domain (Optional)

In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Vercel Configuration

The project includes `vercel.json` with optimized settings:

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database_url"
  }
}
```

## Excluded from Deployment

The `.vercelignore` file excludes:
- README.md
- Development database files
- Test files
- Local environment files
- Git history

## Environment Variables

Set these in Vercel Dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `file:./prod.db` or PostgreSQL URL | Database connection string |
| `NODE_ENV` | `production` | Node environment (auto-set by Vercel) |

## Troubleshooting

### Build Fails

1. Check build logs in Vercel Dashboard
2. Ensure all dependencies are in `dependencies` (not `devDependencies`)
3. Verify `postinstall` script runs `prisma generate`

### Database Connection Errors

- SQLite limitations: File-based databases don't persist across serverless invocations
- **Solution**: Migrate to PostgreSQL or Turso for production

### Speech Recognition Not Working

- Web Speech API requires HTTPS (Vercel provides this automatically)
- Only works in Chrome/Edge browsers

### Large Audio Files

- Vercel has 50MB deployment size limit
- Audio files are loaded client-side (not stored on server)
- For large files, consider cloud storage (S3, Cloudflare R2)

## Continuous Deployment

Vercel automatically deploys on every push to `main`:

```bash
# Make changes
git add .
git commit -m "feat: your changes"
git push origin main

# Vercel deploys automatically
```

## Performance Optimization

Already included:
- ✅ No Turbopack (disabled per best practices)
- ✅ Next.js 15 App Router
- ✅ Optimized imports
- ✅ Server actions for API calls
- ✅ Client-side audio processing

## Monitoring

Access in Vercel Dashboard:
- **Analytics**: Page views, performance metrics
- **Logs**: Runtime and build logs
- **Deployments**: History and rollback options

## Cost

Vercel Free Tier includes:
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function execution
- HTTPS & CDN

For production apps with high traffic, consider Pro plan.

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

**Ready to deploy?** Just push to GitHub and import in Vercel! 🚀

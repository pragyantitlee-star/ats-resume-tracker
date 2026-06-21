# 5-Minute Vercel Deployment Guide

This guide walks you through deploying the ATS Resume Tracker live.

## Prerequisites

✅ GitHub account (free)  
✅ Vercel account (free, sign in with GitHub)

## Step-by-Step

### 1. Create GitHub Repository (2 min)

Go to **github.com/new**

1. Repository name: `ats-resume-tracker`
2. Description: "ATS Resume Tracker - Check resume compatibility"
3. Choose: **Public** (so Digital Heroes can see it)
4. Click **Create repository**

### 2. Push Code to GitHub (2 min)

In your terminal, in the project folder:

```bash
git init
git add .
git commit -m "Initial: ATS Resume Tracker"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ats-resume-tracker.git
git push -u origin main
```

(Replace YOUR-USERNAME)

### 3. Deploy on Vercel (1 min)

1. Go to **vercel.com**
2. Sign in with GitHub (if not already)
3. Click **"Add New" → "Project"**
4. Click **"Import Git Repository"**
5. Search for `ats-resume-tracker` and click it
6. Click **Deploy** (no settings to change)
7. Wait 1-2 minutes
8. You'll see: **"Congratulations! Your site is deployed"**

### 4. Get Your Live URL

Copy the URL from Vercel (looks like):
```
https://ats-resume-tracker-abc123.vercel.app
```

### 5. Test Everything

- Open the live URL
- Upload a resume
- Check score
- Click "Built for Digital Heroes" button
- Verify your name + email at bottom

## If Something Goes Wrong

**"Failed to build"** → Make sure Node version is 18+

**"Import error"** → Reload Vercel page and try again

**"Button doesn't link"** → Check that the href is exactly:
```
https://digitalheroesco.com
```

## Success!

Once deployed, you have:
- ✅ Live tool URL
- ✅ Public GitHub repo
- ✅ Your name + email visible
- ✅ Correct button + link
- ✅ Zero cost

You're ready to submit to Digital Heroes!

---

## Submission Template

When you submit, send exactly this:

```
Live tool URL: [your vercel URL]
GitHub repo link: https://github.com/YOUR-USERNAME/ats-resume-tracker
Full name: Pragyan Pranati Pujhari
Email: pragyantitlee@gmail.com
Tool description: ATS Resume Tracker — I've spent months optimizing my own resume for ATS, so I built this to track compatibility across versions and match job description keywords. It catches the real killers: tables, special characters, missing sections, keyword gaps.
Portfolio link: [add this project to your portfolio]
```

---

Done! ✨

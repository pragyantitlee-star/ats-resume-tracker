# ATS Resume Tracker

**Check your resume for ATS compatibility • Track versions • Match job descriptions**

A free tool to analyze how your resume will parse in Applicant Tracking Systems (ATS), identify critical formatting issues, and compare keyword gaps against job descriptions.

## What It Does

- **ATS Score (0-100):** Real-time feedback on ATS compatibility
- **Issue Detection:** Identifies critical formatting problems, missing sections, and keyword gaps
- **Version Tracking:** Upload multiple resume versions and compare scores
- **Job Matching:** Paste job descriptions to see keyword coverage
- **CSV Reports:** Download tracking data for your records

## How to Deploy on Vercel (Free)

### Step 1: Initialize Git & Push to GitHub

```bash
# In the project directory
git init
git add .
git commit -m "Initial commit: ATS Resume Tracker"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ats-resume-tracker.git
git push -u origin main
```

*(Replace `YOUR-USERNAME` with your actual GitHub username)*

### Step 2: Deploy to Vercel

1. Go to **vercel.com** and sign in with GitHub (free account)
2. Click **"Add New" → "Project"**
3. Find your `ats-resume-tracker` repository and click **Import**
4. Click **Deploy** (no configuration needed — defaults work perfectly)
5. Wait ~1-2 minutes for deployment
6. Copy your live URL (looks like: `https://ats-resume-tracker-abc123.vercel.app`)

### Step 3: Test the Live Tool

- Open your live URL
- Upload or paste a resume
- Check the ATS score and feedback
- Verify the "Built for Digital Heroes" button links to digitalheroesco.com

## Local Development (Optional)

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## What Gets Checked

### Critical Issues (Major point loss)
- HTML tables (ATS cannot parse)
- Special bullet characters (●, ▪, ◆, etc. → use -, *)
- Images/graphics (ATS skips them)

### Important Issues
- Missing sections (Experience, Education, Skills, Projects)
- No email address
- Multi-column layouts
- Keyword gaps (vs. job description)

### Positive Checks
- Clear section headers
- Contact email included
- Bullet point usage

## Files Structure

```
ats-resume-tracker/
├── app/
│   ├── components/
│   │   └── ATSResumeTracker.js      # Main tool component
│   ├── page.js                       # Home page
│   ├── layout.js                     # Layout wrapper
│   └── globals.css                   # Styles
├── package.json                      # Dependencies
├── next.config.js                    # Next.js config
└── .gitignore                        # Git ignore file
```

## Submission Checklist

- ✅ Tool works and gives correct ATS scores
- ✅ "Built for Digital Heroes" button links correctly
- ✅ Name (Pragyan Pranati Pujhari) and email visible
- ✅ Deployed live on Vercel free plan
- ✅ GitHub repo is public
- ✅ No paid subscriptions used
- ✅ Added to portfolio website

## What to Send

Send Digital Heroes this information:

```
Live URL: https://your-vercel-url.vercel.app
GitHub Repo: https://github.com/your-username/ats-resume-tracker
Name: Pragyan Pranati Pujhari
Email: pragyantitlee@gmail.com
Tool: ATS Resume Tracker — Track resume versions for ATS compatibility and job keyword matching. Built from personal experience optimizing my own resume for HR/equity research roles.
Portfolio Link: [Your portfolio URL showing this project]
```

## Why This Tool

You've spent months optimizing your CV for ATS, so you know the pain. Most resume builders don't check for the real ATS killers (tables, special characters, missing sections). This tool gives you a score and actionable feedback — something you actually needed.

---

**Built by Pragyan Pranati Pujhari** | pragyantitlee@gmail.com

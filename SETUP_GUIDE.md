# Assignment 3: Complete Setup & Deployment Guide

**Status:** ✅ Code Repository Ready | ⏳ Deployment Setup Required  
**Date:** May 13, 2026

---

## 📋 Table of Contents

1. [What's Been Completed](#whats-been-completed)
2. [What You Need to Do](#what-you-need-to-do)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Verification Checklist](#verification-checklist)

---

## ✅ What's Been Completed

### Code & Infrastructure Files Created

- ✅ **Backend Server** (`backend/server.js`) - Express API with PostgreSQL integration
- ✅ **Frontend App** (`frontend/src/`) - React todo app with API client
- ✅ **Docker Setup** - Both backend and frontend Dockerfiles with multi-stage builds
- ✅ **GitHub Actions Workflow** (`.github/workflows/deploy.yml`) - Automated CI/CD pipeline
- ✅ **Docker Compose** - Local development environment
- ✅ **Documentation** - Comprehensive guides and examples
- ✅ **Git Repository** - All code committed and pushed to GitHub

### Features Implemented

- ✅ Full CRUD endpoints (`GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`)
- ✅ Responsive React UI with task management
- ✅ PostgreSQL database auto-initialization
- ✅ CORS support for cross-domain API calls
- ✅ Environment-based configuration
- ✅ Error handling and validation

---

## ⏳ What You Need to Do (4 Main Steps)

### **STEP 1: Create PostgreSQL Database on Render (5 minutes)**
### **STEP 2: Set Up GitHub Secrets (5 minutes)**
### **STEP 3: Create Render Services (10 minutes)**
### **STEP 4: Test the Pipeline (5 minutes)**

---

## 🚀 Step-by-Step Deployment

### STEP 1: Create PostgreSQL Database on Render

#### 1.1 Navigate to Render Dashboard
```
Go to: https://dashboard.render.com
Login with your Render account
```

#### 1.2 Create PostgreSQL Service

1. Click the **"New +"** button in the top-right
2. Select **"PostgreSQL"**
3. Fill in the form with these values:

| Field | Value |
|-------|-------|
| **Name** | `todo-db-a3` |
| **Database** | `todo_db_new` |
| **User** | `todo_admin` |
| **Region** | Choose closest to you (e.g., Singapore, US East) |
| **Plan** | Free |

4. Click **"Create Database"**

#### 1.3 Wait for Database Creation
- Render will take 2-3 minutes to create the database
- Once ready, you'll see a green checkmark

#### 1.4 Extract Database Credentials

1. Click on your database name in the dashboard
2. Scroll to **"Connections"** section
3. Copy the **"External Database URL"** (looks like):
   ```
   postgresql://todo_admin:YOUR_PASSWORD@dpg-xxxx.render.com:5432/todo_db_new
   ```

4. Extract these values (you'll need them in STEP 2):
   ```
   DB_HOST=dpg-xxxx.render.com
   DB_USER=todo_admin
   DB_PASSWORD=YOUR_PASSWORD
   DB_NAME=todo_db_new
   DB_PORT=5432
   ```

✅ **Save these credentials somewhere safe - you'll need them in the next step**

---

### STEP 2: Set Up GitHub Secrets

#### 2.1 Navigate to GitHub Repository Settings

1. Go to your GitHub repository: `https://github.com/YourUsername/DSO_assign3`
2. Click **Settings** → **Secrets and variables** → **Actions**

#### 2.2 Create DockerHub Credentials

If you don't have a DockerHub access token:

1. Go to https://hub.docker.com/settings/security
2. Click **"New Access Token"**
3. Give it a name: `github-actions`
4. Click **"Generate"**
5. **Copy the token** (you won't see it again)

#### 2.3 Add 4 Required Secrets to GitHub

Go back to your GitHub Secrets page and add these 4 secrets:

**Secret 1: DockerHub Username**
- **Name:** `DOCKERHUB_USERNAME`
- **Value:** Your DockerHub username (e.g., `yonten1234567890`)
- Click **"Add secret"**

**Secret 2: DockerHub Token**
- **Name:** `DOCKERHUB_TOKEN`
- **Value:** The access token from DockerHub (the one you just created)
- Click **"Add secret"**

**Secret 3: Render Backend Deploy Hook** (you'll get this in STEP 3)
- **Name:** `RENDER_BACKEND_DEPLOY_HOOK`
- **Value:** Will fill this after creating backend service
- Click **"Add secret"**

**Secret 4: Render Frontend Deploy Hook** (you'll get this in STEP 3)
- **Name:** `RENDER_FRONTEND_DEPLOY_HOOK`
- **Value:** Will fill this after creating frontend service
- Click **"Add secret"**

✅ **For now, add secrets 1 & 2. You'll add secrets 3 & 4 after creating Render services.**

---

### STEP 3: Create Render Web Services

#### 3.1 Create Backend Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy from an existing image"**
4. Enter Docker image path:
   ```
   yonten1234567890/todo-backend:latest
   ```
   (Replace `yonten1234567890` with your DockerHub username)

5. Fill in service details:

| Field | Value |
|-------|-------|
| **Name** | `be-todo` |
| **Plan** | Free |
| **Region** | Same as database (important!) |
| **Port** | 5000 |

6. Click **"Advanced"** and add Environment Variables:

| Key | Value |
|-----|-------|
| `DB_HOST` | `dpg-xxxx.render.com` (from database credentials) |
| `DB_USER` | `todo_admin` |
| `DB_PASSWORD` | Your database password |
| `DB_NAME` | `todo_db_new` |
| `DB_PORT` | `5432` |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |

7. Click **"Create Web Service"**
8. Wait for deployment to complete (~2-3 minutes)

#### 3.2 Get Backend Deploy Hook

1. After backend service is created and deployed
2. Go to service **Settings**
3. Find **"Deploy Hook"** section
4. Copy the webhook URL
5. Go to GitHub → Settings → Secrets → Add Secret
   - **Name:** `RENDER_BACKEND_DEPLOY_HOOK`
   - **Value:** Paste the webhook URL

#### 3.3 Create Frontend Service

1. Back on Render dashboard, click **"New +"** → **"Web Service"**
2. Select **"Deploy from an existing image"**
3. Enter Docker image:
   ```
   yonten1234567890/todo-frontend:latest
   ```

4. Fill in service details:

| Field | Value |
|-------|-------|
| **Name** | `fe-todo` |
| **Plan** | Free |
| **Region** | Same as database & backend |
| **Port** | 80 |

5. Add Environment Variable:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://be-todo.onrender.com` |
| `NODE_ENV` | `production` |

   (Replace `be-todo` with your actual backend service name if different)

6. Click **"Create Web Service"**
7. Wait for deployment (~2-3 minutes)

#### 3.4 Get Frontend Deploy Hook

1. After frontend service is created and deployed
2. Go to service **Settings**
3. Find **"Deploy Hook"** section
4. Copy the webhook URL
5. Go to GitHub → Settings → Secrets → Add Secret
   - **Name:** `RENDER_FRONTEND_DEPLOY_HOOK`
   - **Value:** Paste the webhook URL

✅ **Now all 4 GitHub Secrets should be configured**

---

### STEP 4: Test the CI/CD Pipeline

#### 4.1 Trigger GitHub Actions Workflow

1. Go to your GitHub repository
2. Make a small change (e.g., edit README.md)
3. Commit and push:
   ```bash
   git add README.md
   git commit -m "Update: test CI/CD pipeline"
   git push origin main
   ```

#### 4.2 Watch GitHub Actions

1. Go to **GitHub** → **Actions** tab
2. See "Build and Deploy" workflow running
3. Watch each step complete:
   - ✅ Checkout Repository
   - ✅ Setup Docker Buildx
   - ✅ Login to DockerHub
   - ✅ Build Backend Image
   - ✅ Push Backend Image
   - ✅ Build Frontend Image
   - ✅ Push Frontend Image
   - ✅ Trigger Render Webhooks

#### 4.3 Verify DockerHub

1. Go to https://hub.docker.com
2. Find your repositories:
   - `todo-backend` (should have `latest` tag)
   - `todo-frontend` (should have `latest` tag)

#### 4.4 Verify Render Deployment

1. Go to https://dashboard.render.com
2. Click on backend service `be-todo`
3. Wait for "Live" status (green checkmark)
4. Click on frontend service `fe-todo`
5. Wait for "Live" status (green checkmark)

#### 4.5 Test Application

1. Get your frontend URL from Render dashboard (e.g., `https://fe-todo.onrender.com`)
2. Open in browser
3. Try adding a task
4. Verify it saves and displays

---

## ✅ Verification Checklist

- [ ] PostgreSQL database created on Render
- [ ] Database credentials extracted and saved
- [ ] GitHub Secrets configured (all 4)
- [ ] Backend service deployed on Render
- [ ] Frontend service deployed on Render
- [ ] GitHub Actions workflow executed successfully
- [ ] Docker images pushed to DockerHub
- [ ] Frontend accessible at Render URL
- [ ] Backend API responding at Render URL
- [ ] Tasks can be created/read/updated/deleted

---

## 🔗 Final URLs for Assignment Submission

Once everything is working, collect these URLs:

| Component | URL |
|-----------|-----|
| **GitHub Repository** | https://github.com/YourUsername/DSO_assign3 |
| **Frontend Application** | https://fe-todo.onrender.com |
| **Backend API** | https://be-todo.onrender.com |
| **DockerHub Backend** | https://hub.docker.com/r/YourUsername/todo-backend |
| **DockerHub Frontend** | https://hub.docker.com/r/YourUsername/todo-frontend |
| **GitHub Actions** | https://github.com/YourUsername/DSO_assign3/actions |

---

## 📸 Screenshots to Take

For your assignment report, take screenshots of:

1. **GitHub Actions Workflow Success**
   - All steps showing green checkmarks
   - Build number and timestamp

2. **DockerHub Images**
   - Backend image pushed with `latest` tag
   - Frontend image pushed with `latest` tag
   - Recent push timestamps

3. **Render Dashboard**
   - Backend service showing "Live" status
   - Frontend service showing "Live" status
   - Database service showing "Available" status

4. **Application Running**
   - Frontend page loaded in browser
   - Tasks displayed or ability to add tasks
   - Browser address bar showing Render URL

5. **GitHub Secrets Configuration**
   - Settings page showing 4 secrets are configured

---

## 🆘 Troubleshooting

### GitHub Actions Won't Run
- [ ] Repository is public? (GitHub → Settings → Visibility)
- [ ] All 4 secrets are configured?
- [ ] Secrets have correct values (no extra spaces)?

### Docker Images Won't Push
- [ ] DockerHub token is still valid?
- [ ] DockerHub username correct?
- [ ] Repository name matches exactly?

### Render Services Won't Deploy
- [ ] Docker image exists in DockerHub?
- [ ] All environment variables set correctly?
- [ ] Region matches database region?
- [ ] Port numbers correct (5000 for backend, 80 for frontend)?

### Frontend Can't Connect to Backend
- [ ] Backend service is "Live"?
- [ ] `REACT_APP_API_URL` is correct?
- [ ] Backend API is responding (test with curl)?

### Database Connection Fails
- [ ] Database credentials copied correctly?
- [ ] No extra spaces in DB_PASSWORD?
- [ ] Database is "Available" (not suspended)?

---

## 📞 Need Help?

Refer to the comprehensive guide at: **ASSIGNMENT_3_README.md**

---

**Good luck! You're almost there! 🚀**


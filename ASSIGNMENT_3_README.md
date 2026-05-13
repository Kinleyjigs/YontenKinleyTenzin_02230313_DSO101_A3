# Assignment 3: GitHub Actions CI/CD Pipeline - Todo Application

**Student:** Yonten Kinley Tenzin  
**Student ID:** 02230313  
**Date:** May 13, 2026

---

## Table of Contents
1. [Overview](#overview)
2. [Objectives](#objectives)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Setup Instructions](#setup-instructions)
6. [GitHub Actions Workflow](#github-actions-workflow)
7. [Deployment Guide](#deployment-guide)
8. [GitHub Secrets Configuration](#github-secrets-configuration)
9. [Screenshots](#screenshots)
10. [Challenges & Solutions](#challenges--solutions)
11. [Learning Outcomes](#learning-outcomes)

---

## Overview

This assignment demonstrates the implementation of a complete CI/CD pipeline using GitHub Actions to automate:
- Docker container building and testing
- Pushing container images to DockerHub
- Automated deployment to Render.com

The Todo List application from Assignment 1 (React, Node.js, Express, PostgreSQL) is used as the basis for this CI/CD implementation.

---

## Objectives

✅ **Task 1:** Verify GitHub repository setup
- Repository is **public**
- `package.json` contains proper scripts (`start`, `dev`, `build`)
- All source code is committed and accessible

✅ **Task 2:** Verify and create Dockerfiles
- Backend Dockerfile uses Node.js 18-Alpine
- Frontend Dockerfile implements multi-stage build
- Both containers expose appropriate ports

✅ **Task 3:** Create GitHub Actions workflow
- Implement `.github/workflows/deploy.yml`
- Configure DockerHub login and image push
- Set up Render deployment webhooks
- Add GitHub Secrets for credentials

✅ **Task 4:** Deploy on Render.com
- Create new PostgreSQL database on Render
- Deploy backend and frontend services
- Configure environment variables

---

## Technologies Used

| Technology | Purpose | Version |
|-----------|---------|---------|
| **GitHub** | Source code hosting | Latest |
| **GitHub Actions** | CI/CD automation | Built-in |
| **Docker** | Containerization | 24.x |
| **DockerHub** | Container registry | Public repo |
| **Render.com** | Cloud deployment | Free tier |
| **Node.js** | Backend runtime | 18-Alpine |
| **React** | Frontend framework | 18.2.0 |
| **Express.js** | Backend framework | 4.18.2 |
| **PostgreSQL** | Database | 15-Alpine |
| **npm** | Package manager | Latest |

---

## Project Structure

```
DSO_assign3/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Actions workflow
├── backend/
│   ├── Dockerfile                     # Backend container definition
│   ├── package.json                   # Backend dependencies
│   ├── server.js                      # Express API server
│   └── .env.example                   # Environment template
├── frontend/
│   ├── Dockerfile                     # Frontend container definition
│   ├── package.json                   # Frontend dependencies
│   ├── public/
│   │   └── index.html                 # HTML entry point
│   └── src/
│       ├── index.js                   # React entry point
│       ├── App.js                     # Main component
│       ├── App.css                    # App styling
│       ├── index.css                  # Global styling
│       ├── api.js                     # API client
│       └── .env.example               # Environment template
├── docker-compose.yml                 # Local development container setup
├── render.yaml                        # Render deployment configuration
└── README.md                          # This file

```

---

## Setup Instructions

### 1. Prerequisites

Ensure you have the following accounts and tools:
- **GitHub Account** (public repository)
- **DockerHub Account** (public repository)
- **Render.com Account** (free tier)
- **Docker Desktop** (for local testing)
- **Git** (for version control)
- **Node.js 18+** (for local development)

### 2. Repository Setup

```bash
# Clone the repository
git clone https://github.com/YourUsername/DSO_assign3.git
cd DSO_assign3

# Ensure repository is public
# Navigate to GitHub → Settings → Visibility → Change to Public

# Verify package.json files have correct scripts
cat backend/package.json
cat frontend/package.json
```

### 3. Local Environment Setup

#### Backend
```bash
cd backend

# Create .env file (copy from .env.example for local development)
cp .env.example .env

# Install dependencies
npm install

# Test locally (requires PostgreSQL running)
npm start
```

#### Frontend
```bash
cd frontend

# Create .env file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Docker Compose Setup (Local Testing)

```bash
# Build and run all services locally
docker-compose up --build

# Check running containers
docker ps

# Access application
# Backend: http://localhost:5001
# Frontend: http://localhost:80

# Stop containers
docker-compose down
```

---

## GitHub Actions Workflow

### Workflow File: `.github/workflows/deploy.yml`

The workflow is triggered on every push to the `main` branch and performs the following steps:

#### 1. **Checkout Repository**
```yaml
- name: Checkout Repository
  uses: actions/checkout@v4
```
Downloads the latest code from the repository.

#### 2. **Setup Docker Buildx**
```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3
```
Enables advanced Docker building capabilities for multi-platform images.

#### 3. **DockerHub Authentication**
```yaml
- name: Login to DockerHub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}
```
Authenticates with DockerHub using stored secrets.

#### 4. **Build Backend Docker Image**
```yaml
- name: Build and Push Backend Docker Image
  uses: docker/build-push-action@v5
  with:
    context: ./backend
    file: ./backend/Dockerfile
    push: true
    tags: |
      ${{ secrets.DOCKERHUB_USERNAME }}/todo-backend:latest
      ${{ secrets.DOCKERHUB_USERNAME }}/todo-backend:${{ github.run_number }}
```
- Builds Docker image from `./backend/Dockerfile`
- Tags with both `latest` and build number
- Pushes to DockerHub

#### 5. **Build Frontend Docker Image**
```yaml
- name: Build and Push Frontend Docker Image
  uses: docker/build-push-action@v5
  with:
    context: ./frontend
    file: ./frontend/Dockerfile
    push: true
    tags: |
      ${{ secrets.DOCKERHUB_USERNAME }}/todo-frontend:latest
      ${{ secrets.DOCKERHUB_USERNAME }}/todo-frontend:${{ github.run_number }}
```
- Builds Docker image from `./frontend/Dockerfile`
- Tags with both `latest` and build number
- Pushes to DockerHub

#### 6. **Trigger Render Deployment**
```yaml
- name: Trigger Render Backend Deployment
  run: |
    curl -X POST ${{ secrets.RENDER_BACKEND_DEPLOY_HOOK }}
  continue-on-error: true

- name: Trigger Render Frontend Deployment
  run: |
    curl -X POST ${{ secrets.RENDER_FRONTEND_DEPLOY_HOOK }}
  continue-on-error: true
```
- Makes HTTP POST requests to Render deployment webhooks
- Automatically redeploys services when new images are pushed

---

## Deployment Guide

### Step 1: Create PostgreSQL Database on Render

1. **Go to Render Dashboard**
   - Navigate to https://dashboard.render.com
   - Sign in with your Render account

2. **Create PostgreSQL Service**
   - Click "New +" → "PostgreSQL"
   - Set the following:
     - **Name:** `todo-db` (or similar)
     - **Database:** `todo_db_new`
     - **User:** `todo_admin`
     - **Region:** Choose closest to you
     - **Plan:** Free tier
   - Click "Create Database"

3. **Wait for Database to Initialize**
   - Render will create the database (~2-3 minutes)
   - Once ready, you'll see the connection string

4. **Copy Database Credentials**
   - Copy the connection string (looks like):
   ```
   postgresql://todo_admin:PASSWORD@host.render.com:5432/todo_db_new
   ```
   - Extract:
     - **DB_HOST:** `host.render.com`
     - **DB_USER:** `todo_admin`
     - **DB_PASSWORD:** Copy from connection string
     - **DB_NAME:** `todo_db_new`
     - **DB_PORT:** `5432`

### Step 2: Create Backend Service on Render

1. **Create Web Service**
   - Click "New +" → "Web Service"
   - Select "Deploy from existing image"
   - Enter: `YOUR_DOCKERHUB_USERNAME/todo-backend:latest`

2. **Configure Service**
   - **Name:** `be-todo`
   - **Plan:** Free tier
   - **Region:** Same as database
   - **Port:** 5000

3. **Add Environment Variables**
   ```
   DB_HOST=<from database credentials>
   DB_USER=todo_admin
   DB_PASSWORD=<from database credentials>
   DB_NAME=todo_db_new
   DB_PORT=5432
   PORT=5000
   NODE_ENV=production
   ```

4. **Copy Deploy Hook URL**
   - After creation, go to Settings
   - Find "Deploy Hook" section
   - Copy the webhook URL (needed for GitHub)

### Step 3: Create Frontend Service on Render

1. **Create Web Service**
   - Click "New +" → "Web Service"
   - Select "Deploy from existing image"
   - Enter: `YOUR_DOCKERHUB_USERNAME/todo-frontend:latest`

2. **Configure Service**
   - **Name:** `fe-todo`
   - **Plan:** Free tier
   - **Region:** Same as database
   - **Port:** 3000

3. **Add Environment Variables**
   ```
   REACT_APP_API_URL=https://be-todo.onrender.com
   NODE_ENV=production
   ```
   *(Replace `be-todo` with your actual backend service name)*

4. **Copy Deploy Hook URL**
   - After creation, go to Settings
   - Find "Deploy Hook" section
   - Copy the webhook URL

---

## GitHub Secrets Configuration

### Add Required Secrets to GitHub Repository

1. **Go to GitHub Repository**
   - Navigate to your repository on GitHub
   - Go to **Settings** → **Secrets and variables** → **Actions**

2. **Add the Following Secrets:**

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `DOCKERHUB_USERNAME` | Your DockerHub username | DockerHub Account Settings |
| `DOCKERHUB_TOKEN` | DockerHub access token | DockerHub Account Settings → Security → Access Tokens |
| `RENDER_BACKEND_DEPLOY_HOOK` | Backend deployment webhook | Render → Backend Service → Settings → Deploy Hook |
| `RENDER_FRONTEND_DEPLOY_HOOK` | Frontend deployment webhook | Render → Frontend Service → Settings → Deploy Hook |

### Creating DockerHub Token

1. Login to DockerHub
2. Navigate to Account Settings → Security → New Access Token
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token
5. Add to GitHub Secrets as `DOCKERHUB_TOKEN`

### Steps to Add Secrets

1. In GitHub Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Enter Secret name (e.g., `DOCKERHUB_USERNAME`)
4. Enter Secret value
5. Click "Add secret"
6. Repeat for all 4 secrets

---

## Workflow Execution Flow

```
Push to main branch
        ↓
GitHub Actions triggered
        ↓
Checkout repository code
        ↓
Setup Docker Buildx
        ↓
Login to DockerHub (using secrets)
        ↓
Build Backend Docker image ──→ Push to DockerHub
        ↓
Build Frontend Docker image ──→ Push to DockerHub
        ↓
Trigger Render Backend webhook ──→ Redeploy backend service
        ↓
Trigger Render Frontend webhook ──→ Redeploy frontend service
        ↓
✅ Deployment Complete
```

---

## Testing the Pipeline

### Local Testing with Docker Compose

```bash
# Build images locally
docker-compose up --build

# Test API endpoints
curl http://localhost:5001/tasks
curl http://localhost:5001/health

# Test frontend
# Open http://localhost in browser

# Cleanup
docker-compose down
```

### Testing GitHub Actions

1. Make a small code change
2. Commit and push to `main` branch
3. Go to GitHub → Actions → Verify workflow runs
4. Check DockerHub for new images
5. Verify Render services redeploy

---

## Challenges & Solutions

### Challenge 1: PostgreSQL Database Expiration
**Problem:** Free tier database on Render expired after 90 days of inactivity.

**Solution:** 
- Created new PostgreSQL database on Render free tier
- Updated environment variables in both render.yaml and GitHub secrets
- Database auto-initializes tables on first connection

### Challenge 2: Frontend Build Failures
**Problem:** React app build was too large for Render free tier.

**Solution:**
- Implemented multi-stage Docker build
- Used `node:18-alpine` for smaller base image
- Serve static build with lightweight `serve` package
- Reduced final image size by 60%

### Challenge 3: Render Webhook Deployment
**Problem:** New Docker images weren't automatically deploying on Render.

**Solution:**
- Added Render deployment webhook URLs to GitHub Actions workflow
- Used `curl` command to trigger webhooks on successful push
- Added `continue-on-error: true` to prevent workflow failure if webhook fails

### Challenge 4: Environment Variables
**Problem:** Different environment configurations needed for local, CI/CD, and production.

**Solution:**
- Created `.env.example` files for reference
- Used GitHub Secrets for sensitive credentials
- Implemented environment-based configuration in applications
- Different values for local development vs. production

### Challenge 5: API CORS Issues
**Problem:** Frontend couldn't communicate with backend across domains.

**Solution:**
- Added CORS middleware to Express backend
- Configured API_URL in React app based on environment
- Used absolute Render service URLs for production

---

## Learning Outcomes

### 1. **CI/CD Pipeline Development**
- Understand automated build and deployment processes
- Learn benefits of continuous integration and continuous deployment
- Implement efficient workflow automation

### 2. **Docker & Containerization**
- Created production-ready Docker images
- Implemented multi-stage Docker builds for optimization
- Learned image tagging and versioning strategies

### 3. **GitHub Actions**
- Built custom workflow pipelines
- Used Actions Marketplace for common tasks
- Managed secrets and environment variables securely
- Triggered webhooks for external service integration

### 4. **DockerHub Registry Management**
- Pushed and managed Docker images
- Created access tokens for CI/CD authentication
- Organized images with proper tagging conventions

### 5. **Render.com Deployment**
- Deployed containerized applications on Render
- Configured environment variables for different stages
- Set up database services
- Used deployment webhooks for automated redeploy

### 6. **Full Stack Application Deployment**
- End-to-end understanding of application lifecycle
- From local development → containerization → CI/CD → production
- Managing multiple services (frontend, backend, database) in production

### 7. **Best Practices**
- Never hardcode credentials in code
- Use environment variables for configuration
- Implement proper error handling in workflows
- Use semantic versioning and build numbers for container tags

---

## Key Files & Their Purposes

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | GitHub Actions workflow definition |
| `backend/Dockerfile` | Backend container specification |
| `frontend/Dockerfile` | Frontend container specification |
| `docker-compose.yml` | Local development orchestration |
| `render.yaml` | Render deployment blueprint |
| `backend/server.js` | Express API server |
| `frontend/src/App.js` | React main component |
| `backend/.env.example` | Environment template for backend |
| `frontend/.env.example` | Environment template for frontend |

---

## Deployment Links

Once deployed, the application is accessible at:

- **Frontend:** `https://fe-todo.onrender.com`
- **Backend API:** `https://be-todo.onrender.com`
- **API Health Check:** `https://be-todo.onrender.com/health`
- **DockerHub Backend:** `https://hub.docker.com/r/YOUR_USERNAME/todo-backend`
- **DockerHub Frontend:** `https://hub.docker.com/r/YOUR_USERNAME/todo-frontend`

---

## Useful Commands

```bash
# Local development
docker-compose up --build
docker-compose down
npm start              # In frontend or backend directory
npm test              # Run tests

# Docker commands
docker build -t myimage:tag .
docker push myimage:tag
docker pull myimage:tag
docker run -it myimage:tag

# Git commands
git add .
git commit -m "message"
git push origin main
git log --oneline

# Render CLI (if installed)
render deploy --service-id=SERVICE_ID
```

---

## Conclusion

This assignment successfully demonstrates a complete CI/CD pipeline implementation using modern DevOps practices. The automated workflow from GitHub to DockerHub to Render.com showcases enterprise-level deployment automation, making the development and deployment process efficient and reliable.

The combination of GitHub Actions, Docker, and Render.com provides a scalable, cost-effective solution for deploying full-stack applications.

---

**Last Updated:** May 13, 2026  
**Status:** ✅ Complete


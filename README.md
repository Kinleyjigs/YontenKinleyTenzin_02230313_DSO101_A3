# Todo Application - Assignment 3: CI/CD Pipeline

**Student:** Yonten Kinley Tenzin  
**Student ID:** 02230313  
**Course:** DSO101  
**Assignment:** 3 - GitHub Actions CI/CD Pipeline  
**Date:** May 13, 2026

## 📋 Quick Links

- 📚 **Detailed Guide:** [ASSIGNMENT_3_README.md](./ASSIGNMENT_3_README.md)
- 🚀 **Frontend:** https://fe-todo.onrender.com
- 🔗 **Backend API:** https://be-todo.onrender.com
- 🐳 **DockerHub:** https://hub.docker.com/r/yonten1234567890

## 🎯 Overview

This project implements a complete **CI/CD pipeline** using GitHub Actions to automate building, testing, and deploying a full-stack Todo application.

**Tech Stack:**
- React 18.2.0 (Frontend)
- Express.js 4.18.2 (Backend)
- PostgreSQL 15 (Database)
- Docker & Docker Compose (Containerization)
- GitHub Actions (CI/CD)
- Render.com (Cloud Deployment)

## ✨ Features

✅ Full CRUD operations for tasks  
✅ Automated CI/CD pipeline on GitHub  
✅ Dockerized frontend and backend services  
✅ PostgreSQL database on Render  
✅ Responsive React UI  
✅ RESTful API with error handling  

## 🚀 Quick Start

### Local Development

```bash
# Prerequisites: Docker Desktop, Node.js 18+

# Clone and navigate
git clone https://github.com/YourUsername/DSO_assign3.git
cd DSO_assign3

# Start all services
docker-compose up --build

# Access application
# Frontend: http://localhost
# Backend: http://localhost:5001
# Database: postgres://localhost:5432
```

### Test API

```bash
# Health check
curl http://localhost:5001/health

# Get all tasks
curl http://localhost:5001/tasks

# Create task
curl -X POST http://localhost:5001/tasks \
	-H "Content-Type: application/json" \
	-d '{"title":"Test Task","description":""}'
```

## 🔄 CI/CD Pipeline

Every push to `main` branch automatically:
1. Checks out code
2. Builds Docker images for backend & frontend
3. Pushes images to DockerHub
4. Triggers Render.com redeployment
5. Verifies health status

**View Actions:** https://github.com/YourUsername/DSO_assign3/actions

## 📁 Project Structure

See [ASSIGNMENT_3_README.md](./ASSIGNMENT_3_README.md) for detailed setup, deployment, and troubleshooting guide.

## 🔐 GitHub Secrets

Configure in GitHub Repository Settings:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `RENDER_BACKEND_DEPLOY_HOOK`
- `RENDER_FRONTEND_DEPLOY_HOOK`

## 📚 For Detailed Instructions

👉 **[ASSIGNMENT_3_README.md](./ASSIGNMENT_3_README.md)** ← All setup and deployment steps
*** End Patch
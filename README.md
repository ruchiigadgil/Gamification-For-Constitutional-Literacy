# 🏛️ InConQuest — Gamified Constitutional Literacy

A **full-stack, AI-powered, competition-first learning platform** that makes the **Indian Constitution engaging, interactive, and memorable** through games, multiplayer quizzes, and real-time leaderboards.

> Learn by playing. Compete while understanding. Remember through experience.

---

## 🎥 Demo

![InConQuest Demo](./ipd_gif.gif)

▶ **Full Video Walkthrough:**
[https://youtu.be/5_6g7dH5Gmk]

---

## 📚 Table of Contents

* Project Summary
* Key Features
* Tech Stack
* Architecture Overview
* Prerequisites
* Quick Start (Development)
* Environment Variables
* Kafka & Mongo (Local Setup)
* Score Event Flow
* Verification & Debugging
* Contributing
* License

---

## 📌 Project Summary

**InConQuest** is a **gamified constitutional literacy platform** designed to address low awareness and poor engagement with civics education.

Instead of static textbooks or basic quizzes, InConQuest uses:

* **AI-generated explanations**
* **Multiple single-player and multiplayer games**
* **Event-driven scoring using Apache Kafka**
* **Real-time leaderboards, badges, and streaks**

Every meaningful user action produces a **score event**, making competition and rewards the **core driver of learning**.

### Core Goals

* Simple, AI-written explanations of Constitutional Articles
* Engaging games that reinforce learning
* Multiplayer competition and real-time feedback
* Scalable, event-driven leaderboard architecture

---

## ✨ Key Features

* 🧠 **Gemini-powered Article Explanations**
  Clear, simplified explanations generated directly by Gemini

* 🎮 **Multiple Game Modes**

  * Snakes & Ladders (question-based progression)
  * Pictionary (Indian leaders & constitutional figures)
  * Maze Game (Wumpus World inspired)
  * In the Courtroom (real cases with AI-generated plots)
  * Daily Quiz (*Consti-Word*, Wordle-inspired)
  * Multiplayer Quiz (real-time competitive play)

* 🤝 **Multiplayer Gameplay**

  * WebSocket-based live quizzes
  * Instant score updates

* 🤖 **AI Chatbot (DistilBART)**

  * Simplifies complex legal language
  * Helps users clarify doubts and improve performance

* ⚡ **Event-Driven Scoring**

  * Every game emits Kafka score events
  * No direct leaderboard writes from games

* 🏆 **Leaderboards, Badges & Streaks**

  * Near real-time updates
  * Badge milestones (50, 100, 200+ points)
  * Daily streak tracking

---

## 🛠️ Tech Stack

**Frontend**

* React

**Backend**

* Node.js
* Express

**Real-Time**

* WebSockets (Socket.IO)

**Database**

* MongoDB (Atlas for prod, local for dev)

**Event Streaming**

* Apache Kafka (Dockerized)

**AI**

* Gemini → Article explanations & case generation
* DistilBART → Chatbot summarization & simplification

**DevOps**

* Docker
* Docker Compose

---

## 🏗️ Architecture Overview

```
Frontend (React Games & UI)
        |
        v
Backend APIs (Node + Express)
        |
        v
Kafka Producer → Kafka Topic (score events)
        |
        v
Kafka Consumer (Leaderboard Processor)
        |
        v
MongoDB (leaderboard_cache, badges, streaks)
        |
        v
Frontend reads cached leaderboard (fast)
```

### Key Design Principle

> **Games never update leaderboards directly.**
> All scoring flows through Kafka to ensure scalability and decoupling.

---

## ✅ Prerequisites

* Docker Desktop + Docker Compose
* Node.js (v18+ recommended)
* npm
* MongoDB (Atlas or local)
* `mongosh` (optional, for inspection)

---

## ⚡ Quick Start (Development)

Open **PowerShell** in the project root (where `docker-compose.kafka.yml` exists).

### 1️⃣ Create `.env` file

(See **Environment Variables** section below)

---

### 2️⃣ Start Kafka & Zookeeper

```powershell
docker compose -f .\docker-compose.kafka.yml up -d
```

---

### 3️⃣ (Optional) Run Local MongoDB

Recommended for Windows dev to avoid SRV DNS issues.

```powershell
docker run -d --name local-mongo -p 27017:27017 mongo:6
```

---

### 4️⃣ Start Backend (Auth Server)

```powershell
cd backend\auth-server
npm install
npm start
```

---

### 5️⃣ Start Kafka Producer & Consumer

```powershell
docker compose -f .\docker-compose.kafka.yml up -d kafka-producer kafka-consumer
```

---

### 6️⃣ Start Frontend

```powershell
cd src
npm install
$env:PORT=3000; npm start
```

Visit: **[http://localhost:3000](http://localhost:3000)**

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB
MONGODB_URI=mongodb://host.docker.internal:27017/inconquest

# Auth
JWT_SECRET=some-strong-secret
JWT_EXPIRE=7d
PORT=3001

# AI
GEMINI_API_KEY=your_gemini_key_here
```

### ⚠️ Important Notes

* Avoid `mongodb+srv://` inside Docker on Windows if DNS fails
* Use non-SRV Atlas URI or local MongoDB instead

---

## 📡 Kafka & Topic Verification

```powershell
# List containers
docker compose -f .\docker-compose.kafka.yml ps

# Create topic
docker compose -f .\docker-compose.kafka.yml exec kafka \
kafka-topics --bootstrap-server localhost:9092 \
--create --topic test-topic --partitions 1 --replication-factor 1
```

Broker mapping for host usage:

* `localhost:29092 → kafka:9092`

---

## 🔁 Score Event Flow (Developer View)

1. Player completes an action (quiz/game)
2. Frontend sends request to backend
3. Backend calculates score
4. Backend publishes **Kafka score event**
5. Kafka consumer processes event
6. MongoDB leaderboard cache updated
7. Frontend fetches cached leaderboard

📌 **Games never write to leaderboard DB directly**

---

## 🧪 Verification & Debugging

### Common Checks

* Confirm producer logs show “Score event published”
* Confirm consumer logs show “Leaderboard cache updated”
* Verify both services use the **same MongoDB URI**

```powershell
# Check leaderboard cache
mongosh "mongodb://localhost:27017/inconquest" \
--eval "db.leaderboard_cache.findOne({_id:'top5'})"

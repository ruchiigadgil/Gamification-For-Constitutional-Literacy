# 🎯 MongoDB Atlas Authentication - Complete Setup Guide

## ✅ What Has Been Done

### Backend Setup (Complete)
1. ✅ Created authentication server at `backend/auth-server/`
2. ✅ Installed all required packages (express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv)
3. ✅ Created User model with password hashing and gamification fields
4. ✅ Built authentication routes (signup, login, verify)
5. ✅ Set up Express server with MongoDB connection
6. ✅ Configured CORS for frontend communication

### Frontend Updates (Complete)
1. ✅ Updated `Login.jsx` to call backend API
2. ✅ Updated `SignUp.jsx` to call backend API
3. ✅ Added error handling and loading states
4. ✅ Configured token storage in localStorage

## 🔴 What You Need To Do NOW

### Step 1: Get Your MongoDB Connection String

1. Go to your MongoDB Atlas dashboard:
   👉 https://cloud.mongodb.com/v2/66b89d7fb33bfa63acb45752

2. Find your cluster and click **"Connect"**

3. Select **"Connect your application"**

4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```

5. Replace `<username>` and `<password>` with your actual credentials

### Step 2: Update the .env File

Open this file:
```
Indian-Constitution-Gamified-/backend/auth-server/.env
```

Replace the MongoDB URI with your actual connection string:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/inconquest?retryWrites=true&w=majority
JWT_SECRET=inconquest-jwt-secret-key-2024-super-secure
JWT_EXPIRE=7d
PORT=3001
```

**⚠️ IMPORTANT:**
- If your password has special characters like `@`, `#`, `$`, etc., you need to URL-encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`
  - Example: Password `Pass@123` becomes `Pass%40123`

### Step 3: Allow Network Access in MongoDB Atlas

1. In MongoDB Atlas, go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

### Step 4: Start the Authentication Server

Open a NEW terminal and run:
```bash
cd Indian-Constitution-Gamified-/backend/auth-server
npm start
```

You should see:
```
🚀 Auth Server running on http://localhost:3001
✅ MongoDB Atlas Connected Successfully
```

### Step 5: Start Your React Frontend

In another terminal, navigate to your React app and start it:
```bash
cd Indian-Constitution-Gamified-
npm start
```

## 🧪 Test the Complete Flow

1. **Open your app**: http://localhost:3000
2. **Landing Page** → Click to scroll/advance → Goes to **Login**
3. **Click "Sign up here"** → Goes to **SignUp**
4. **Create an account**:
   - Enter Full Name: `Test User`
   - Enter Email: `test@example.com`
   - Enter Password: `test123`
   - Confirm Password: `test123`
   - Click **"Sign Up"**
5. **Should navigate to Dashboard** with authentication complete!
6. **Check MongoDB Atlas**:
   - Go to "Browse Collections"
   - You should see `inconquest` database with a `users` collection
   - Your test user should be there with hashed password

## 🔐 How Authentication Works

### User Registration Flow:
1. User fills signup form → Frontend sends POST to `/api/auth/signup`
2. Backend validates data → Checks if email exists
3. Bcrypt hashes the password (10 salt rounds)
4. User saved to MongoDB Atlas
5. JWT token generated and returned
6. Frontend stores token in localStorage
7. Redirects to Dashboard

### User Login Flow:
1. User enters credentials → Frontend sends POST to `/api/auth/login`
2. Backend finds user by email
3. Bcrypt compares password hash
4. If valid → Generate JWT token
5. Return token and user data
6. Frontend stores token and redirects to Dashboard

## 📂 File Structure

```
Indian-Constitution-Gamified-/
├── backend/
│   └── auth-server/
│       ├── models/
│       │   └── User.js          ← MongoDB schema
│       ├── routes/
│       │   └── auth.js          ← API endpoints
│       ├── .env                 ← YOUR MONGODB CONNECTION
│       ├── package.json         ← Dependencies
│       ├── server.js            ← Express server
│       └── README.md            ← Detailed docs
└── src/
    └── pages/
        ├── Login.jsx            ← Updated with API call
        └── SignUp.jsx           ← Updated with API call
```

## 🎮 User Data Stored

When a user signs up, MongoDB stores:
```json
{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "$2a$10$hashed...",  // Bcrypt hashed
  "level": 1,
  "xp": 0,
  "badges": [],
  "quizzesTaken": 0,
  "streak": 0,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## 🚨 Troubleshooting

### Error: "Unable to connect to server"
**Solution**: Make sure auth server is running on port 3001
```bash
cd backend/auth-server
npm start
```

### Error: "MongoDB Connection Error"
**Solutions**:
1. Double-check connection string in `.env`
2. Verify IP is whitelisted in MongoDB Atlas (Network Access)
3. Check username/password are correct
4. URL-encode special characters in password

### Error: "User already exists"
**Solution**: Email is already registered. Try:
- Use a different email
- Or go to Login page instead

### Frontend shows "Loading..." forever
**Solution**: 
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab - is API call reaching `localhost:3001`?
4. Verify auth server is running

## 🔒 Security Features

✅ Passwords hashed with bcrypt (10 salt rounds)
✅ JWT tokens for session management
✅ Password never sent in API responses
✅ CORS enabled for frontend communication
✅ Input validation on both frontend and backend

## 📊 API Endpoints Reference

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login existing user | No |
| GET | `/api/auth/verify` | Verify JWT token | Yes (Bearer token) |
| GET | `/health` | Check server status | No |

## 🎯 Next Steps After Setup

1. **Test registration and login**
2. **Verify data in MongoDB Atlas**
3. **Add protected routes** (verify token before accessing dashboard)
4. **Implement logout** (clear localStorage)
5. **Add "Remember Me"** feature
6. **Password reset** functionality
7. **Profile page** to view/edit user data

## 💡 Quick Commands Reference

### Start Auth Server:
```bash
cd Indian-Constitution-Gamified-/backend/auth-server
npm start
```

### Start Frontend:
```bash
cd Indian-Constitution-Gamified-
npm start
```

### Test API Health:
```bash
curl http://localhost:3001/health
```

### Check MongoDB Connection:
Look for this in terminal:
```
✅ MongoDB Atlas Connected Successfully
```

## 🎉 Success Checklist

- [ ] MongoDB connection string updated in `.env`
- [ ] IP address whitelisted in MongoDB Atlas
- [ ] Auth server running on port 3001
- [ ] React app running on port 3000
- [ ] Can create account through SignUp page
- [ ] Can login with created account
- [ ] User data visible in MongoDB Atlas
- [ ] Redirects to Dashboard after authentication

---

**Need Help?** Check the detailed README in `backend/auth-server/README.md`

**All Set!** 🚀 Your authentication system is now connected to MongoDB Atlas!

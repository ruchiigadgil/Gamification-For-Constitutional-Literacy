# Authentication Server Setup Guide

## 📋 Prerequisites
- Node.js installed (v14 or higher)
- MongoDB Atlas account (https://cloud.mongodb.com/v2/66b89d7fb33bfa63acb45752)

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd backend/auth-server
npm install
```

### 2. Configure MongoDB Connection

#### Get Your MongoDB Connection String:
1. Go to your MongoDB Atlas dashboard: https://cloud.mongodb.com/v2/66b89d7fb33bfa63acb45752
2. Click on "Connect" button for your cluster
3. Select "Connect your application"
4. Copy the connection string (it looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`)

#### Update the .env file:
Open `backend/auth-server/.env` and replace the placeholder with your actual MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/inconquest?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
PORT=3001
```

**Important Notes:**
- Replace `YOUR_USERNAME` with your MongoDB Atlas username
- Replace `YOUR_PASSWORD` with your MongoDB Atlas password (URL encode special characters!)
- Replace `YOUR_CLUSTER` with your cluster address
- The database name `inconquest` will be created automatically
- Keep JWT_SECRET secure (use a long random string in production)

### 3. Start the Server
```bash
npm start
```

You should see:
```
🚀 Auth Server running on http://localhost:3001
✅ MongoDB Atlas Connected Successfully
```

## 🧪 Test the API

### Test Health Endpoint:
```bash
curl http://localhost:3001/health
```

### Test Signup:
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### Test Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

## 📁 Project Structure
```
auth-server/
├── models/
│   └── User.js          # MongoDB User schema with bcrypt
├── routes/
│   └── auth.js          # Authentication routes (signup, login, verify)
├── .env                 # Environment variables (DO NOT COMMIT!)
├── .env.example         # Template for environment variables
├── package.json         # Dependencies
├── server.js           # Express server setup
└── README.md           # This file
```

## 🔐 API Endpoints

### POST /api/auth/signup
Register a new user
- **Body**: `{ fullName, email, password }`
- **Response**: `{ success, message, token, user }`

### POST /api/auth/login
Login existing user
- **Body**: `{ email, password }`
- **Response**: `{ success, message, token, user }`

### GET /api/auth/verify
Verify JWT token and get user data
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, user }`

## 🎮 User Schema Fields
- `fullName` - User's full name
- `email` - Unique email (used for login)
- `password` - Hashed with bcrypt (10 salt rounds)
- `level` - Gamification level (default: 1)
- `xp` - Experience points (default: 0)
- `badges` - Array of earned badges
- `quizzesTaken` - Number of quizzes completed
- `streak` - Login streak counter
- `createdAt` - Registration timestamp

## 🔧 Troubleshooting

- Make sure the auth server is running on port 3001
- Check if the port is not already in use
- Verify firewall settings

### "MongoDB Connection Error"
- Double-check your MongoDB connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas (Network Access)
- Verify username/password are correct
- Check if special characters in password are URL encoded

### "User already exists"
- The email is already registered
- Try a different email or use login instead

## 🔒 Security Notes
- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens expire after 7 days (configurable in `.env`)
- Password field is excluded from JSON responses
- Never commit `.env` file to git
- In production, use strong JWT_SECRET and enable HTTPS

## 🌐 CORS Configuration
The server allows requests from all origins. For production, update the CORS settings in `server.js` to allow only your frontend domain.

## 📝 Next Steps
1. Install dependencies: `npm install`
2. Configure MongoDB connection in `.env`
3. Start server: `npm start`
4. Test with the frontend Login/SignUp pages
5. Check MongoDB Atlas to see created users

Happy coding! 🚀

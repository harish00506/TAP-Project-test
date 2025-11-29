# ⚡ Quick Deployment Reference

## 🔧 What You Need to Change for Render Deployment

### 1. MongoDB Connection String
```env
MONGODB_URI=mongodb+srv://elsadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/els_db?retryWrites=true&w=majority
```

**Where to get it:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database password
6. Add `/els_db` before the `?` query parameters

---

### 2. JWT Secrets (MUST be strong random strings)
```env
JWT_SECRET=generate_a_strong_32_character_minimum_random_string_here
EMAIL_VERIFICATION_SECRET=another_strong_random_secret_different_from_above
```

**How to generate:**
```bash
# Option 1: Online
Visit: https://randomkeygen.com/

# Option 2: Node.js command
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

### 3. Gmail Configuration
```env
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # 16-char app password
EMAIL_FROM=noreply@yourcompany.com
```

**How to get Gmail App Password:**
1. Google Account → Security → 2-Step Verification (enable it)
2. Security → App passwords
3. Select Mail → Other (name: ELS)
4. Click Generate
5. Copy 16-character password (format: abcd efgh ijkl mnop)
6. Use it in EMAIL_PASSWORD (can include or remove spaces)

---

### 4. Frontend URL
```env
FRONTEND_URL=https://els-frontend.onrender.com
```
**Change after you deploy frontend and get the URL from Render**

---

### 5. Manager Email
```env
DEFAULT_MANAGER_EMAIL=your_manager_email@yourcompany.com
```
**Use the email where you want manager notifications sent**

---

## 🚀 Deployment Steps (Simple)

### Step 1: Setup MongoDB Atlas (5 minutes)
1. ✅ Go to https://www.mongodb.com/cloud/atlas
2. ✅ Sign up (free)
3. ✅ Create free cluster (M0)
4. ✅ Add database user (username: elsadmin, strong password)
5. ✅ Allow access from anywhere (0.0.0.0/0)
6. ✅ Get connection string
7. ✅ Replace `<password>` with your password
8. ✅ Add `/els_db` before `?retryWrites`

**Final string should look like:**
```
mongodb+srv://elsadmin:MyStr0ngP@ss@cluster0.abc123.mongodb.net/els_db?retryWrites=true&w=majority
```

---

### Step 2: Setup Gmail App Password (3 minutes)
1. ✅ Enable 2-Factor Auth on Google Account
2. ✅ Go to App Passwords
3. ✅ Generate password for "Mail"
4. ✅ Copy 16-character code
5. ✅ Save for later

---

### Step 3: Deploy on Render (10 minutes)

#### Deploy Backend:
1. ✅ Go to https://dashboard.render.com/
2. ✅ Click "New +" → "Web Service"
3. ✅ Connect GitHub: `harish00506/TAP-Project-test`
4. ✅ Configure:
   - Name: `els-backend`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: Free

5. ✅ Add Environment Variables (click "Advanced"):

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<paste your MongoDB Atlas connection string>
JWT_SECRET=<paste generated secret>
JWT_EXPIRE=7d
EMAIL_VERIFICATION_SECRET=<paste another generated secret>
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your gmail address>
EMAIL_PASSWORD=<your 16-char app password>
EMAIL_FROM=noreply@yourcompany.com
FRONTEND_URL=https://els-frontend.onrender.com
DEFAULT_MANAGER_EMAIL=<your manager email>
```

6. ✅ Click "Create Web Service"
7. ✅ Wait 3-5 minutes for deployment
8. ✅ Copy backend URL (e.g., https://els-backend.onrender.com)

#### Deploy Frontend:
1. ✅ Click "New +" → "Static Site"
2. ✅ Same repository
3. ✅ Configure:
   - Name: `els-frontend`
   - Root Directory: `frontend`
   - Build: `npm install && npm run build`
   - Publish: `build`

4. ✅ Add Environment Variable:
```env
REACT_APP_API_URL=https://els-backend.onrender.com/api
```

5. ✅ Click "Create Static Site"
6. ✅ Wait for deployment
7. ✅ Copy frontend URL

#### Update Backend:
1. ✅ Go back to backend service
2. ✅ Update `FRONTEND_URL` with actual frontend URL
3. ✅ Click "Save Changes" (will auto-redeploy)

---

### Step 4: Seed Database (2 minutes)
1. ✅ Go to backend service in Render
2. ✅ Click "Shell" tab
3. ✅ Run: `npm run seed`
4. ✅ Wait for success message

---

### Step 5: Test (1 minute)
1. ✅ Open frontend URL in browser
2. ✅ Login with: manager@test.com / password123
3. ✅ Should see dashboard with data

---

## 📋 Environment Variables Checklist

Copy this to Render dashboard (Backend service → Environment):

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://elsadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/els_db?retryWrites=true&w=majority
JWT_SECRET=your_generated_strong_secret_32_chars_minimum
JWT_EXPIRE=7d
EMAIL_VERIFICATION_SECRET=another_different_strong_secret
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=noreply@yourcompany.com
FRONTEND_URL=https://your-frontend-url.onrender.com
DEFAULT_MANAGER_EMAIL=manager@yourcompany.com
```

**Replace:**
- `YOUR_PASSWORD` → Your MongoDB Atlas password
- `your_generated_strong_secret...` → Generated JWT secret
- `another_different_strong_secret` → Generated email secret
- `your_email@gmail.com` → Your actual Gmail
- `your_16_char_app_password` → Gmail app password from Google
- `noreply@yourcompany.com` → Email sender address
- `https://your-frontend-url.onrender.com` → Your actual frontend URL
- `manager@yourcompany.com` → Manager's email

---

## 🔍 Quick Troubleshooting

### Backend won't start?
- Check environment variables are all set
- Verify MongoDB connection string is correct
- Check logs in Render dashboard

### Frontend can't reach backend?
- Verify REACT_APP_API_URL is correct
- Make sure backend is running
- Check browser console for errors

### Email not working?
- Verify Gmail App Password (not regular password)
- Check 2FA is enabled on Google Account
- No spaces in password when pasting

---

## 🎯 Testing Checklist

After deployment:

- [ ] Backend health check: `https://YOUR-BACKEND.onrender.com/api/health`
- [ ] Frontend loads: `https://YOUR-FRONTEND.onrender.com`
- [ ] Can login with test account
- [ ] Dashboard shows data
- [ ] Can apply for leave
- [ ] Can approve/reject (as manager)

---

## 💡 Pro Tips

1. **First request slow?** Free tier sleeps after 15 min inactivity
2. **Keep backend awake:** Use UptimeRobot (free) to ping every 14 minutes
3. **Custom domain:** Buy domain and point CNAME to Render URL
4. **Upgrade to $7/mo:** Get always-on backend, no sleep
5. **Use MongoDB Atlas triggers:** For automated tasks

---

## 📞 Quick Links

- Render Dashboard: https://dashboard.render.com/
- MongoDB Atlas: https://cloud.mongodb.com/
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Secret Generator: https://randomkeygen.com/
- Your Repo: https://github.com/harish00506/TAP-Project-test

---

**Total Time: ~20 minutes from start to deployed!** 🚀

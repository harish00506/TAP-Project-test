# 🚀 Render.com Deployment Guide

## Prerequisites

1. **Create a Render account:** https://render.com/
2. **Setup MongoDB Atlas:** https://www.mongodb.com/cloud/atlas (free tier)
3. **Gmail App Password** (for email notifications)

---

## Step 1: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Login
3. Create a new cluster (Free tier M0)
4. Wait for cluster to be created (2-3 minutes)
5. Click "Connect" button
6. Add connection IP: Choose "Allow Access from Anywhere" (0.0.0.0/0)
7. Create Database User:
   - Username: `elsadmin`
   - Password: Generate a secure password (save it!)
8. Click "Choose connection method" → "Connect your application"
9. Copy the connection string:
   ```
   mongodb+srv://elsadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
10. Replace `<password>` with your actual password
11. Add database name at the end:
    ```
    mongodb+srv://elsadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/els_db?retryWrites=true&w=majority
    ```

---

## Step 2: Setup Gmail App Password

1. Go to Google Account: https://myaccount.google.com/
2. Click "Security" in left sidebar
3. Enable "2-Step Verification" (if not enabled)
4. Go back to Security
5. Click "App passwords"
6. Select:
   - App: "Mail"
   - Device: "Other" (type "ELS Backend")
7. Click "Generate"
8. Copy the 16-character password (no spaces)
9. This is your `EMAIL_PASSWORD`

---

## Step 3: Deploy to Render

### Method 1: Using Render Dashboard (Recommended)

#### Deploy Backend:

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `harish00506/TAP-Project-test`
4. Configure Backend Service:
   - **Name:** `els-backend`
   - **Region:** Oregon (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Click "Advanced" and add Environment Variables:

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://elsadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/els_db?retryWrites=true&w=majority
   JWT_SECRET=your_very_strong_secret_key_minimum_32_characters_here
   JWT_EXPIRE=7d
   EMAIL_VERIFICATION_SECRET=another_strong_secret_key_for_email_tokens
   EMAIL_SERVICE=gmail
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_character_app_password
   EMAIL_FROM=noreply@yourcompany.com
   FRONTEND_URL=https://els-frontend.onrender.com
   DEFAULT_MANAGER_EMAIL=manager@yourcompany.com
   ```

6. Click "Create Web Service"
7. Wait for deployment (3-5 minutes)
8. Your backend will be at: `https://els-backend.onrender.com`

#### Deploy Frontend:

1. Click "New +" → "Static Site"
2. Connect same repository
3. Configure Frontend:
   - **Name:** `els-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://els-backend.onrender.com/api
   ```

5. Click "Create Static Site"
6. Wait for deployment
7. Your frontend will be at: `https://els-frontend.onrender.com`

8. **Update Backend Environment Variable:**
   - Go back to backend service
   - Update `FRONTEND_URL=https://els-frontend.onrender.com`
   - Save and redeploy

### Method 2: Using render.yaml (Blueprint)

1. Go to https://dashboard.render.com/
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml`
5. Configure the environment variables when prompted
6. Click "Apply"

---

## Step 4: Seed the Database

After backend is deployed:

1. Go to backend service on Render dashboard
2. Click "Shell" tab
3. Run seed command:
   ```bash
   npm run seed
   ```

Or create a one-time job:
1. Click "New +" → "Background Worker"
2. Use same repo and settings
3. Start Command: `npm run seed`
4. Run once and delete

---

## Step 5: Test Your Deployment

### Test Backend:

```bash
curl https://els-backend.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-29T..."
}
```

### Test Login:

```bash
curl -X POST https://els-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@test.com","password":"password123"}'
```

### Test Frontend:

Open browser: `https://els-frontend.onrender.com`

Login with:
- Email: `manager@test.com`
- Password: `password123`

---

## Environment Variables Reference

### What to Change:

**MUST CHANGE:**
```env
# Your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://elsadmin:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/els_db?retryWrites=true&w=majority

# Generate strong random strings (minimum 32 characters)
JWT_SECRET=use_random_generator_for_this_secret_key_abcdef123456
EMAIL_VERIFICATION_SECRET=another_random_secret_for_email_tokens_xyz789

# Your actual Gmail credentials
EMAIL_USER=your_real_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password_from_google

# Your actual email address for sending
EMAIL_FROM=noreply@yourcompany.com

# Your deployed frontend URL
FRONTEND_URL=https://els-frontend.onrender.com

# Manager email for notifications
DEFAULT_MANAGER_EMAIL=manager@yourcompany.com
```

**CAN KEEP AS IS:**
```env
NODE_ENV=production
PORT=5000
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

---

## Generating Strong Secrets

### For JWT_SECRET and EMAIL_VERIFICATION_SECRET:

**Online Generator:**
```
https://randomkeygen.com/
Use "CodeIgniter Encryption Keys" or "256-bit WPA Key"
```

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Using PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## Important Notes

### Free Tier Limitations (Render):
- Backend spins down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month (enough for 1 service 24/7)

### Solution:
1. Use a service like UptimeRobot to ping your backend every 14 minutes
2. Or upgrade to paid plan ($7/month) for always-on service

### Email Configuration:
- If Gmail blocks sending, check Google Security settings
- Enable "Less secure app access" or use App Password
- Consider using SendGrid or Mailgun for production

### Database:
- MongoDB Atlas free tier: 512MB storage
- Should be enough for small to medium usage
- Automatic backups included

---

## Troubleshooting

### Backend won't start:
1. Check logs in Render dashboard
2. Verify all environment variables are set
3. Check MongoDB connection string is correct
4. Ensure no trailing spaces in env vars

### Frontend can't connect to backend:
1. Verify `REACT_APP_API_URL` is correct
2. Check CORS is enabled in backend
3. Ensure backend is running

### Email not sending:
1. Verify Gmail App Password is correct (no spaces)
2. Check 2FA is enabled on Google Account
3. Test with another email service if Gmail fails

---

## Production Checklist

Before going live:

- [ ] MongoDB Atlas cluster created and secured
- [ ] Strong JWT secrets generated
- [ ] Gmail App Password created
- [ ] All environment variables configured
- [ ] Backend deployed and health check passes
- [ ] Frontend deployed and loads
- [ ] Database seeded with initial data
- [ ] Test user login works
- [ ] Email notifications working
- [ ] Update README with live URLs
- [ ] Setup custom domain (optional)

---

## Custom Domain (Optional)

### For Frontend:
1. Buy domain from Namecheap/GoDaddy
2. In Render dashboard → Frontend service → Settings
3. Click "Add Custom Domain"
4. Add CNAME record in your DNS:
   ```
   Type: CNAME
   Name: www
   Value: els-frontend.onrender.com
   ```

### For Backend:
Same process for API subdomain:
```
Type: CNAME
Name: api
Value: els-backend.onrender.com
```

Then update `REACT_APP_API_URL=https://api.yourdomain.com/api`

---

## Monitoring

### Setup UptimeRobot (Free):
1. Go to https://uptimerobot.com/
2. Sign up for free account
3. Add New Monitor:
   - Type: HTTP(S)
   - URL: `https://els-backend.onrender.com/api/health`
   - Interval: 5 minutes
4. Get email alerts if service goes down

---

## Cost Summary

| Service | Free Tier | Paid Option |
|---------|-----------|-------------|
| Render Backend | 750hrs/month | $7/month (always-on) |
| Render Frontend | Unlimited | Same as free |
| MongoDB Atlas | 512MB | $9/month (2GB) |
| Domain | N/A | $10-15/year |
| Email | Free (Gmail) | SendGrid $15/month |

**Total Free:** $0/month (with limitations)
**Total Paid:** ~$17/month (for production)

---

## Support

For deployment issues:
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Project Issues: https://github.com/harish00506/TAP-Project-test/issues

---

**Your app is ready for production deployment! 🚀**

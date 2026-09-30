# Hostinger Deployment & Database Guide for Instrctr

This guide walks you through deploying your **Instrctr** Next.js application live on **Hostinger** via SSH terminal with an integrated **SQLite database** to store registrations and driving licence uploads.

---

## 🏗️ What We Have Built

1. **Backend Registration API** ([`app/api/apply/route.ts`](file:///Users/vakdamanikanta/Mani%20Projects/Instrctr/app/api/apply/route.ts)):
   - Receives form data (`name`, `phone`, `email`, `city`, `area`, `vehicle`, `licence`).
   - Automatically saves uploaded driving licence files to `public/uploads/`.
   - Stores applicant records safely in SQLite (`data/instrctr.db`).

2. **Secure Admin Dashboard** ([`app/admin/page.tsx`](file:///Users/vakdamanikanta/Mani%20Projects/Instrctr/app/admin/page.tsx)):
   - Access at `https://your-domain.com/admin` using your secret password.
   - Filter, search, and update applicant statuses (*Pending*, *Contacted*, *Approved*, *Rejected*).
   - View / download uploaded driving licence files with one click.
   - **Export all applicant data to CSV** directly from your browser.

3. **Production Standalone Build & Scripts**:
   - `ecosystem.config.cjs` for PM2 background process management.
   - `deploy.sh` one-click deployment script for SSH terminal.

---

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Commit and Push to Your Git Repository

From your local machine terminal:
```bash
git add .
git commit -m "Add SQLite database, registration API, admin dashboard, and deployment scripts"
git push origin main
```

---

### Step 2: Connect to Hostinger via SSH Terminal

1. Log into your **Hostinger hPanel** (`https://hpanel.hostinger.com`).
2. Go to **Advanced** → **SSH Access**.
3. If SSH is not enabled, click **Enable**.
4. Note your SSH details:
   - **SSH IP & Port**: (e.g., `185.xxx.xxx.xxx` port `65002` or `22`)
   - **SSH Username**: `u123456789`
5. Open your local terminal (or Hostinger Browser Terminal) and run:
   ```bash
   ssh -p <PORT> <USERNAME>@<SSH_IP>
   ```
   *(Enter your Hostinger account/SSH password when prompted)*

---

### Step 3: Clone and Setup on Hostinger

Once logged into your Hostinger SSH terminal:

```bash
# Navigate to your domain directory or home directory
cd ~/domains/yourdomain.com/public_html
# (or cd ~ if setting up in a custom app folder)

# Clone your repository
git clone https://github.com/<your-username>/<your-repo-name>.git .
# Or if you cloned into a folder, cd into it:
# cd <repo-folder>
```

---

### Step 4: Create Production `.env` on Hostinger

In your project directory on Hostinger:
```bash
nano .env
```
Paste your production settings:
```env
# SQLite Database file location
DATABASE_URL="file:./data/instrctr.db"

# Change this to a secure secret key for your /admin portal
ADMIN_SECRET="your_custom_secure_admin_password_2026"

NODE_ENV="production"
PORT=3000
```
*(Press `Ctrl + O` then `Enter` to save, and `Ctrl + X` to exit nano)*

---

### Step 5: Run the Automated Deployment

Run the included automated deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

This script will automatically:
1. Install Node.js dependencies (`npm install`).
2. Initialize and sync the SQLite database (`prisma db push`).
3. Build the Next.js production bundle (`npm run build`).
4. Start/reload the application via PM2 or Node.js.

---

### Step 6: Keep the App Running (PM2 / Hostinger Node.js)

If your Hostinger SSH has **PM2** installed:
```bash
pm2 start ecosystem.config.cjs
pm2 save
```

#### If using Hostinger hPanel "Node.js" Manager:
1. In hPanel, go to **Node.js** (under Web Applications).
2. Set **Application Root**: path to your project folder (e.g. `public_html`).
3. Set **Application Startup File**: `node_modules/next/dist/bin/next` with argument `start` (or `server.js`).
4. Set Node version: **18.x, 20.x, or 22.x+**.
5. Click **Save** and **Restart**.

---

### Step 7: Test Your Live Website & Database

1. Visit `https://your-domain.com` in your browser.
2. Scroll to the **Join as Instructor** section.
3. Submit a test application with name, phone, licence number, and upload a test document.
4. Go to `https://your-domain.com/admin`.
5. Enter your `ADMIN_SECRET` password to log in.
6. Verify the application appears, click **View Licence Document**, and click **Export to CSV**.

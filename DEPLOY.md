# Fast Render Deployment Guide 🚀

Follow these steps to deploy **Real Estate CRM** to Render in under 5 minutes.

---

### Prerequisites
1. A GitHub account with this repository pushed.
2. A free [Render.com Account](https://render.com/).

---

### Step 1: Add Health Check to Express Server (If Not Present)
Ensure `server/index.js` includes a `/health` endpoint for Render to monitor service health:
```js
app.get('/health', (req, res) => res.status(200).send('OK'));
```

---

### Step 2: Deploy via Render Blueprint (Recommended)

1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** at the top right and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` file and parse:
   - Web Service configuration (`real-estate-crm`)
   - Database service (`crm-mongodb`)
   - Secret key generation for `JWT_SECRET`
5. Fill in the required `CLIENT_URL` variable (use your allocated Render app URL or temporary placeholder like `https://real-estate-crm.onrender.com`).
6. Click **Apply**.

---

### Step 3: Local Setup / Docker Test Command

To verify the setup locally before deploying, run:

```bash
# 1. Start local multi-container environment (App + Mongo)
docker-compose up --build -d

# 2. Check logs
docker-compose logs -f app

# 3. Stop containers
docker-compose down
```

---

### Step 4: Configure Automatic CI/CD Pipeline (Optional)

1. Go to your Web Service in the Render Dashboard.
2. Navigate to **Settings** -> **Deploy Hook**.
3. Copy the URL.
4. Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
5. Create a **New repository secret**:
   - **Name:** `RENDER_DEPLOY_HOOK_URL`
   - **Value:** *[Paste Deploy Hook URL]*
6. Push code to `main` — GitHub Actions will run checks and automatically trigger a live deploy.
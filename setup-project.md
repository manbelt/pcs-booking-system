# PCS Booking System - GitHub Repository Setup

## 📁 Required Directory Structure

Create this exact structure in your `pcs-booking-system` repository:

```
pcs-booking-system/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── packages/
│   └── client/
│       ├── package.json
│       ├── package-lock.json
│       ├── vite.config.js
│       ├── index.html
│       └── src/
│           ├── main.jsx
│           ├── App.jsx
│           └── components/
├── README.md
├── .gitignore
└── LICENSE
```

## 🔧 Files to Create

### 1. `.github/workflows/deploy.yml`
Copy the content from the deploy.yml file provided.

### 2. `packages/client/package.json`
```json
{
  "name": "pcs-booking-client",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.2"
  }
}
```

### 3. `packages/client/vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 3000,
    host: true
  }
})
```

### 4. `packages/client/index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Private Car Service Paris - Luxury Booking</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## 🚀 Quick Setup Commands

After creating the repository structure, run these commands in the `packages/client` directory:

```bash
cd packages/client
npm install
npm run build
```

## 🔐 Repository Secrets (Already Added)

✅ CLOUDFLARE_API_TOKEN = 8CTCPQdMyvY0EUuaPeL6od3jSjC2ykgpHnF3a-jW
✅ CLOUDFLARE_ACCOUNT_ID = 2ded52e5a023ca5314a949cef2ee6f93
✅ CLOUDFLARE_ZONE_ID = 209f806221da647b3fff79e9db464920

## 📱 Deployment URLs

After successful deployment:
- **Cloudflare Pages URL:** https://pcs-booking.pages.dev
- **Custom Domain:** https://booking.privatecarserviceparis.com

## 🎯 Next Steps

1. Create the directory structure above
2. Copy all the provided files
3. Push to main branch
4. GitHub Actions will automatically deploy to Cloudflare Pages
5. Configure custom domain in Cloudflare Pages dashboard

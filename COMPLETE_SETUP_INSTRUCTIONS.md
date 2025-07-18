# 🚀 Complete PCS Booking System GitHub Setup

## ✅ What's Already Done
- ✅ GitHub repository created: `manbelt/pcs-booking-system`
- ✅ Repository secrets added:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID` 
  - `CLOUDFLARE_ZONE_ID`

## 📁 Step 1: Copy Files to Your Repository

Copy all files from the `github-actions-setup` folder to your GitHub repository with this exact structure:

```
pcs-booking-system/
├── .github/
│   └── workflows/
│       └── deploy.yml                    ← Copy from github-actions-setup
├── packages/
│   └── client/
│       ├── package.json                  ← Copy from github-actions-setup
│       ├── vite.config.js               ← Copy from github-actions-setup
│       ├── index.html                   ← Copy from github-actions-setup
│       └── src/
│           ├── main.jsx                 ← Copy from github-actions-setup
│           ├── App.jsx                  ← Copy from github-actions-setup
│           ├── index.css                ← Copy from github-actions-setup
│           └── components/
│               └── BookingForm.jsx      ← Copy from github-actions-setup
├── README.md                            ← Already exists
├── .gitignore                           ← Already exists
└── LICENSE                              ← Already exists
```

## 🔧 Step 2: Add Missing Dependencies

You'll need to add Tailwind CSS. Create this file:

**`packages/client/tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'luxury-gold': '#c5a46d',
      }
    },
  },
  plugins: [],
}
```

**Update `packages/client/package.json` to include Tailwind:**
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
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.0",
    "vite": "^4.3.2"
  }
}
```

**Create `packages/client/postcss.config.js`**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 🚀 Step 3: Test Locally (Optional)

```bash
cd packages/client
npm install
npm run dev
```

## 📤 Step 4: Push to GitHub

```bash
git add .
git commit -m "Add PCS Booking System with Cloudflare Pages deployment"
git push origin main
```

## 🎯 Step 5: Automatic Deployment

Once you push to main:
1. GitHub Actions will automatically trigger
2. Build the React app
3. Deploy to Cloudflare Pages
4. Your app will be live at: `https://pcs-booking.pages.dev`

## 🌐 Step 6: Configure Custom Domain

After successful deployment, configure your custom domain:

1. Go to Cloudflare Pages dashboard
2. Select your `pcs-booking` project
3. Go to "Custom domains"
4. Add: `booking.privatecarserviceparis.com`
5. Cloudflare will automatically configure DNS

## 📱 Final URLs

- **Development:** `https://pcs-booking.pages.dev`
- **Production:** `https://booking.privatecarserviceparis.com`

## 🔍 Troubleshooting

If deployment fails:
1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Ensure file structure matches exactly
4. Check that all dependencies are installed

## 🎉 Success Indicators

✅ GitHub Actions workflow completes successfully
✅ Cloudflare Pages shows successful deployment
✅ Website loads at both URLs
✅ Booking form displays correctly with luxury styling

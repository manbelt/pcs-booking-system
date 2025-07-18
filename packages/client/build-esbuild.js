console.log('🔧 Starting esbuild process...');

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

try {
  // Ensure dist directory exists
  console.log('📁 Creating dist directory...');
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Copy index.html to dist
  console.log('📄 Creating index.html...');
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PCS Booking System</title>
    <link rel="stylesheet" href="./booking-ui.css">
  </head>
  <body>
    <div id="pcs-booking-root"></div>
    <script src="./booking-ui.js"></script>
  </body>
</html>`;

  fs.writeFileSync('dist/index.html', indexHtml);
  console.log('✅ index.html created successfully');

  // Build with esbuild
  console.log('🔧 Starting esbuild compilation...');

  esbuild.build({
    entryPoints: ['src/main.tsx'],
    bundle: true,
    outfile: 'dist/booking-ui.js',
    format: 'iife',
    target: 'es2020',
    minify: true,
    sourcemap: false,
    define: {
      'process.env.NODE_ENV': '"production"',
      'global': 'window'
    },
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
      '.css': 'css',
      '.png': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.gif': 'file',
      '.svg': 'file'
    },
    external: [],
    jsx: 'automatic',
  }).then(() => {
    console.log('✅ esbuild JavaScript compilation completed successfully');

    // Create a comprehensive CSS file with PCS styles
    console.log('🎨 Creating CSS file...');
    const pcsCSS = `
/* PCS Booking System v2.0.0 Styles */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

#pcs-booking-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.booking-header {
  text-align: center;
  margin-bottom: 3rem;
}

.booking-header h1 {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #c5a46d;
  font-weight: 700;
}

.booking-header p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 0;
}

/* Vehicle Grid Styles */
.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.vehicle-card {
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: white;
}

.vehicle-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

/* Button Styles */
.btn-primary {
  background-color: #c5a46d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #b8956a;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.form-input:focus {
  outline: none;
  border-color: #c5a46d;
  box-shadow: 0 0 0 3px rgba(197, 164, 109, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .booking-header h1 {
    font-size: 2rem;
  }

  .vehicle-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .modal-content {
    margin: 1rem;
    padding: 1.5rem;
  }
}
`;

    fs.writeFileSync('dist/booking-ui.css', pcsCSS);
    console.log('✅ CSS file created successfully');
    console.log('🎉 esbuild process completed successfully!');

  }).catch((error) => {
    console.error('❌ esbuild failed:', error);
    process.exit(1);
  });

} catch (error) {
  console.error('❌ esbuild setup failed:', error);
  process.exit(1);
}

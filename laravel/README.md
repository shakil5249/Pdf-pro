# PDFProTools - iLovePDF Clone Laravel PHP Implementation Suite

This directory contains the production-ready Laravel MVC codebase for PDFProTools, designed for fast ZIP packaging and smooth deployment on standard cPanel hosting or VPS servers.

---

## 🚀 cPanel Step-By-Step Installation Guide

Follow these steps exactly to deploy your PDF processing SaaS on any standard shared hosting environment:

### Step 1: Package and Upload
1. Zip the entire content of this `laravel/` folder.
2. Log into your cPanel dashboard and open the **File Manager**.
3. Upload the ZIP file directly into your server's root directory (outside of `public_html` for maximum security).
4. Extract the ZIP. This places files in a custom folder, e.g., `/home/username/pdfprotools/`.

### Step 2: Configure Public Document Root
1. In cPanel **Domains** or **Subdomains** manager, set the document root parameter for your website domain to point directly towards the `public/` subdirectory within your extracted files:
   `Document Root: /home/username/pdfprotools/public`
2. This ensures index.php is active and protected from parent asset directory listings.

### Step 3: Database Registration
1. In cPanel, navigate to the **MySQL Database Wizard**.
2. Create a new database named `pdfprotools_db`.
3. Create a database user, generate a secure password, and add the user to the database with **All Privileges** checked.

### Step 4: Setup Environment Variables
1. Rename `.env.example` in your main folder to land as `.env` using File Manager text editor.
2. Edit the `.env` variables to match your credentials:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=pdfprotools_db
   DB_USERNAME=pdfprotools_user
   DB_PASSWORD=YOUR_SECURE_PASSWORD

   # Gemini API Credentials for advanced tools
   GEMINI_API_KEY="YOUR_KEY_API_HERE"
   ```

### Step 5: Run Key Generation & Migrations
If you have Terminal access enabled in cPanel, execute these commands inside your project root:
```bash
php artisan key:generate
php artisan migrate --force
php artisan storage:link
```
*If Terminal access is disabled, add temporary routes in your web.php or hit standard shell wrappers calling `Artisan::call('key:generate')` from any controller.*

### Step 6: Setup Cron Job Cleanups (CRITICAL)
cPanel servers need automatic cleanup rules to wipe out uploaded temporary files every 15 minutes.
1. Find **Cron Jobs** inside cPanel.
2. Select **Common Settings: Once Per Minute** or **15 Minutes**.
3. Point to Laravel schedule command path:
   `/usr/local/bin/php /home/username/pdfprotools/artisan schedule:run >> /dev/null 2>&1`

---

## 🛠️ PDF Processing Tool dependencies

The PDF processing engine requires several CLI libraries on your host server:
- **setasign/fpdi** (bundled)
- **smalot/pdfparser** (bundled)
- **dompdf/dompdf** (bundled)

*Advanced features such as JPG rasterizations and heavy vector compressions utilize server libraries `pdftoppm`, `ghostscript` & `imagick`. Verify these PHP extensions are checked active in cPanel's **Select PHP Version > Extensions** tab!*

---

## 📦 ZIP Package structures
```
├── app/
│   ├── Http/Controllers/
│   │   ├── PDFController.php (Merge, split, watermark, compress cores)
│   │   ├── AdminController.php
│   │   └── FrontendController.php
│   ├── Models/
│   │   ├── BlogPost.php
│   │   ├── PdfTool.php
│   │   └── Setting.php
├── database/
│   ├── migrations/
│   │   └── 2026_06_14_000000_create_pdf_pro_tables.php
├── resources/
│   ├── views/
│   │   ├── layouts/app.blade.php (Common frame HTML layout, Tailwind CSS)
│   │   ├── frontend/index.blade.php
├── routes/
│   └── web.php (Frontend, Admin panel and PDF API routes)
├── .env.example
├── .htaccess (cPanel rewrite guidelines)
└── composer.json
```

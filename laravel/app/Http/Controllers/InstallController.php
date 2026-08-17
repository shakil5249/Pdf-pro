<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use App\Models\PdfTool;
use App\Models\Setting;
use PDO;
use Exception;

class InstallController extends Controller
{
    /**
     * Display the installation page
     */
    public function index()
    {
        // Security check: blockage if already installed
        if (File::exists(storage_path('installed'))) {
            return redirect('/')->with('error', 'Product is already installed. To reinstall, please delete storage/installed first.');
        }

        // Requirements checking
        $requirements = [
            'php_version' => version_compare(PHP_VERSION, '8.1.0', '>='),
            'pdo' => extension_loaded('pdo'),
            'pdo_mysql' => extension_loaded('pdo_mysql'),
            'mbstring' => extension_loaded('mbstring'),
            'openssl' => extension_loaded('openssl'),
            'xml' => extension_loaded('xml'),
            'ctype' => extension_loaded('ctype'),
            'fileinfo' => extension_loaded('fileinfo'),
            'env_exists' => File::exists(base_path('.env')) || File::exists(base_path('.env.example')),
            'storage_writable' => is_writable(storage_path()),
            'cache_writable' => is_writable(bootstrap_path('cache')),
        ];

        // Overall status
        $allPassed = !in_array(false, $requirements, true);

        return view('install', compact('requirements', 'allPassed'));
    }

    /**
     * Process configuration and run installation
     */
    public function install(Request $request)
    {
        if (File::exists(storage_path('installed'))) {
            return redirect('/')->with('error', 'Installation was already completed.');
        }

        $request->validate([
            'db_host' => 'required|string',
            'db_port' => 'required|string',
            'db_name' => 'required|string',
            'db_user' => 'required|string',
            'db_pass' => 'nullable|string',
            'app_name' => 'required|string|max:255',
            'app_url' => 'required|url',
            'admin_username' => 'required|string|min:4|max:50',
            'admin_password' => 'required|string|min:6',
            'admin_email' => 'required|email',
        ]);

        $dbHost = $request->input('db_host');
        $dbPort = $request->input('db_port');
        $dbName = $request->input('db_name');
        $dbUser = $request->input('db_user');
        $dbPass = $request->input('db_pass') ?? '';

        // 1. Verify Database Connection
        try {
            $dsn = "mysql:host={$dbHost};port={$dbPort};charset=utf8mb4";
            $pdo = new PDO($dsn, $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 5
            ]);

            // Attempt to create database if it does not exist
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
        } catch (Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Database connection failed: ' . $e->getMessage());
        }

        // 2. Write/Update .env file
        try {
            $envPath = base_path('.env');
            if (!File::exists($envPath)) {
                if (File::exists(base_path('.env.example'))) {
                    File::copy(base_path('.env.example'), $envPath);
                } else {
                    File::put($envPath, '');
                }
            }

            $envContent = File::get($envPath);

            $updates = [
                'APP_NAME' => '"' . str_replace('"', '\\"', $request->input('app_name')) . '"',
                'APP_URL' => $request->input('app_url'),
                'DB_HOST' => $dbHost,
                'DB_PORT' => $dbPort,
                'DB_DATABASE' => $dbName,
                'DB_USERNAME' => $dbUser,
                'DB_PASSWORD' => $dbPass ? '"' . str_replace('"', '\\"', $dbPass) . '"' : '',
            ];

            foreach ($updates as $key => $value) {
                // Check if key exists in env content
                if (preg_match("/^{$key}=/m", $envContent)) {
                    $envContent = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $envContent);
                } else {
                    $envContent .= "\n{$key}={$value}";
                }
            }

            // Ensure APP_KEY exists
            if (!str_contains($envContent, 'APP_KEY') || empty(env('APP_KEY'))) {
                $appKey = 'base64:' . base64_encode(random_bytes(32));
                if (preg_match("/^APP_KEY=/m", $envContent)) {
                    $envContent = preg_replace("/^APP_KEY=.*/m", "APP_KEY={$appKey}", $envContent);
                } else {
                    $envContent .= "\nAPP_KEY={$appKey}";
                }
            }

            File::put($envPath, trim($envContent) . "\n");
        } catch (Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Writing config settings to .env failed: ' . $e->getMessage());
        }

        // Reconnect with new env config safely dynamically
        config(['database.connections.mysql.host' => $dbHost]);
        config(['database.connections.mysql.port' => $dbPort]);
        config(['database.connections.mysql.database' => $dbName]);
        config(['database.connections.mysql.username' => $dbUser]);
        config(['database.connections.mysql.password' => $dbPass]);
        DB::purge('mysql');

        // 3. Run Database Migrations
        try {
            Artisan::call('migrate:fresh', ['--force' => true]);
        } catch (Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Running database migrations failed: ' . $e->getMessage());
        }

        // 4. Seed Core Default Site Data
        try {
            // Setup site configurations & info
            Setting::setVal('site_name', $request->input('app_name'));
            Setting::setVal('site_url', $request->input('app_url'));
            Setting::setVal('timezone', 'UTC');
            Setting::setVal('homeBadge', 'Professional-Grade Multi-tool Suite');
            Setting::setVal('homeHeading', 'Every PDF Tool You Need, <span class="text-red-500">at your fingertips</span>');
            Setting::setVal('homeSubheading', 'The ultimate SaaS platform with PDF processing tools. Secure server-side engine with AI-Powered features for document automation.');
            Setting::setVal('seo_title', $request->input('app_name') . ' | Free Online PDF Tools SaaS Platform');
            Setting::setVal('seo_description', 'Merge, split, compress, convert, edit, rotate, unlock, protect, and watermarks PDFs online. Real-time fast operations fully secured and simple.');
            Setting::setVal('seo_keywords', 'ilovepdf clone, online pdf merger, compress pdf file, word to pdf converter, split pdf page, sign pdf draft');
            Setting::setVal('code_header', '<!-- Google Tag Manager Injected via Admin -->');
            Setting::setVal('code_body', '<!-- Custom Analytics Body Segment -->');
            Setting::setVal('code_footer', '<!-- Footer Scripts and Web Hooks -->');
            Setting::setVal('footer_about', 'The premier online suite built for maximum optimization. Merge, compress, convert, sign, and redact documents globally. 100% cloud secure.');
            
            // Setup Admin Access Secrets
            Setting::setVal('admin_username', $request->input('admin_username'));
            Setting::setVal('admin_email', $request->input('admin_email'));
            Setting::setVal('admin_password', bcrypt($request->input('admin_password')));

            // Seed PDF tools matching INITIAL_TOOLS in React
            $initialTools = [
                // Organize
                ['tool_id' => 'merge-pdf', 'name' => 'Merge PDF', 'category' => 'organize', 'description' => 'Combine multiple PDF files into one single PDF document in seconds.'],
                ['tool_id' => 'split-pdf', 'name' => 'Split PDF', 'category' => 'organize', 'description' => 'Extract specific page ranges or split every page into separate files.'],
                ['tool_id' => 'organize-pdf', 'name' => 'Organize PDF', 'category' => 'organize', 'description' => 'Reorder, rotate, delete, or insert blank years into your PDF.'],
                ['tool_id' => 'reverse-pdf', 'name' => 'Reverse PDF', 'category' => 'organize', 'description' => 'Invert the page order of your PDF file instantly.'],
                ['tool_id' => 'remove-pages', 'name' => 'Remove PDF Pages', 'category' => 'organize', 'description' => 'Delete unwanted pages from your document to trim its size.'],
                ['tool_id' => 'extract-pages', 'name' => 'Extract PDF Pages', 'category' => 'organize', 'description' => 'Save selected PDF pages as a brand new independent file.'],
                
                // Optimize
                ['tool_id' => 'compress-pdf', 'name' => 'Compress PDF', 'category' => 'optimize', 'description' => 'Reduce the file size of your PDF while maintaining optimal visual quality.'],
                ['tool_id' => 'pdf-sanitizer', 'name' => 'PDF Sanitizer', 'category' => 'optimize', 'description' => 'Remove hidden data, links, scripts, and javascript to protect privacy.'],
                ['tool_id' => 'enhance-pdf', 'name' => 'Enhance PDF', 'category' => 'optimize', 'description' => 'Improve scanner quality, adjust contrast, and sharpen blurry text.'],
                ['tool_id' => 'remove-metadata', 'name' => 'Remove Metadata', 'category' => 'optimize', 'description' => 'Wipe author names, software, creation dates, and metadata tags.'],
                
                // Convert To PDF
                ['tool_id' => 'word-to-pdf', 'name' => 'Word to PDF', 'category' => 'convert-to', 'description' => 'Convert Docx/Doc documents into flawless standard PDF files.'],
                ['tool_id' => 'excel-to-pdf', 'name' => 'Excel to PDF', 'category' => 'convert-to', 'description' => 'Turn XLS/XLSX spreadsheets into dynamic, beautiful PDF sheets.'],
                ['tool_id' => 'pptx-to-pdf', 'name' => 'PPTX to PDF', 'category' => 'convert-to', 'description' => 'Transform PowerPoint slideshow presentations into PDF notes.'],
                ['tool_id' => 'jpg-to-pdf', 'name' => 'JPG to PDF', 'category' => 'convert-to', 'description' => 'Convert your JPG images to high-quality PDF in matching paper sizes.'],
                ['tool_id' => 'png-to-pdf', 'name' => 'PNG to PDF', 'category' => 'convert-to', 'description' => 'Convert PNG images with transparent canvas into a clean PDF.'],
                ['tool_id' => 'html-to-pdf', 'name' => 'HTML to PDF', 'category' => 'convert-to', 'description' => 'Save active webpages or upload custom HTML files directly to PDF.'],
                
                // Convert From PDF
                ['tool_id' => 'pdf-to-jpg', 'name' => 'PDF to JPG', 'category' => 'convert-from', 'description' => 'Export all PDF pages or extract all stored images into JPG format.'],
                ['tool_id' => 'pdf-to-png', 'name' => 'PDF to PNG', 'category' => 'convert-from', 'description' => 'Extract pages as high-resolution PNG images with exact dimensions.'],
                ['tool_id' => 'pdf-to-word', 'name' => 'PDF to Word', 'category' => 'convert-from', 'description' => 'Get a clean, editable Word document from any standard PDF file.'],
                ['tool_id' => 'pdf-to-excel', 'name' => 'PDF to Excel', 'category' => 'convert-from', 'description' => 'Extract tables from your PDF right into editable spreadsheet rows.'],
                
                // Edit / Style
                ['tool_id' => 'edit-pdf', 'name' => 'Edit PDF', 'category' => 'edit', 'description' => 'Add custom texts, drawings, annotations, and shapes in an interactive editor.'],
                ['tool_id' => 'add-watermark', 'name' => 'Add Watermark', 'category' => 'edit', 'description' => 'Stamps a customizable image or text on top of all PDF pages in matching grids.'],
                ['tool_id' => 'add-page-numbers', 'name' => 'Add Page Numbers', 'category' => 'edit', 'description' => 'Inject dynamic page number labels easily in custom fonts, sizes, and colors.'],
                ['tool_id' => 'crop-pdf', 'name' => 'Crop PDF', 'category' => 'edit', 'description' => 'Trims out margins, adjusts layout boundaries, and crops canvas fields.'],
                
                // Security Group
                ['tool_id' => 'protect-pdf', 'name' => 'Protect PDF', 'category' => 'security', 'description' => 'Encrypt documents with high-security passcodes to restrict unauthorized copies.'],
                ['tool_id' => 'unlock-pdf', 'name' => 'Unlock PDF', 'category' => 'security', 'description' => 'Decrypt and strip password protections so they can be viewed without prompts.'],
                ['tool_id' => 'digital-sign', 'name' => 'Digital Sign / Batch', 'category' => 'security', 'description' => 'Officially sign your agreements with secure certificates or drawing signatures.'],
                
                // AI & Advanced
                ['tool_id' => 'ai-pdf-chat', 'name' => 'AI Document Copilot', 'category' => 'ai-advanced', 'description' => 'Ask complex reasoning questions, extract intelligence, edit, or summarize with dynamic high-thinking engines.'],
                ['tool_id' => 'translate-pdf', 'name' => 'Translate PDF', 'category' => 'ai-advanced', 'description' => 'AI assistant auto-translates text in your PDF pages to other languages.'],
                ['tool_id' => 'redact-pdf', 'name' => 'Redact & Auto Redact', 'category' => 'ai-advanced', 'description' => 'Search and permanently obliterate selected phrases, ssns, or names.'],
            ];

            foreach ($initialTools as $toolData) {
                PdfTool::updateOrCreate(['tool_id' => $toolData['tool_id']], $toolData);
            }

            // Seed 16 default Ad spaces
            $initialAds = [
                ['spot_key' => 'header_ad', 'name' => 'Header Ads (Main Top)', 'code' => '<div class="w-full bg-linear-to-r from-red-500/5 to-amber-500/5 border border-red-100 rounded-2xl p-4 text-center text-slate-700 min-h-[90px] flex flex-col items-center justify-center transition-all duration-300 md:min-h-[120px]"><span class="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1 font-mono">Sponsored Banner</span><span class="text-xs md:text-sm font-sans font-semibold">Grow your business today. Supercharge all documents.</span></div>', 'active' => true],
                ['spot_key' => 'body_ad', 'name' => 'Body Ads (Mid Content)', 'code' => '<div class="w-full bg-linear-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-2xl p-6 text-center text-slate-700 min-h-[100px] flex flex-col items-center justify-center"><span class="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mb-1 font-mono">Advertisement</span><span class="text-xs font-semibold">Transform workflow with AI capabilities and Cloud PDF Storage solutions.</span></div>', 'active' => false],
                ['spot_key' => 'inside_tools_ad', 'name' => 'Inside Tools Ad Slot', 'code' => '<div class="w-full bg-linear-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-100 rounded-xl p-3 text-center text-slate-700 min-h-[80px] flex flex-col items-center justify-center"><span class="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5 font-mono">SaaS Tool Partner</span><span class="text-[11px] font-medium">Verify or repair PDFs with zero latency. Secure enterprise-grade storage.</span></div>', 'active' => true],
                ['spot_key' => 'sidebar_ad', 'name' => 'Sidebar Ads (General Page)', 'code' => '<div class="w-full min-h-[250px] bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col items-center justify-center text-center text-slate-600"><span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Premium Sponsor</span><p class="text-xs font-semibold leading-relaxed">Boost SEO metrics and page loading speeds naturally by optimizing images and static documents.</p></div>', 'active' => true],
                ['spot_key' => 'footer_ad', 'name' => 'Footer Ads (Bottom Banner)', 'code' => '<div class="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-center text-slate-300 min-h-[80px] flex flex-col items-center justify-center"><span class="text-[8px] font-bold text-red-500 uppercase tracking-widest mb-1 font-mono">Featured Ad</span><span class="text-xs font-sans font-medium text-slate-400">Copyright (c) 2026. Secure transmission guaranteed for enterprise teams.</span></div>', 'active' => true],
                ['spot_key' => 'header_bottom_ad', 'name' => 'Header Bottom Ad Slot', 'code' => '<div class="w-full bg-linear-to-r from-red-500/5 to-rose-500/5 border border-red-500/10 rounded-xl py-2 px-4 text-center text-red-850 text-xs min-h-[60px] flex flex-col items-center justify-center"><span class="text-[9px] font-mono tracking-widest text-red-500 uppercase font-bold block">Ad: Header Bottom Hub</span><span class="text-[11px] font-semibold">Join premium tier for double file processing velocity limits.</span></div>', 'active' => false],
                ['spot_key' => 'toolbox_left_ad', 'name' => 'Toolbox Left Ad Slot', 'code' => '<div class="w-full min-h-[200px] h-full bg-linear-to-b from-sky-500/5 to-indigo-500/5 border border-sky-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-slate-600"><span class="text-[9px] font-bold text-sky-500 uppercase tracking-widest mb-2 font-mono">Left Panel Spacer</span><p class="text-xs font-semibold leading-relaxed">PDFProTools includes state of the art optical character readers and security redactors.</p></div>', 'active' => false],
                ['spot_key' => 'toolbox_right_ad', 'name' => 'Toolbox Right Ad Slot', 'code' => '<div class="w-full min-h-[200px] h-full bg-linear-to-b from-sky-500/5 to-indigo-500/5 border border-sky-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-slate-600"><span class="text-[9px] font-bold text-sky-500 uppercase tracking-widest mb-2 font-mono">Right Panel Spacer</span><p class="text-xs font-semibold leading-relaxed">Upload any doc, xlsx, or pptx file to convert directly into standard PDF assets instantly.</p></div>', 'active' => false],
                ['spot_key' => 'toolbox_top_ad', 'name' => 'Toolbox Top Ad Slot', 'code' => '<div class="w-full bg-linear-to-r from-rose-500/5 via-violet-500/5 to-blue-500/5 border border-violet-100 rounded-2xl p-3.5 text-center text-slate-700 min-h-[75px] flex flex-col items-center justify-center"><span class="text-[8px] font-bold text-rose-500 uppercase tracking-widest mb-0.5 font-mono">Ad Spot: Toolbox Top Responsive</span><span class="text-xs font-semibold">No installations needed. Securely run client-side on browsers directly.</span></div>', 'active' => true],
                ['spot_key' => 'toolbox_bottom_ad', 'name' => 'Toolbox Bottom Ad Slot', 'code' => '<div class="w-full bg-linear-to-r from-rose-500/5 via-violet-500/5 to-blue-500/5 border border-violet-100 rounded-2xl p-3.5 text-center text-slate-700 min-h-[75px] flex flex-col items-center justify-center"><span class="text-[8px] font-bold text-rose-500 uppercase tracking-widest mb-0.5 font-mono">Ad Spot: Toolbox Bottom Responsive</span><span class="text-xs font-semibold">Over 1,200,000 documents processed this week. High fidelity output assured.</span></div>', 'active' => true],
                ['spot_key' => 'post_top_ad', 'name' => 'Post Top Ad Slot (Blogs)', 'code' => '<div class="w-full bg-amber-500/5 border border-amber-100 rounded-xl p-3 text-center text-slate-700 min-h-[70px] flex flex-col items-center justify-center"><span class="text-[8px] font-bold text-amber-600 uppercase tracking-widest mb-0.5 font-mono">Blog Sponsor</span><span class="text-xs font-semibold">Understand state compliance: sign document templates legal under ESIGN Act.</span></div>', 'active' => true],
                ['spot_key' => 'post_bottom_ad', 'name' => 'Post Bottom Ad Slot (Blogs)', 'code' => '<div class="w-full bg-emerald-500/5 border border-emerald-100 rounded-xl p-3 text-center text-slate-700 min-h-[70px] flex flex-col items-center justify-center"><span class="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5 font-mono">Closing Offer</span><span class="text-xs font-semibold">Got extra-large records? Compress up to 98% space with Lossless Quality.</span></div>', 'active' => true],
                ['spot_key' => 'post_sidebar_ad', 'name' => 'Post Sidebar Ad Slot (Blogs)', 'code' => '<div class="w-full min-h-[220px] bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center text-slate-600"><span class="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mb-2 font-mono">Article Ad Block</span><p class="text-xs font-semibold leading-relaxed">Save hours of administrative work. Sign and redact sensitive papers using AI.</p></div>', 'active' => true],
            ];

            foreach ($initialAds as $adData) {
                DB::table('ad_spots')->updateOrInsert(['spot_key' => $adData['spot_key']], $adData);
            }

            // Seed beautiful custom pages (JSON stored in setting `custom_pages`)
            $defaultPages = [
                [
                    'id' => 'p1',
                    'title' => 'About Us',
                    'slug' => 'about-us',
                    'content' => "## About Us\n\nWelcome to **PDFProTools** — the internet's premier, fully responsive online document optimization suite.\n\nOur mission is simple: to democratize high-grade document tools and engineering workflows so that anyone can edit, merge, split, compress, and sanitize electronic documents for free.",
                    'isActive' => true,
                    'seoTitle' => 'About Us | Our Story and Mission',
                    'seoDescription' => 'Discover our story and the engineering philosophy behind our secure free utility suite.',
                    'seoKeywords' => 'about us, pdf pro tools team, free converter',
                ],
                [
                    'id' => 'p2',
                    'title' => 'Terms of Service',
                    'slug' => 'terms-of-service',
                    'content' => "## Terms of Service\n\nBy uploading files or utilizing any processing utilities on this site, you acknowledge that you have read, understood, and agree to these terms.\n\n### 1. Acceptance of Terms\nWe provide free tools for standard consumer processing. Abuse, automated scripting, or server overloading is strictly prohibited.",
                    'isActive' => true,
                    'seoTitle' => 'Terms of Service | PDFProTools',
                    'seoDescription' => 'Terms of service and fair usage guidelines for our PDF tool suite.',
                    'seoKeywords' => 'terms of service, legal, fair usage',
                ],
                [
                    'id' => 'p3',
                    'title' => 'Privacy Policy',
                    'slug' => 'privacy-policy',
                    'content' => "## Privacy Policy\n\nAt our core, your data security and privacy are our top priorities.\n\n### 1. Data Collection\nWe do not harvest or keep your documents. Any data transfer is strictly encrypted over secure connections using modern TLS configurations.",
                    'isActive' => true,
                    'seoTitle' => 'Privacy Policy | Data Security',
                    'seoDescription' => 'Learn about our military-grade security sandbox and 15-minute file incineration privacy protocols.',
                    'seoKeywords' => 'privacy policy, safe pdf, file security',
                ],
            ];
            Setting::setVal('custom_pages', json_encode($defaultPages));

            // Seed default FAQs
            $defaultFaqs = [
                [
                    'id' => 'faq_1',
                    'question' => 'How secure is my data when uploading files to PDFProTools?',
                    'answer' => 'PDFProTools enforces strict compliance protocols. All file transmissions are encrypted using modern TLS layers. Uploaded documents are processed in sandboxed sessions and automatically incinerated immediately or within 15 minutes of completion. We never store, copy, share, or inspect your documents.',
                    'order' => 1
                ],
                [
                    'id' => 'faq_2',
                    'question' => 'Are there any constraints or subscription requirements to use the toolbox?',
                    'answer' => 'Standard document conversion, splitting, merging, and optimization features are entirely free for consumers and developers alike. We do not require credit cards or account registration for default operations.',
                    'order' => 2
                ],
            ];
            Setting::setVal('faqs', json_encode($defaultFaqs));

            // Seed Header & Footer default menu
            $headerMenu = [
                ['id' => 'm1', 'label' => 'Suite Tools', 'type' => 'home', 'value' => '', 'order' => 1],
                ['id' => 'm2', 'label' => 'Guides & Blog', 'type' => 'blog', 'value' => '', 'order' => 2],
                ['id' => 'm3', 'label' => 'About Us', 'type' => 'page', 'value' => 'about-us', 'order' => 3],
            ];
            Setting::setVal('header_menu', json_encode($headerMenu));

            $footerMenu = [
                ['id' => 'f1', 'label' => 'About Us', 'type' => 'page', 'value' => 'about-us', 'order' => 1],
                ['id' => 'f2', 'label' => 'Terms of Service', 'type' => 'page', 'value' => 'terms-of-service', 'order' => 2],
                ['id' => 'f3', 'label' => 'Privacy Policy', 'type' => 'page', 'value' => 'privacy-policy', 'order' => 3],
            ];
            Setting::setVal('footer_menu', json_encode($footerMenu));

            // Seed custom mock blog posts
            BlogPost::create([
                'title' => 'How to Compress PDF Files Without Losing Image Quality',
                'slug' => 'compress-pdf-no-quality-loss',
                'summary' => 'Discover the best tips and step-by-step guidelines on reducing PDF file size while keeping visual elements pristine.',
                'content' => "## Why compressing PDF is crucial\n\nPDF documents containing high-resolution graphics, photos, or vectors can easily exceed 50MB. This presents bottlenecks when sending via email or uploading to web portals.\n\nIn this article, we explain how PDF compression algorithms function...",
                'featured_image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
                'seo_title' => 'Compress PDF Files without Quality Loss | PDFProTools Blog',
                'seo_description' => 'Learn simple workflows to compress huge PDF folders retaining image sharpness.',
                'seo_keywords' => 'compress pdf, reduce pdf size, quality pdf compression',
            ]);

        } catch (Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Seeding database with default parameters failed: ' . $e->getMessage());
        }

        // 5. Generate lock file to finalize installation
        try {
            File::put(storage_path('installed'), date('Y-m-d H:i:s'));
        } catch (Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Failed to generate installation lock file. Please ensure storage/ is writable.');
        }

        return view('install_success', [
            'appName' => $request->input('app_name'),
            'appUrl' => $request->input('app_url'),
            'adminUser' => $request->input('admin_username')
        ]);
    }
}

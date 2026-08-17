<?php

namespace App\Http\Controllers;

use App\Models\PdfTool;
use App\Models\BlogPost;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FrontendController extends Controller
{
    /**
     * Common method to get active header and footer menus and global settings
     */
    private function getCommonData()
    {
        $siteName = Setting::getVal('site_name', 'PDFProTools');
        $siteUrl = Setting::getVal('site_url', 'http://localhost:3000');
        
        $headerMenu = json_decode(Setting::getVal('header_menu', '[]'), true);
        $footerMenu = json_decode(Setting::getVal('footer_menu', '[]'), true);

        // Fallback menus if empty
        if (empty($headerMenu)) {
            $headerMenu = [
                ['id' => 'm1', 'label' => 'Suite Tools', 'type' => 'home', 'value' => '', 'order' => 1],
                ['id' => 'm2', 'label' => 'Guides & Blog', 'type' => 'blog', 'value' => '', 'order' => 2],
                ['id' => 'm3', 'label' => 'About Us', 'type' => 'page', 'value' => 'about-us', 'order' => 3],
                ['id' => 'm4', 'label' => 'Contact Us', 'type' => 'page', 'value' => 'contact-us', 'order' => 4],
            ];
        }

        if (empty($footerMenu)) {
            $footerMenu = [
                ['id' => 'f1', 'label' => 'About Us', 'type' => 'page', 'value' => 'about-us', 'order' => 1],
                ['id' => 'f2', 'label' => 'Terms of Service', 'type' => 'page', 'value' => 'terms-of-service', 'order' => 2],
                ['id' => 'f3', 'label' => 'Privacy Policy', 'type' => 'page', 'value' => 'privacy-policy', 'order' => 3],
                ['id' => 'f4', 'label' => 'Contact Us', 'type' => 'page', 'value' => 'contact-us', 'order' => 4],
                ['id' => 'f5', 'label' => 'Cookie Policy', 'type' => 'page', 'value' => 'cookie-policy', 'order' => 5],
            ];
        }

        $allAds = \Illuminate\Support\Facades\DB::table('ad_spots')->get()->keyBy('spot_key');

        return compact('siteName', 'siteUrl', 'headerMenu', 'footerMenu', 'allAds');
    }

    /**
     * Show Homepage listing all tools
     */
    public function index(Request $request)
    {
        $common = $this->getCommonData();

        $searchQuery = $request->query('q', '');
        $selectedCategory = $request->query('category', 'all');

        $query = PdfTool::query();
        
        if ($selectedCategory !== 'all') {
            $query->where('category', $selectedCategory);
        }

        if (!empty($searchQuery)) {
            $query->where(function($q) use ($searchQuery) {
                $q->where('name', 'like', "%{$searchQuery}%")
                  ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        $tools = $query->get()->groupBy('category');
        $allToolsList = PdfTool::all();

        // Load dynamic visual categories
        $categoriesList = [
            ['id' => 'organize', 'label' => 'Organize PDF', 'icon' => 'Layers', 'description' => 'Merge, split, rotate, and manage PDF page matrices.'],
            ['id' => 'optimize', 'label' => 'Optimize & Sanitize', 'icon' => 'ShieldCheck', 'description' => 'Compress paper sizes and strip secure metadata tracking tags.'],
            ['id' => 'convert-to', 'label' => 'Convert to PDF', 'icon' => 'ArrowDown', 'description' => 'Inbound Word documents, excels or photos transformed to classic PDF layout.'],
            ['id' => 'convert-from', 'label' => 'Convert from PDF', 'icon' => 'ExternalLink', 'description' => 'Outbound Excel spreadsheets, unicode files, or JPG vectors.'],
            ['id' => 'edit', 'label' => 'Edit & Style', 'icon' => 'FilePenLine', 'description' => 'Stamp watermarks, number pages, color-replace text ranges or add banners.'],
            ['id' => 'security', 'label' => 'Security & Sign', 'icon' => 'Lock', 'description' => 'Encrypt records, strip copying blocks, or digital-sign agreement logs.'],
            ['id' => 'ai-advanced', 'label' => 'AI & Advanced', 'icon' => 'Sparkles', 'description' => 'Automate content classification, redact PII fields or translate text structures.'],
        ];

        // Load Dynamic FAQs
        $faqs = json_decode(Setting::getVal('faqs', '[]'), true);
        if (empty($faqs)) {
            $faqs = [
                ['id' => 'faq1', 'question' => 'How secure is my data when uploading files to PDFProTools?', 'answer' => 'PDFProTools enforces strict compliance protocols. All file transmissions are encrypted using modern TLS layers. Uploaded documents are processed in sandboxed sessions and automatically incinerated within 15 minutes of completion.'],
                ['id' => 'faq2', 'question' => 'Are there any constraints or subscription requirements?', 'answer' => 'Standard document conversion, splitting, merging, and optimization features are entirely free for consumers and developers alike.'],
            ];
        }

        $homeSettings = [
            'badge' => Setting::getVal('homeBadge', 'Professional-Grade Multi-tool Suite'),
            'heading' => Setting::getVal('homeHeading', 'Every PDF Tool You Need, <span class="text-red-500">at your fingertips</span>'),
            'subheading' => Setting::getVal('homeSubheading', 'The ultimate SaaS platform with PDF processing tools. Secure server-side engine with AI-Powered features for document automation.'),
        ];

        $seo = [
            'title' => Setting::getVal('seo_title', 'PDFProTools | Free Online PDF Tools Suite'),
            'description' => Setting::getVal('seo_description', 'Merge, split, compress, watermark, protect, and edit PDF documents recursively.'),
            'keywords' => Setting::getVal('seo_keywords', 'ilovepdf, merge pdf, split pdf, rotate pdf, encrypt pdf, convert pdf to word, pdf tools')
        ];

        return view('frontend.index', array_merge($common, compact(
            'tools', 'allToolsList', 'categoriesList', 'selectedCategory', 'searchQuery', 'faqs', 'homeSettings', 'seo'
        )));
    }

    /**
     * Display a specific interactive PDF Tool Page matching ToolViewer React Component
     */
    public function showTool($id)
    {
        $common = $this->getCommonData();
        $tool = PdfTool::where('tool_id', $id)->firstOrFail();

        $seo = [
            'title' => "Free Online " . $tool->name . " Tool | PDFProTools",
            'description' => $tool->description,
            'keywords' => strtolower($tool->name) . ", free online pdf tools, pdf converter"
        ];

        // Process options based on tool IDs to determine what UI config inputs to render
        $toolOptions = [
            'watermark-pdf' => [
                'hasText' => true,
                'hasColor' => true,
                'hasRotation' => true,
                'placeholder' => 'CONFIDENTIAL'
            ],
            'compress-pdf' => [
                'hasCompressionLevels' => true,
            ],
            'protect-pdf' => [
                'hasPassword' => true,
                'placeholder' => 'Enter lock password'
            ],
            'split-pdf' => [
                'hasPageRanges' => true,
                'placeholder' => 'e.g. 1-3, 5, 8-12'
            ]
        ];

        $options = $toolOptions[$id] ?? null;

        return view('frontend.tool_workspace', array_merge($common, compact('tool', 'seo', 'options')));
    }

    /**
     * Show Blogs Grid
     */
    public function blogList()
    {
        $common = $this->getCommonData();
        $posts = BlogPost::orderBy('created_at', 'desc')->paginate(12);
        
        $seo = [
            'title' => 'PDFProTools Blog & Helpful Guides',
            'description' => 'Detailed tutorials, productivity workflows, and cryptographic signature reviews.',
            'keywords' => 'pdf guides, pdf tips, how to compress pdf, sign contracts online'
        ];

        return view('frontend.blog_list', array_merge($common, compact('posts', 'seo')));
    }

    /**
     * Show Blog Details Article
     */
    public function blogDetail($slug)
    {
        $common = $this->getCommonData();
        $post = BlogPost::where('slug', $slug)->firstOrFail();

        // Load 2 recent related posts
        $relatedPosts = BlogPost::where('id', '!=', $post->id)->take(2)->get();
        
        $seo = [
            'title' => $post->seo_title ?? $post->title,
            'description' => $post->seo_description ?? $post->summary,
            'keywords' => $post->seo_keywords ?? 'pdf guide'
        ];

        return view('frontend.blog_detail', array_merge($common, compact('post', 'relatedPosts', 'seo')));
    }

    /**
     * Render dynamic custom pages (e.g. About, Terms of Service, Contact, Privacy)
     */
    public function showPage($slug)
    {
        $common = $this->getCommonData();
        $pages = json_decode(Setting::getVal('custom_pages', '[]'), true);
        
        $page = null;
        foreach ($pages as $p) {
            if ($p['slug'] === $slug) {
                $page = $p;
                break;
            }
        }

        if (!$page) {
            abort(404, 'Creative custom page was not found.');
        }

        $seo = [
            'title' => $page['seoTitle'] ?? ($page['title'] . " | " . $common['siteName']),
            'description' => $page['seoDescription'] ?? $page['title'],
            'keywords' => $page['seoKeywords'] ?? 'custom page'
        ];

        return view('frontend.page', array_merge($common, compact('page', 'seo')));
    }

    /**
     * Handle Feedback Contact Widget forms Submission
     */
    public function submitFeedback(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'message' => 'required|string',
            'rating' => 'nullable|integer'
        ]);

        // In a database implementation, we could log this to a feedbacks table, 
        // to keep it simple, we redirect with a nice success notification alert
        return redirect()->back()->with('contact_success', 'Your report has been submitted to the support desk. Thank you for your feedback!');
    }
}

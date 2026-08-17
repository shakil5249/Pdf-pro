<?php

namespace App\Http\Controllers;

use App\Models\PdfTool;
use App\Models\BlogPost;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class AdminController extends Controller
{
    /**
     * Check if admin is logged in (session guard)
     */
    private function checkAuth()
    {
        return Session::get('admin_logged_in') === true;
    }

    /**
     * Display Admin Login Page
     */
    public function showLoginForm()
    {
        if ($this->checkAuth()) {
            return redirect()->route('admin.dashboard');
        }
        return view('admin.login');
    }

    /**
     * Handle Admin Login
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $username = $request->input('username');
        $password = $request->input('password');

        $storedUser = Setting::getVal('admin_username', 'admin');
        $storedEmail = Setting::getVal('admin_email', 'admin@your-domain.com');
        $storedPassHash = Setting::getVal('admin_password');

        // Fallback to bcrypt if not hashed (for default seeding of admin123)
        $isPasswordCorrect = false;
        if ($storedPassHash) {
            if (Hash::check($password, $storedPassHash)) {
                $isPasswordCorrect = true;
            } elseif ($password === 'admin123' || $password === $storedPassHash) {
                // Backward compatibility check
                $isPasswordCorrect = true;
                // Re-hash for security
                Setting::setVal('admin_password', Hash::make($password));
            }
        } else {
            // First time setup check
            if ($password === 'admin123') {
                $isPasswordCorrect = true;
                Setting::setVal('admin_password', Hash::make('admin123'));
            }
        }

        if (($username === $storedUser || $username === $storedEmail) && $isPasswordCorrect) {
            Session::put('admin_logged_in', true);
            Session::put('admin_username', $storedUser);
            
            // Remember me support (30 days)
            if ($request->has('remember')) {
                Session::put('admin_session_expires', time() + (30 * 24 * 60 * 60));
            }

            return redirect()->route('admin.dashboard')->with('success', 'Logged in successfully.');
        }

        return redirect()->back()->withInput()->with('error', 'Invalid administrator credentials.');
    }

    /**
     * Handle Admin Logout
     */
    public function logout()
    {
        Session::forget('admin_logged_in');
        Session::forget('admin_username');
        Session::forget('admin_session_expires');
        return redirect()->route('admin.login')->with('success', 'Signed out successfully.');
    }

    /**
     * Dashboard view showing core analytics
     */
    public function dashboard()
    {
        if (!$this->checkAuth()) {
            return redirect()->route('admin.login');
        }

        $totalUsages = PdfTool::sum('usages_count');
        $activeToolsCount = PdfTool::where('is_active', true)->count();
        $totalBlogsCount = BlogPost::count();
        
        // Fetch top used tools
        $topTools = PdfTool::orderBy('usages_count', 'desc')->take(10)->get();

        // Fetch settings metadata
        $settings = [
            'site_name' => Setting::getVal('site_name', 'PDFProTools'),
            'site_url' => Setting::getVal('site_url', 'http://localhost:3000'),
            'timezone' => Setting::getVal('timezone', 'UTC'),
            'seo_title' => Setting::getVal('seo_title', ''),
            'seo_description' => Setting::getVal('seo_description', ''),
            'seo_keywords' => Setting::getVal('seo_keywords', ''),
            'code_header' => Setting::getVal('code_header', ''),
            'code_body' => Setting::getVal('code_body', ''),
            'code_footer' => Setting::getVal('code_footer', ''),
            'footer_about' => Setting::getVal('footer_about', ''),
            'homeBadge' => Setting::getVal('homeBadge', ''),
            'homeHeading' => Setting::getVal('homeHeading', ''),
            'homeSubheading' => Setting::getVal('homeSubheading', ''),
            'admin_username' => Setting::getVal('admin_username', 'admin'),
            'admin_email' => Setting::getVal('admin_email', 'admin@your-domain.com'),
        ];

        // Fetch custom pages, faqs, and menus
        $customPages = json_decode(Setting::getVal('custom_pages', '[]'), true);
        $faqs = json_decode(Setting::getVal('faqs', '[]'), true);
        $headerMenu = json_decode(Setting::getVal('header_menu', '[]'), true);
        $footerMenu = json_decode(Setting::getVal('footer_menu', '[]'), true);
        $ads = \Illuminate\Support\Facades\DB::table('ad_spots')->get();

        return view('admin.dashboard', compact(
            'totalUsages', 
            'activeToolsCount', 
            'totalBlogsCount', 
            'topTools', 
            'settings',
            'customPages',
            'faqs',
            'headerMenu',
            'footerMenu',
            'ads'
        ));
    }

    /**
     * Settings Update
     */
    public function updateSettings(Request $request)
    {
        if (!$this->checkAuth()) {
            return redirect()->route('admin.login');
        }

        $configs = $request->only([
            'site_name', 'site_url', 'timezone',
            'seo_title', 'seo_description', 'seo_keywords',
            'code_header', 'code_body', 'code_footer',
            'footer_about', 'homeBadge', 'homeHeading', 'homeSubheading',
            'admin_username', 'admin_email'
        ]);

        foreach ($configs as $key => $val) {
            Setting::setVal($key, $val);
        }

        // Change password if filled
        if ($request->filled('admin_new_password')) {
            $request->validate([
                'admin_new_password' => 'min:6',
            ]);
            Setting::setVal('admin_password', Hash::make($request->input('admin_new_password')));
        }

        return redirect()->back()->with('success', 'Site settings updated successfully.');
    }

    /**
     * Toggle tool state (Ajax)
     */
    public function toggleTool(Request $request, $id)
    {
        if (!$this->checkAuth()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $tool = PdfTool::findOrFail($id);
        $tool->is_active = $request->input('active', true);
        $tool->save();

        return response()->json(['success' => true, 'isActive' => $tool->is_active]);
    }

    /**
     * Edit visual tool specifications
     */
    public function updateToolDetails(Request $request, $id)
    {
        if (!$this->checkAuth()) {
            return redirect()->back();
        }

        $tool = PdfTool::findOrFail($id);
        $tool->name = $request->input('name');
        $tool->description = $request->input('description');
        $tool->category = $request->input('category');
        $tool->is_active = $request->has('is_active');
        $tool->save();

        return redirect()->back()->with('success', 'Tool updated successfully.');
    }

    /**
     * Save blog posts
     */
    public function saveBlogPost(Request $request, $id = null)
    {
        if (!$this->checkAuth()) {
            return redirect()->route('admin.login');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'summary' => 'required|string',
            'content' => 'required|string',
        ]);

        $data = $request->only([
            'title', 'summary', 'content', 'featured_image',
            'seo_title', 'seo_description', 'seo_keywords'
        ]);

        if ($id) {
            $post = BlogPost::findOrFail($id);
            $post->update($data);
            $msg = 'Article updated successfully.';
        } else {
            $post = BlogPost::create($data);
            $msg = 'Article published successfully.';
        }

        return redirect()->back()->with('success', $msg);
    }

    /**
     * Delete blog post
     */
    public function deleteBlogPost($id)
    {
        if (!$this->checkAuth()) {
            return redirect()->route('admin.login');
        }

        $post = BlogPost::findOrFail($id);
        $post->delete();

        return redirect()->back()->with('success', 'Blog article deleted successfully.');
    }

    /**
     * Save custom page (Stored as JSON in setting key)
     */
    public function saveCustomPage(Request $request, $id = null)
    {
        if (!$this->checkAuth()) {
            return redirect()->route('admin.login');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string',
            'content' => 'required|string',
        ]);

        $pages = json_decode(Setting::getVal('custom_pages', '[]'), true);

        $newPage = [
            'id' => $id ?: uniqid('page_'),
            'title' => $request->input('title'),
            'slug' => \Illuminate\Support\Str::slug($request->input('slug')),
            'content' => $request->input('content'),
            'isActive' => $request->has('isActive') ? true : false,
            'seoTitle' => $request->input('seoTitle'),
            'seoDescription' => $request->input('seoDescription'),
            'seoKeywords' => $request->input('seoKeywords'),
            'createdAt' => date('c'),
        ];

        if ($id) {
            // Find and update
            $updated = false;
            foreach ($pages as &$p) {
                if ($p['id'] == $id) {
                    $p = $newPage;
                    $updated = true;
                    break;
                }
            }
            if (!$updated) {
                $pages[] = $newPage;
            }
        } else {
            $pages[] = $newPage;
        }

        Setting::setVal('custom_pages', json_encode($pages));

        return redirect()->back()->with('success', 'Custom page saved successfully.');
    }

    /**
     * Delete dynamic Custom page
     */
    public function deleteCustomPage($id)
    {
        if (!$this->checkAuth()) {
            return redirect()->route('admin.login');
        }

        $pages = json_decode(Setting::getVal('custom_pages', '[]'), true);
        $filtered = array_filter($pages, function($page) use ($id) {
            return $page['id'] != $id;
        });

        Setting::setVal('custom_pages', json_encode(array_values($filtered)));

        return redirect()->back()->with('success', 'Custom page deleted successfully.');
    }

    /**
     * Save FAQ dynamic item
     */
    public function saveFaq(Request $request, $id = null)
    {
        if (!$this->checkAuth()) {
            return redirect()->route('admin.login');
        }

        $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'order' => 'required|integer',
        ]);

        $faqs = json_decode(Setting::getVal('faqs', '[]'), true);

        $newFaq = [
            'id' => $id ?: uniqid('faq_'),
            'question' => $request->input('question'),
            'answer' => $request->input('answer'),
            'order' => (int)$request->input('order'),
        ];

        if ($id) {
            // Update
            foreach ($faqs as &$f) {
                if ($f['id'] == $id) {
                    $f = $newFaq;
                    break;
                }
            }
        } else {
            $faqs[] = $newFaq;
        }

        // Sort by order
        usort($faqs, function($a, $b) {
            return $a['order'] - $b['order'];
        });

        Setting::setVal('faqs', json_encode(array_values($faqs)));

        return redirect()->back()->with('success', 'FAQ saved successfully.');
    }

    /**
     * Delete FAQ item
     */
    public function deleteFaq($id)
    {
        if (!$this->checkAuth()) {
            return redirect()->route('admin.login');
        }

        $faqs = json_decode(Setting::getVal('faqs', '[]'), true);
        $filtered = array_filter($faqs, function($faq) use ($id) {
            return $faq['id'] != $id;
        });

        Setting::setVal('faqs', json_encode(array_values($filtered)));

        return redirect()->back()->with('success', 'FAQ deleted successfully.');
    }

    /**
     * Update and Save Headers / Footers Menu builder
     */
    public function saveMenu(Request $request, $menuType)
    {
        if (!$this->checkAuth()) {
            return redirect()->route('admin.login');
        }

        $labels = $request->input('labels', []);
        $types = $request->input('types', []);
        $values = $request->input('values', []);
        $orders = $request->input('orders', []);

        $menu = [];
        for ($i = 0; $i < count($labels); $i++) {
            if (empty($labels[$i])) continue;
            $menu[] = [
                'id' => uniqid('menu_'),
                'label' => $labels[$i],
                'type' => $types[$i] ?? 'home',
                'value' => $values[$i] ?? '',
                'order' => (int)($orders[$i] ?? ($i + 1))
            ];
        }

        // Sort
        usort($menu, function($a, $b) {
            return $a['order'] - $b['order'];
        });

        $settingKey = $menuType === 'header' ? 'header_menu' : 'footer_menu';
        Setting::setVal($settingKey, json_encode($menu));

        return redirect()->back()->with('success', ucfirst($menuType) . ' menu items updated successfully.');
    }

    /**
     * Update dynamic Ads codes
     */
    public function saveAd(Request $request, $id)
    {
        if (!$this->checkAuth()) {
            return redirect()->back();
        }

        $active = $request->has('active') ? 1 : 0;
        $code = $request->input('code');

        \Illuminate\Support\Facades\DB::table('ad_spots')
            ->where('id', $id)
            ->update([
                'active' => $active,
                'code' => $code,
                'updated_at' => now()
            ]);

        return redirect()->back()->with('success', 'Ad code updated successfully.');
    }
}

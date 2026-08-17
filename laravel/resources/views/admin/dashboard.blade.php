@extends('layouts.app')

@section('title', 'Admin Dashboard Workspace | PDFProTools')

@section('content')

<div class="bg-slate-950 text-white py-12 border-b border-slate-900 overflow-hidden relative">
    <div class="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
    
    <div class="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div class="space-y-1.5">
            <span class="text-[9px] uppercase tracking-widest font-bold text-blue-400 font-mono">Control Desk Workspace</span>
            <h1 class="text-3xl font-extrabold tracking-tight">System Management</h1>
            <p class="text-xs text-slate-400 max-w-lg">Modify landing tags, change layouts, manage blogs, edit 16 custom ad slots, build pages or restructure menus.</p>
        </div>

        <div class="flex items-center space-x-3">
            <form action="{{ route('admin.logout') }}" method="POST">
                @csrf
                <button type="submit" class="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center space-x-2">
                    <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                </button>
            </form>
        </div>
    </div>
</div>

<div class="max-w-7xl mx-auto px-6 sm:px-8 py-12">
    
    <!-- Success / Error Notifications alerts -->
    @if(session('success'))
        <div class="bg-emerald-550 text-white rounded-2xl p-5 text-xs font-bold shadow-md mb-8 flex items-center space-x-3">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ session('success') }}</span>
        </div>
    @endif

    <!-- Core Statistics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-2">
            <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Accumulated Usages</span>
            <p class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ number_format($totalUsages) }}</p>
            <p class="text-[10px] text-emerald-600 font-semibold">&uarr; Continuous active simulation logs</p>
        </div>
        <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-2">
            <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Active PDF Tools</span>
            <p class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ $activeToolsCount }}</p>
            <p class="text-[10px] text-slate-450 font-semibold">Toggles adjustable in real-time</p>
        </div>
        <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-2">
            <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Published Blogs</span>
            <p class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ $totalBlogsCount }}</p>
            <p class="text-[10px] text-blue-600 font-semibold">Self-contained responsive guides</p>
        </div>
    </div>

    <!-- Layout: Tabbed Left Menu and Content Panel -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Left Tab Selection Rails -->
        <div class="lg:col-span-1 space-y-2">
            @php
                $tabs = [
                    'general' => 'General Settings',
                    'tools' => 'Manage PDF Tools',
                    'seo' => 'SEO Configuration',
                    'ads' => 'Ad Placements',
                    'blogs' => 'Blog System',
                    'pages' => 'Custom Pages',
                    'menus' => 'Menu Builder',
                    'faqs' => 'FAQ Management'
                ];
            @endphp
            @foreach($tabs as $key => $title)
                <button 
                    type="button" 
                    id="tab-btn-{{ $key }}" 
                    class="w-full text-left px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer admin-tab-btn border @if($loop->first) bg-blue-600 text-white border-blue-600 shadow-sm @else bg-white hover:bg-slate-100 text-slate-600 border-transparent @endif"
                    onclick="switchTab('{{ $key }}')"
                >
                    {{ $title }}
                </button>
            @endforeach
        </div>

        <!-- Right Content Forms panels -->
        <div class="lg:col-span-3">
            
            <!-- ----------------------------------------- -->
            <!-- TAB 1: GENERAL SETTINGS -->
            <!-- ----------------------------------------- -->
            <div id="tab-panel-general" class="admin-tab-panel bg-white border border-slate-100 p-8 rounded-3xl shadow-xs space-y-6">
                <div class="border-b border-slate-100 pb-4">
                    <h3 class="font-bold text-base text-slate-900">General Suite System Configurations</h3>
                    <p class="text-xs text-slate-450">Change basic headers, default landing text styles, or change the admin password.</p>
                </div>

                <form action="{{ route('admin.settings.update') }}" method="POST" class="space-y-6">
                    @csrf
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Site Product Name</label>
                            <input type="text" name="site_name" value="{{ $settings['site_name'] }}" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-blue-650 font-bold" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Site Root URL</label>
                            <input type="text" name="site_url" value="{{ $settings['site_url'] }}" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-blue-650 font-mono" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Timezone</label>
                            <input type="text" name="timezone" value="{{ $settings['timezone'] }}" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-blue-650 font-semibold" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Admin Username</label>
                            <input type="text" name="admin_username" value="{{ $settings['admin_username'] }}" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-blue-650 font-semibold" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Admin Email Address</label>
                            <input type="email" name="admin_email" value="{{ $settings['admin_email'] }}" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-blue-650 font-semibold" />
                        </div>
                    </div>

                    <div class="space-y-4 pt-4 border-t border-slate-50">
                        <h4 class="font-bold text-xs uppercase tracking-wider text-slate-400">Homepage Styling</h4>
                        
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Hero Badge Pill Text</label>
                            <input type="text" name="homeBadge" value="{{ $settings['homeBadge'] }}" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-blue-650" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Hero Heading Title (HTML Supported)</label>
                            <input type="text" name="homeHeading" value="{{ $settings['homeHeading'] }}" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-blue-650 font-bold" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Hero Subheading description</label>
                            <textarea name="homeSubheading" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 focus:outline-none focus:border-blue-650 resize-none leading-relaxed">{{ $settings['homeSubheading'] }}</textarea>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">About us Footer paragraph (Foot Pitch)</label>
                            <textarea name="footer_about" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 focus:outline-none focus:border-blue-650 resize-none leading-relaxed">{{ $settings['footer_about'] }}</textarea>
                        </div>
                    </div>

                    <div class="space-y-4 pt-4 border-t border-slate-50">
                        <h4 class="font-bold text-xs uppercase tracking-wider text-slate-400">Change Admin Access Passcode</h4>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">New Admin password</label>
                            <input type="password" name="admin_new_password" placeholder="Leave blank to keep existing password passcode" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none" />
                        </div>
                    </div>

                    <div class="space-y-4 pt-4 border-t border-slate-50">
                        <h4 class="font-bold text-xs uppercase tracking-wider text-slate-400">Third-Party Custom Analytic Codes / Trackers Injectors</h4>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Custom Head HTML Code (e.g. AdSense tags, CSS/fonts link)</label>
                            <textarea name="code_header" rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-650 resize-none">{{ $settings['code_header'] }}</textarea>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Custom Body HTML Code (Injected below Body starts)</label>
                            <textarea name="code_body" rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-650 resize-none">{{ $settings['code_body'] }}</textarea>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Custom Footer Script HTML Code (Injected before body closes)</label>
                            <textarea name="code_footer" rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-650 resize-none">{{ $settings['code_footer'] }}</textarea>
                        </div>
                    </div>

                    <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer text-center">
                        Save System Settings
                    </button>
                </form>
            </div>

            <!-- ----------------------------------------- -->
            <!-- TAB 2: MANAGE PDF TOOLS -->
            <!-- ----------------------------------------- -->
            <div id="tab-panel-tools" class="admin-tab-panel hidden bg-white border border-slate-100 p-8 rounded-3xl shadow-xs space-y-6">
                <div class="border-b border-slate-100 pb-4">
                    <h3 class="font-bold text-base text-slate-900">Manage PDF Toolbox Toggles</h3>
                    <p class="text-xs text-slate-450">Disable unneeded tools or edit descriptions and categorize them dynamically.</p>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr class="bg-slate-50 uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-100">
                                <th class="p-4">Tool ID / Name</th>
                                <th class="p-4">Category</th>
                                <th class="p-4">Usages</th>
                                <th class="p-4 text-center">Active Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50 font-medium">
                            @foreach($topTools as $tool)
                                <tr class="hover:bg-slate-50/40">
                                    <td class="p-4">
                                        <p class="font-bold text-slate-800">{{ $tool->name }}</p>
                                        <p class="text-[10px] text-slate-400 font-mono">{{ $tool->tool_id }}</p>
                                    </td>
                                    <td class="p-4 uppercase text-slate-450 font-bold tracking-widest text-[9px]">
                                        {{ $tool->category }}
                                    </td>
                                    <td class="p-4 font-mono font-bold text-slate-600">
                                        {{ number_format($tool->usages_count) }}
                                    </td>
                                    <td class="p-4 text-center">
                                        <!-- Active toggle dynamic Form -->
                                        <button 
                                            type="button" 
                                            class="px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border transition cursor-pointer"
                                            id="tool-toggle-{{ $tool->id }}"
                                            onclick="toggleToolState('{{ $tool->id }}')"
                                        >
                                            <span id="tool-span-{{ $tool->id }}" class="{{ $tool->is_active ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-rose-600 border-rose-100 bg-rose-50' }}">
                                                {{ $tool->is_active ? 'Active' : 'Disabled' }}
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ----------------------------------------- -->
            <!-- TAB 3: SEO CONFIGURATIONS -->
            <!-- ----------------------------------------- -->
            <div id="tab-panel-seo" class="admin-tab-panel hidden bg-white border border-slate-100 p-8 rounded-3xl shadow-xs space-y-6">
                <div class="border-b border-slate-100 pb-4">
                    <h3 class="font-bold text-base text-slate-900">SEO Meta Configuration</h3>
                    <p class="text-xs text-slate-450">Set search-engine definitions, page title guidelines, or default meta descriptions.</p>
                </div>

                <form action="{{ route('admin.settings.update') }}" method="POST" class="space-y-4">
                    @csrf
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Default Site SEO Title</label>
                        <input type="text" name="seo_title" value="{{ $settings['seo_title'] }}" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-bold" />
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Meta Search Keywords (Comma split list)</label>
                        <textarea name="seo_keywords" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 focus:outline-none resize-none leading-relaxed">{{ $settings['seo_keywords'] }}</textarea>
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Meta Search Description</label>
                        <textarea name="seo_description" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 focus:outline-none resize-none leading-relaxed">{{ $settings['seo_description'] }}</textarea>
                    </div>

                    <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer">
                        Save SEO Configuration
                    </button>
                </form>
            </div>

            <!-- ----------------------------------------- -->
            <!-- TAB 4: AD SYSTEM (16 PLACEMENTS) -->
            <!-- ----------------------------------------- -->
            <div id="tab-panel-ads" class="admin-tab-panel hidden bg-white border border-slate-100 p-8 rounded-3xl shadow-xs space-y-6">
                <div class="border-b border-slate-100 pb-4">
                    <h3 class="font-bold text-base text-slate-900">System Ad placements</h3>
                    <p class="text-xs text-slate-450">Paste Adsense tags, custom banner blocks, or partner affiliate links across 16 layout segments.</p>
                </div>

                <div class="space-y-6">
                    @foreach($ads as $ad)
                        <div class="border border-slate-150 p-6 rounded-2xl space-y-4">
                            <div class="flex justify-between items-center">
                                <h4 class="font-bold text-xs text-slate-800 capitalize">{{ $ad->name }}</h4>
                                <span class="text-[10px] font-mono text-slate-400 uppercase font-bold">{{ $ad->spot_key }}</span>
                            </div>

                            <form action="{{ route('admin.ads.save', $ad->id) }}" method="POST" class="space-y-3">
                                @csrf
                                <div class="space-y-1.5">
                                    <label class="text-[9px] font-bold uppercase tracking-wider text-slate-400">Ad HTML Code Block / Script Tag</label>
                                    <textarea name="code" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] font-mono text-slate-600 resize-none">{{ $ad->code }}</textarea>
                                </div>
                                <div class="flex items-center justify-between">
                                    <label class="flex items-center space-x-2 text-xs font-semibold text-slate-600 cursor-pointer">
                                        <input type="checkbox" name="active" value="1" {{ $ad->active ? 'checked' : '' }} class="rounded border-slate-350 text-blue-600 focus:ring-blue-500" />
                                        <span>Show this ad widget alive</span>
                                    </label>
                                    <button type="submit" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-extrabold transition cursor-pointer">
                                        Save Spot
                                    </button>
                                </div>
                            </form>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- ----------------------------------------- -->
            <!-- TAB 5: BLOG SYSTEM -->
            <!-- ----------------------------------------- -->
            <div id="tab-panel-blogs" class="admin-tab-panel hidden bg-white border border-slate-100 p-8 rounded-3xl shadow-xs space-y-8">
                <div class="border-b border-slate-100 pb-4 flex justify-between items-end">
                    <div>
                        <h2 class="font-bold text-base text-slate-900">Knowledge Hub Draft Desk</h2>
                        <p class="text-xs text-slate-450">Compose guides, compliance recommendations or sign tutorials easily.</p>
                    </div>
                </div>

                <!-- Part 1: Draft new segment -->
                <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Create or Edit Article</span>
                    <form action="{{ route('admin.blogs.save') }}" method="POST" class="space-y-4">
                        @csrf
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Draft Title</label>
                            <input type="text" name="title" required placeholder="e.g. Workflows to signing documents legally" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Excerpt Summary description</label>
                            <input type="text" name="summary" required placeholder="Short summary displayed on list page grid" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Featured Photo Link (Unsplash url)</label>
                            <input type="text" name="featured_image" placeholder="https://images.unsplash.com/photo-..." class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rich Body Content Text (HTML and Markdown structures supported)</label>
                            <textarea name="content" required rows="6" class="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs focus:outline-none resize-none" placeholder="Compose article here..."></textarea>
                        </div>
                        
                        <button type="submit" class="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer">
                            Publish Article Live
                        </button>
                    </form>
                </div>
            </div>

            <!-- ----------------------------------------- -->
            <!-- TAB 6: CUSTOM PAGES -->
            <!-- ----------------------------------------- -->
            <div id="tab-panel-pages" class="admin-tab-panel hidden bg-white border border-slate-100 p-8 rounded-3xl shadow-xs space-y-6">
                <div class="border-b border-slate-100 pb-4">
                    <h3 class="font-bold text-base text-slate-900">Custom dynamic pages</h3>
                    <p class="text-xs text-slate-450">Edit Terms of Service, Privacy Policies, Cookie Rules, or contact guidelines.</p>
                </div>

                <!-- List existing pages with Delete hooks -->
                <div class="space-y-3">
                    @foreach($customPages as $p)
                        <div class="flex justify-between items-center bg-slate-50 p-4 border border-slate-100 rounded-xl text-xs">
                            <div>
                                <p class="font-bold text-slate-800">{{ $p['title'] }}</p>
                                <p class="text-[10px] text-slate-400 font-mono">Slug: /page/{{ $p['slug'] }}</p>
                            </div>
                            <form action="{{ route('admin.pages.delete', $p['id']) }}" method="POST">
                                @csrf
                                <button type="submit" class="p-2 border border-rose-100 rounded-lg hover:bg-rose-50 text-rose-500 cursor-pointer">
                                    Remove Page
                                </button>
                            </form>
                        </div>
                    @endforeach
                </div>

                <!-- Create page form -->
                <div class="border-t border-slate-100 pt-6 space-y-4">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Create Page</span>
                    <form action="{{ route('admin.pages.save') }}" method="POST" class="space-y-4">
                        @csrf
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Page display title</label>
                                <input type="text" name="title" required placeholder="e.g. Cookie Policy" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none" />
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Slug path code (Unique)</label>
                                <input type="text" name="slug" required placeholder="e.g. cookie-policy" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none" />
                            </div>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Page Document texts (NL2BR HTML layout)</label>
                            <textarea name="content" required rows="6" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs focus:outline-none resize-none" placeholder="Draft text here..."></textarea>
                        </div>
                        
                        <button type="submit" class="px-6 py-3.5 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl text-xs transition cursor-pointer">
                            Compile New Custom Page
                        </button>
                    </form>
                </div>
            </div>

            <!-- ----------------------------------------- -->
            <!-- TAB 7: MENU BUILDER -->
            <!-- ----------------------------------------- -->
            <div id="tab-panel-menus" class="admin-tab-panel hidden bg-white border border-slate-100 p-8 rounded-3xl shadow-xs space-y-6">
                <div class="border-b border-slate-100 pb-4">
                    <h3 class="font-bold text-base text-slate-900">Header & Footer Menu Builder</h3>
                    <p class="text-xs text-slate-450">Construct link menus dynamically. Placeholders supported.</p>
                </div>

                <!-- Header Menu config list -->
                <div class="space-y-4 border-b border-slate-100 pb-6">
                    <h4 class="font-bold text-xs uppercase tracking-widest text-[#94a3b8] font-mono">Header Navigation builder</h4>
                    
                    <form action="{{ route('admin.menus.save', 'header') }}" method="POST" class="space-y-3">
                        @csrf
                        @if(isset($headerMenu))
                            @foreach($headerMenu as $idx => $m)
                                <div class="grid grid-cols-4 gap-4 items-center">
                                    <input type="text" name="labels[]" value="{{ $m['label'] }}" placeholder="Label" class="bg-slate-50 border text-xs px-3 py-2 rounded-lg" />
                                    <select name="types[]" class="bg-slate-50 border text-xs px-3 py-2 rounded-lg">
                                        <option value="home" {{ $m['type'] === 'home' ? 'selected' : '' }}>Home Page</option>
                                        <option value="blog" {{ $m['type'] === 'blog' ? 'selected' : '' }}>Blog Hub</option>
                                        <option value="page" {{ $m['type'] === 'page' ? 'selected' : '' }}>Custom Page Slug</option>
                                    </select>
                                    <input type="text" name="values[]" value="{{ $m['value'] ?? '' }}" placeholder="value/slug" class="bg-slate-50 border text-xs px-3 py-2 rounded-lg" />
                                    <input type="number" name="orders[]" value="{{ $m['order'] }}" class="bg-slate-50 border text-xs px-3 py-2 rounded-lg" />
                                </div>
                            @endforeach
                        @endif
                        <button type="submit" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer">
                            Save Header menu layout
                        </button>
                    </form>
                </div>

                <!-- Footer Menu Config list -->
                <div class="space-y-4">
                    <h4 class="font-bold text-xs uppercase tracking-widest text-[#94a3b8] font-mono">Footer Navigation builder</h4>
                    
                    <form action="{{ route('admin.menus.save', 'footer') }}" method="POST" class="space-y-3">
                        @csrf
                        @if(isset($footerMenu))
                            @foreach($footerMenu as $idx => $m)
                                <div class="grid grid-cols-4 gap-4 items-center">
                                    <input type="text" name="labels[]" value="{{ $m['label'] }}" placeholder="Label" class="bg-slate-50 border text-xs px-3 py-2 rounded-lg" />
                                    <select name="types[]" class="bg-slate-50 border text-xs px-3 py-2 rounded-lg">
                                        <option value="home" {{ $m['type'] === 'home' ? 'selected' : '' }}>Home Page</option>
                                        <option value="blog" {{ $m['type'] === 'blog' ? 'selected' : '' }}>Blog Hub</option>
                                        <option value="page" {{ $m['type'] === 'page' ? 'selected' : '' }}>Custom Page Slug</option>
                                    </select>
                                    <input type="text" name="values[]" value="{{ $m['value'] ?? '' }}" placeholder="value/slug" class="bg-slate-50 border text-xs px-3 py-2 rounded-lg" />
                                    <input type="number" name="orders[]" value="{{ $m['order'] }}" class="bg-slate-50 border text-xs px-3 py-2 rounded-lg" />
                                </div>
                            @endforeach
                        @endif
                        <button type="submit" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer">
                            Save Footer menu layout
                        </button>
                    </form>
                </div>

            </div>

            <!-- ----------------------------------------- -->
            <!-- TAB 8: FAQ CONFIG MANAGEMENT -->
            <!-- ----------------------------------------- -->
            <div id="tab-panel-faqs" class="admin-tab-panel hidden bg-white border border-slate-100 p-8 rounded-3xl shadow-xs space-y-6">
                <div class="border-b border-slate-100 pb-4">
                    <h3 class="font-bold text-base text-slate-900">FAQ Management Center</h3>
                    <p class="text-xs text-slate-450">Draft common Q&A items, specify order offsets, or prune lists.</p>
                </div>

                <!-- Loop existing FAQs with remove forms -->
                <div class="space-y-3">
                    @foreach($faqs as $faq)
                        <div class="flex justify-between items-center bg-slate-50 p-4 border border-slate-100 rounded-xl text-xs">
                            <div>
                                <p class="font-bold text-slate-800">{{ $faq['question'] }}</p>
                                <p class="text-[10px] text-slate-400 font-medium">Order Rank Offset: {{ $faq['order'] }}</p>
                            </div>
                            <form action="{{ route('admin.faqs.delete', $faq['id']) }}" method="POST">
                                @csrf
                                <button type="submit" class="p-2 border border-rose-100 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer">
                                    Prune FAQ
                                </button>
                            </form>
                        </div>
                    @endforeach
                </div>

                <!-- Create FAQ form block -->
                <div class="border-t border-slate-100 pt-6 space-y-4">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Create FAQ Accordion block</span>
                    <form action="{{ route('admin.faqs.save') }}" method="POST" class="space-y-4">
                        @csrf
                        <div class="grid grid-cols-4 gap-4">
                            <div class="col-span-3 space-y-1.5">
                                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ask Question</label>
                                <input type="text" name="question" required placeholder="How secure is raw document processing?" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none" />
                            </div>
                            <div class="col-span-1 space-y-1.5">
                                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Order Offset</label>
                                <input type="number" name="order" value="1" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none" />
                            </div>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Answer Explanation Text</label>
                            <textarea name="answer" required rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs focus:outline-none resize-none" placeholder="Explanation..."></textarea>
                        </div>
                        
                        <button type="submit" class="px-5 py-3 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl text-xs transition cursor-pointer">
                            Compile FAQ Accordion block
                        </button>
                    </form>
                </div>
            </div>

        </div>

    </div>

</div>

<script>
    // Tab selector mechanisms
    function switchTab(activeKey) {
        // Hide all panels
        document.querySelectorAll('.admin-tab-panel').forEach(panel => {
            panel.classList.add('hidden');
        });
        
        // Remove active class from buttons
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.add('bg-white', 'text-slate-600', 'border-transparent');
            btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600', 'shadow-sm');
        });

        // Show selected panel
        const activePanel = document.getElementById('tab-panel-' + activeKey);
        if (activePanel) {
            activePanel.classList.remove('hidden');
        }

        // Apply active class to selected button
        const activeBtn = document.getElementById('tab-btn-' + activeKey);
        if (activeBtn) {
            activeBtn.classList.remove('bg-white', 'text-slate-600', 'border-transparent');
            activeBtn.classList.add('bg-blue-600', 'text-white', 'border-blue-600', 'shadow-sm');
        }
    }

    // Ajax tool state toggle functions
    function toggleToolState(toolId) {
        const toggleBtn = document.getElementById('tool-toggle-' + toolId);
        const span = document.getElementById('tool-span-' + toolId);
        const isActive = span.classList.contains('text-emerald-600');
        const nextState = !isActive;

        fetch('/admin/tools/' + toolId + '/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ active: nextState })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (data.isActive) {
                    span.innerText = 'Active';
                    span.className = 'text-emerald-600 border-emerald-100 bg-emerald-50';
                } else {
                    span.innerText = 'Disabled';
                    span.className = 'text-rose-600 border-rose-100 bg-rose-50';
                }
            }
        })
        .catch(err => {
            console.error("Failed to toggle tool status node:", err);
        });
    }
</script>

@endsection

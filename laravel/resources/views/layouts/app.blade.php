<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', $seo['title'] ?? 'PDFProTools')</title>
    <meta name="description" content="@yield('description', $seo['description'] ?? '')">
    <meta name="keywords" content="@yield('keywords', $seo['keywords'] ?? '')">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>

    <!-- Custom Injected Head Code via Admin -->
    {!! \App\Models\Setting::getVal('code_header', '') !!}
</head>
<body class="bg-slate-50 flex flex-col min-h-screen text-slate-800">

    <!-- Header navigation bar -->
    <header class="sticky top-0 z-50 bg-white/95 border-b border-slate-100 shadow-xs backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-6 sm:px-8">
            <div class="flex justify-between items-center h-20">
                
                <a href="{{ route('home') }}" class="flex items-center space-x-3">
                    <div class="bg-blue-600 text-white p-2.5 rounded-2xl shadow-sm hover:scale-105 transition-all">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span class="font-extrabold text-2xl text-slate-900 tracking-tight">{{ $siteName }}</span>
                </a>

                <!-- Header navigation items -->
                <nav class="hidden md:flex items-center space-x-6">
                    @if(isset($headerMenu))
                        @foreach($headerMenu as $item)
                            @php
                                $url = '#';
                                if ($item['type'] === 'home') $url = route('home');
                                elseif ($item['type'] === 'blog') $url = route('blog.index');
                                elseif ($item['type'] === 'page') $url = route('page.show', $item['value']);
                            @endphp
                            <a href="{{ $url }}" class="text-xs font-bold uppercase tracking-wider text-slate-650 hover:text-blue-600 transition-colors">{{ $item['label'] }}</a>
                        @endforeach
                    @endif
                    
                    @if(Session::get('admin_logged_in') === true)
                        <a href="{{ route('admin.dashboard') }}" class="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2">
                            <span>Admin Workspace</span>
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </a>
                    @else
                        <a href="{{ route('admin.login') }}" class="px-4.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-750 hover:text-white bg-slate-100 hover:bg-blue-600 border border-slate-200/80 hover:border-blue-600 rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer">
                            <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            <span>Admin Login</span>
                        </a>
                    @endif
                </nav>

                <!-- Responsive Menu Toggle -->
                <div class="md:hidden flex items-center">
                    <button id="mobile-toggle" class="p-2 text-slate-650 hover:text-slate-900 focus:outline-none">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>

            </div>
        </div>

        <!-- Mobile links tray -->
        <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-100 p-6 space-y-4">
            @if(isset($headerMenu))
                @foreach($headerMenu as $item)
                    @php
                        $url = '#';
                        if ($item['type'] === 'home') $url = route('home');
                        elseif ($item['type'] === 'blog') $url = route('blog.index');
                        elseif ($item['type'] === 'page') $url = route('page.show', $item['value']);
                    @endphp
                    <a href="{{ $url }}" class="block text-xs font-bold uppercase tracking-wider text-slate-650 hover:text-blue-600">{{ $item['label'] }}</a>
                @endforeach
            @endif
            @if(Session::get('admin_logged_in') === true)
                <a href="{{ route('admin.dashboard') }}" class="block text-xs font-bold uppercase tracking-wider text-blue-650">Admin Workspace</a>
            @else
                <a href="{{ route('admin.login') }}" class="block text-xs font-bold uppercase tracking-wider text-slate-750">Admin Login</a>
            @endif
        </div>
    </header>

    <!-- Global Body Inject Display Code -->
    {!! \App\Models\Setting::getVal('code_body', '') !!}

    <!-- Content Slot -->
    <main class="flex-grow">
        @yield('content')
    </main>

    <!-- Footer page bar -->
    <footer class="bg-slate-900 text-slate-400 py-16 border-t border-slate-850">
        <div class="max-w-7xl mx-auto px-6 sm:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                
                <!-- Brand pitch -->
                <div class="col-span-1 md:col-span-2 space-y-4">
                    <span class="font-extrabold text-xl text-white tracking-tight block">{{ $siteName }}</span>
                    <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
                        {{ \App\Models\Setting::getVal('footer_about', 'The premier online suite built for maximum optimization. Merge, compress, convert, sign, and redact documents globally. 100% cloud secure.') }}
                    </p>
                    <p class="text-[11px] text-slate-550 leading-relaxed max-w-sm">
                        All files are transferred utilizing optimized TLS encrypted links. Uploaded data is processed server-side in sandbox environments and auto-deleted within 15 minutes of completion.
                    </p>
                </div>

                <!-- Footer Menu Pages -->
                <div class="space-y-4">
                    <span class="text-[10px] font-bold text-slate-350 uppercase tracking-widest block">Useful Connections</span>
                    <ul class="text-xs space-y-2.5">
                        @if(isset($footerMenu))
                            @foreach($footerMenu as $item)
                                @php
                                    $url = '#';
                                    if ($item['type'] === 'home') $url = route('home');
                                    elseif ($item['type'] === 'blog') $url = route('blog.index');
                                    elseif ($item['type'] === 'page') $url = route('page.show', $item['value']);
                                @endphp
                                <li>
                                    <a href="{{ $url }}" class="hover:text-white transition-colors">{{ $item['label'] }}</a>
                                </li>
                            @endforeach
                        @endif
                    </ul>
                </div>

                <!-- Live status indicators -->
                <div class="space-y-4">
                    <span class="text-[10px] font-bold text-slate-350 uppercase tracking-widest block font-mono">Service Status</span>
                    <div class="space-y-3">
                        <div class="flex items-center space-x-2 text-xs">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span class="text-slate-200 font-semibold font-sans">Core Nodes Active</span>
                        </div>
                        <p class="text-[11px] text-slate-450 leading-relaxed">
                            Continuous data health check. Processing queues operate with 0ms backlog.
                        </p>
                    </div>
                </div>

            </div>

            <div class="pt-8 border-t border-slate-800 text-center text-[11px] text-slate-550 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p>&copy; {{ date('Y') }} {{ $siteName }}. All rights reserved.</p>
                <div class="flex space-x-4">
                    <a href="{{ route('home') }}" class="hover:text-slate-300">Home</a>
                    <a href="{{ route('blog.index') }}" class="hover:text-slate-300">Blog</a>
                </div>
            </div>
        </div>
    </footer>

    <script>
        // Simple mobile toggle
        const toggleBtn = document.getElementById('mobile-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (toggleBtn && mobileMenu) {
            toggleBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    </script>

    <!-- Injected Foot Code via Admin -->
    {!! \App\Models\Setting::getVal('code_footer', '') !!}
</body>
</html>

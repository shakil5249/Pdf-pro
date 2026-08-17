<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS PDF Suite CMS | Web Installation Assistant</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        code, pre {
            font-family: 'JetBrains Mono', monospace;
        }
    </style>
</head>
<body class="bg-slate-900 text-slate-100 flex items-center justify-center min-h-screen p-4 md:p-8">

    <div class="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl md:grid md:grid-cols-12">
        
        <!-- Left panel - Side promotion or info branding -->
        <div class="p-8 md:col-span-4 bg-gradient-to-br from-red-650 via-rose-600 to-red-500 flex flex-col justify-between text-white relative overflow-hidden">
            <div class="absolute inset-0 bg-slate-900 opacity-10"></div>
            
            <div class="relative z-10 space-y-4">
                <div class="inline-flex p-3 bg-white/20 backdrop-blur rounded-2xl mb-2">
                    <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h1 class="text-xl font-extrabold tracking-tight">SaaS PDF Suite</h1>
                <p class="text-xs text-red-50 font-medium leading-relaxed">
                    Welcome to the 1-click automatic installation system. Connect your server database and build your premium document automation empire in seconds.
                </p>
            </div>

            <div class="relative z-10 pt-12 space-y-4 text-[11px] text-red-100 font-semibold border-t border-white/20 mt-8">
                <div class="flex items-center space-x-2">
                    <div class="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                    <span>Production Readiness Enabled</span>
                </div>
                <div>🔒 Encrypted Storage Links</div>
                <div>⚡ Fast Server-Side Engine</div>
            </div>
        </div>

        <!-- Right panel - Forms & Core checks -->
        <div class="p-8 md:col-span-8 flex flex-col justify-between space-y-6">
            
            <div>
                <div class="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                    <div>
                        <h2 class="text-lg font-bold text-white tracking-tight">System Installation</h2>
                        <p class="text-xs text-slate-400">Initialize host databases, credentials and workspace layouts.</p>
                    </div>
                    <span class="text-[10px] font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">v2.1 Stable</span>
                </div>

                @if(session('error'))
                <div class="p-4 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded-2xl mb-6">
                    ⚠️ <strong>Error during setup:</strong> {{ session('error') }}
                </div>
                @endif

                <!-- Server Requirement Benchmarks -->
                <div class="space-y-3 mb-8">
                    <h3 class="text-xs font-bold text-slate-300 tracking-wider uppercase mb-3">Server Pre-requisite Benchmarks</h3>
                    
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div class="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                            <span class="text-slate-400 font-medium">PHP >= 8.1.0</span>
                            <span class="{{ $requirements['php_version'] ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold' }}">
                                {!! $requirements['php_version'] ? '&#10004;' : '&#10008;' !!}
                            </span>
                        </div>
                        <div class="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                            <span class="text-slate-400 font-medium">PDO MySQL</span>
                            <span class="{{ $requirements['pdo_mysql'] ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold' }}">
                                {!! $requirements['pdo_mysql'] ? '&#10004;' : '&#10008;' !!}
                            </span>
                        </div>
                        <div class="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                            <span class="text-slate-400 font-medium">Mbstring Ext</span>
                            <span class="{{ $requirements['mbstring'] ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold' }}">
                                {!! $requirements['mbstring'] ? '&#10004;' : '&#10008;' !!}
                            </span>
                        </div>
                        <div class="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                            <span class="text-slate-400 font-medium">Fileinfo Ext</span>
                            <span class="{{ $requirements['fileinfo'] ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold' }}">
                                {!! $requirements['fileinfo'] ? '&#10004;' : '&#10008;' !!}
                            </span>
                        </div>
                        <div class="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                            <span class="text-slate-400 font-medium">Storage Write</span>
                            <span class="{{ $requirements['storage_writable'] ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold' }}">
                                {!! $requirements['storage_writable'] ? '&#10004;' : '&#10008;' !!}
                            </span>
                        </div>
                        <div class="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                            <span class="text-slate-400 font-medium">Cache Write</span>
                            <span class="{{ $requirements['cache_writable'] ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold' }}">
                                {!! $requirements['cache_writable'] ? '&#10004;' : '&#10008;' !!}
                            </span>
                        </div>
                    </div>
                </div>

                @if(!$allPassed)
                <div class="bg-amber-950/40 border border-amber-800 p-4 rounded-2xl text-xs text-amber-250 leading-relaxed text-center">
                    ❌ <strong>Permissions block detected:</strong> Your hosting/server does not satisfy the requirements or directories are not writable. Please resolve the markers to continue.
                </div>
                @else

                <!-- Installation form -->
                <form action="{{ url('/install') }}" method="POST" class="space-y-6">
                    @csrf
                    
                    <!-- Section: Database settings -->
                    <div class="space-y-4">
                        <div class="border-b border-slate-800 pb-1 flex items-center space-x-2">
                            <span class="text-xs font-bold text-red-500">1.</span>
                            <span class="text-xs font-bold text-slate-200 uppercase tracking-wider">Database Connection Parameters</span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div class="sm:col-span-2">
                                <label class="text-[10px] font-semibold text-slate-400 block mb-1">MySQL Database Host Address</label>
                                <input type="text" name="db_host" value="{{ old('db_host', '127.0.0.1') }}" required 
                                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
                            </div>
                            <div>
                                <label class="text-[10px] font-semibold text-slate-400 block mb-1">Port</label>
                                <input type="text" name="db_port" value="{{ old('db_port', '3306') }}" required
                                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="text-[10px] font-semibold text-slate-400 block mb-1">Database Name (Schema)</label>
                                <input type="text" name="db_name" value="{{ old('db_name', 'pdfpro_db') }}" required
                                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
                            </div>
                            <div>
                                <label class="text-[10px] font-semibold text-slate-400 block mb-1">User Name</label>
                                <input type="text" name="db_user" value="{{ old('db_user', 'root') }}" required
                                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
                            </div>
                            <div>
                                <label class="text-[10px] font-semibold text-slate-400 block mb-1">User Password</label>
                                <input type="password" name="db_pass" value="{{ old('db_pass') }}"
                                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500" placeholder="Optional">
                            </div>
                        </div>
                    </div>

                    <!-- Section: Brand and site config -->
                    <div class="space-y-4 pt-2">
                        <div class="border-b border-slate-800 pb-1 flex items-center space-x-2">
                            <span class="text-xs font-bold text-red-500">2.</span>
                            <span class="text-xs font-bold text-slate-200 uppercase tracking-wider">Site Brand Configurations</span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="text-[10px] font-semibold text-slate-400 block mb-1">Application Title Name</label>
                                <input type="text" name="app_name" value="{{ old('app_name', 'PDFProTools') }}" required
                                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
                            </div>
                            <div>
                                <label class="text-[10px] font-semibold text-slate-400 block mb-1">Absolute Application URL</label>
                                <input type="url" name="app_url" value="{{ old('app_url', 'http://localhost') }}" required
                                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
                            </div>
                        </div>
                    </div>

                    <!-- Section: Administrator access -->
                    <div class="space-y-4 pt-2">
                        <div class="border-b border-slate-800 pb-1 flex items-center space-x-2">
                            <span class="text-xs font-bold text-red-500">3.</span>
                            <span class="text-xs font-bold text-slate-200 uppercase tracking-wider">Super Administrator Credentials</span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="text-[10px] font-semibold text-slate-400 block mb-1">Admin Username</label>
                                <input type="text" name="admin_username" value="{{ old('admin_username', 'admin') }}" required
                                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
                            </div>
                            <div>
                                <label class="text-[10px] font-semibold text-slate-400 block mb-1">Admin E-mail Address</label>
                                <input type="email" name="admin_email" value="{{ old('admin_email', 'admin@domain.com') }}" required
                                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
                            </div>
                            <div>
                                <label class="text-[10px] font-semibold text-slate-400 block mb-1">Secure Password</label>
                                <input type="password" name="admin_password" required placeholder="Min 6 characters"
                                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
                            </div>
                        </div>
                    </div>

                    <!-- Submit action button -->
                    <div class="pt-4">
                        <button type="submit" 
                            class="w-full bg-gradient-to-r from-red-650 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white text-xs font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer block text-center">
                            Run Dynamic Installer &amp; Generate Cache Database
                        </button>
                    </div>

                </form>
                @endif
            </div>

            <div class="text-center text-[10px] text-slate-500 flex justify-center items-center space-x-1 pl-1">
                <span>PHP SaaS Suite Server setup wizard &bull; Created with maximum precision.</span>
            </div>

        </div>

    </div>

</body>
</html>

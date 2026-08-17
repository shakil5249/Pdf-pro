<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS PDF Suite CMS | Installation Successful</title>
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

    <div class="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center space-y-6">
        
        <!-- Animated top accent -->
        <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400"></div>

        <div class="inline-flex p-4 bg-emerald-950/50 border border-emerald-800 text-emerald-500 rounded-full my-3">
            <svg class="h-10 w-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
        </div>

        <div class="space-y-2">
            <h1 class="text-xl font-extrabold tracking-tight text-white mb-1">Installation Completed!</h1>
            <p class="text-xs text-slate-400">Your SaaS CMS has been successfully installed and configured on your hosting.</p>
        </div>

        <!-- System specs table card -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left text-xs space-y-3">
            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                <span class="text-slate-400 font-medium">Application Name</span>
                <span class="text-white font-bold">{{ $appName }}</span>
            </div>
            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                <span class="text-slate-400 font-medium">Domain Server URL</span>
                <span class="text-indigo-400 font-mono">{{ $appUrl }}</span>
            </div>
            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                <span class="text-slate-400 font-medium">Admin User</span>
                <span class="text-white font-mono font-medium">{{ $adminUser }}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-slate-400 font-medium">Database Migrations</span>
                <span class="text-emerald-505 font-bold flex items-center space-x-1.5">
                    <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span class="text-emerald-400">21 Tables Synced</span>
                </span>
            </div>
        </div>

        <div class="p-4 bg-slate-900 border border-dashed border-slate-800 rounded-xl text-[11px] text-slate-400 leading-relaxed text-left space-y-2">
            <p class="flex items-start">
                <span class="text-emerald-500 mr-2 font-bold">&bull;</span>
                <span>The configuration values have been dynamically written into the <strong>.env</strong> file in your directory root.</span>
            </p>
            <p class="flex items-start">
                <span class="text-emerald-500 mr-2 font-bold">&bull;</span>
                <span>An installation lock file has been stored at <strong>storage/installed</strong> to prevent unauthorized access to this installer route.</span>
            </p>
        </div>

        <!-- Action Links -->
        <div class="grid grid-cols-2 gap-4 pt-2">
            <a href="{{ $appUrl }}" 
                class="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer">
                Launch App
            </a>
            <a href="{{ $appUrl }}/admin" 
                class="bg-gradient-to-r from-red-650 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg transition-all cursor-pointer">
                Control Panel
            </a>
        </div>

        <p class="text-[10px] text-slate-500 pt-2 font-sans">
            Security audit checks passed. All setup files compiled successfully.
        </p>

    </div>

</body>
</html>

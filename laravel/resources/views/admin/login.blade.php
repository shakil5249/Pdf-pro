<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login Panel | PDFProTools</title>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 flex items-center justify-center min-h-screen text-slate-800 font-sans">

    <div class="w-full max-w-md p-6">
        
        <!-- Back connection -->
        <div class="mb-6 text-center">
            <a href="{{ route('home') }}" class="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-750 transition-colors">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Public Homepage</span>
            </a>
        </div>

        <div class="bg-white border border-slate-100 p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden" id="admin-login-card">
            
            <!-- Ambient top decoration accent line -->
            <div class="absolute top-0 left-0 right-0 h-1.5 bg-blue-600"></div>

            <div class="text-center space-y-2">
                <div class="bg-blue-50 text-blue-600 p-3.5 rounded-2xl inline-block shadow-sm">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h1>
                <p class="text-xs text-slate-400 font-medium">Input credentials to verify workspace permissions</p>
            </div>

            <!-- Validation and Auth Alerts -->
            @if(session('error'))
                <div class="bg-red-50 border border-red-100 text-red-650 rounded-2xl p-4 text-xs font-bold shadow-xs">
                    ⚠️ {{ session('error') }}
                </div>
            @endif

            @if(session('success'))
                <div class="bg-emerald-50 border border-emerald-100 text-emerald-650 rounded-2xl p-4 text-xs font-bold shadow-xs">
                    🎉 {{ session('success') }}
                </div>
            @endif

            @if($errors->any())
                <div class="bg-red-50 border border-red-100 text-red-650 rounded-2xl p-4 text-xs font-bold shadow-xs space-y-1">
                    @foreach($errors->all() as $error)
                        <p>• {{ $error }}</p>
                    @endforeach
                </div>
            @endif

            <!-- Main Authorization Form -->
            <form action="{{ route('admin.login.submit') }}" method="POST" class="space-y-4">
                @csrf
                
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-450">Username or Email</label>
                    <input 
                        type="text" 
                        name="username" 
                        required 
                        value="{{ old('username') }}"
                        placeholder="e.g. administrator" 
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition font-semibold"
                    />
                </div>

                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-450">Security Key Passcode</label>
                    <!-- Input with toggle show/hide -->
                    <div class="relative">
                        <input 
                            type="password" 
                            name="password" 
                            id="login-password-field"
                            required 
                            placeholder="Enter system passcode" 
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition font-semibold"
                        />
                        <button 
                            type="button" 
                            id="password-toggle-btn"
                            class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer focus:outline-none"
                        >
                            <!-- Eye Icon -->
                            <svg class="h-5 w-5 block" id="eye-open-path" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <!-- Eye Closed Icon -->
                            <svg class="h-5 w-5 hidden" id="eye-closed-path" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 5.656m1.102-4.102m1.102-1.102L3 3m18 18l-3-3m-1-1l-5-5M6.612 6.612A9 9 0 001.5 12c1.274 4.057 5.064 7 9.542 7 1.258 0 2.457-.224 3.561-.63m3.387-3.387A9 9 0 0021.5 12c-1.274-4.057-5.064-7-9.542-7-1.258 0-2.457.224-3.561.63" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-2">
                    <label class="flex items-center space-x-2 text-xs text-slate-500 cursor-pointer">
                        <input type="checkbox" name="remember" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <span>Stay signed in for 30 days</span>
                    </label>
                </div>

                <button 
                    type="submit" 
                    id="submit-login-btn"
                    class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.01] flex items-center justify-center space-x-2"
                >
                    <span>Login</span>
                </button>

            </form>

        </div>
    </div>

    <!-- Active password toggle handler -->
    <script>
        const passwordField = document.getElementById('login-password-field');
        const toggleButton = document.getElementById('password-toggle-btn');
        const eyeOpen = document.getElementById('eye-open-path');
        const eyeClosed = document.getElementById('eye-closed-path');

        if (toggleButton && passwordField) {
            toggleButton.addEventListener('click', () => {
                if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    eyeOpen.classList.add('hidden');
                    eyeClosed.classList.remove('hidden');
                } else {
                    passwordField.type = 'password';
                    eyeOpen.classList.remove('hidden');
                    eyeClosed.classList.add('hidden');
                }
            });
        }
    </script>
</body>
</html>

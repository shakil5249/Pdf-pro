@extends('layouts.app')

@section('title', $seo['title'] ?? ($siteName . ' | Free Online PDF Tools'))

@section('content')

<!-- Hero section with Search & Category filters -->
<div class="bg-slate-900 text-white py-16 relative overflow-hidden">
    <!-- Ambient glowing accents -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

    <div class="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-6">
        <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-xs">
            ✨ {{ $homeSettings['badge'] }}
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {!! $homeSettings['heading'] !!}
        </h1>
        <p class="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {{ $homeSettings['subheading'] }}
        </p>

        <!-- Ajax/Get Method Search Bar -->
        <form action="{{ route('home') }}" method="GET" class="max-w-xl mx-auto pt-4 relative">
            <input type="hidden" name="category" value="{{ $selectedCategory }}">
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    type="text" 
                    name="q" 
                    value="{{ $searchQuery }}"
                    placeholder="Search over 58+ custom document handlers..." 
                    class="w-full bg-white text-slate-900 text-sm font-semibold rounded-2xl pl-12 pr-28 py-4.5 border border-slate-200 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-slate-300 transition-all placeholder-slate-400"
                />
                <button type="submit" class="absolute right-2 top-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all">
                    Search
                </button>
            </div>
        </form>

        <!-- Categories Filters row -->
        <div class="pt-6">
            <div class="flex overflow-x-auto pb-3 gap-2 justify-start md:justify-center scrollbar-none">
                <a 
                    href="{{ route('home', ['q' => $searchQuery, 'category' => 'all']) }}" 
                    class="px-4 py-2 border text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap {{ $selectedCategory === 'all' ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800' }}"
                >
                    All Tools
                </a>
                @foreach($categoriesList as $cat)
                    <a 
                        href="{{ route('home', ['q' => $searchQuery, 'category' => $cat['id']]) }}" 
                        class="px-4 py-2 border text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap {{ $selectedCategory === $cat['id'] ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800' }}"
                    >
                        {{ $cat['label'] }}
                    </a>
                @endforeach
            </div>
        </div>

    </div>
</div>

<!-- Header Top banner Ad display -->
@if(isset($allAds['header_ad']) && $allAds['header_ad']->active)
    <div class="max-w-7xl mx-auto px-6 sm:px-8 pt-8">
        {!! $allAds['header_ad']->code !!}
    </div>
@endif

<!-- Main lists section -->
<div class="max-w-7xl mx-auto px-6 sm:px-8 py-12">
    
    <!-- Toolbox Top Ad Slot -->
    @if(isset($allAds['toolbox_top_ad']) && $allAds['toolbox_top_ad']->active)
        <div class="mb-8">
            {!! $allAds['toolbox_top_ad']->code !!}
        </div>
    @endif

    <div class="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
        <h2 class="font-bold text-xl text-slate-900 tracking-tight capitalize">
            {{ $selectedCategory === 'all' ? 'All Document Tools' : str_replace('-', ' ', $selectedCategory) }}
        </h2>
        <span class="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Category Match Section
        </span>
    </div>

    <!-- Responsive Panels with Left & Right Ads slots -->
    @php
        $hasLeftAd = isset($allAds['toolbox_left_ad']) && $allAds['toolbox_left_ad']->active;
        $hasRightAd = isset($allAds['toolbox_right_ad']) && $allAds['toolbox_right_ad']->active;
        $gridSpan = "lg:col-span-4";
        if ($hasLeftAd && $hasRightAd) $gridSpan = "lg:col-span-2";
        elseif ($hasLeftAd || $hasRightAd) $gridSpan = "lg:col-span-3";
    @endphp

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Toolbox Left Ad if Active -->
        @if($hasLeftAd)
            <div class="hidden lg:block lg:col-span-1">
                {!! $allAds['toolbox_left_ad']->code !!}
            </div>
        @endif

        <!-- Core Tools Cards grid -->
        <div class="col-span-1 {{ $gridSpan }} space-y-12">
            @if(count($tools) === 0)
                <div class="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-500 shadow-xs">
                    <div class="bg-slate-100 text-slate-400 p-4 rounded-full inline-block mb-3">
                        <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p class="font-extrabold text-slate-800 text-sm mb-1">No tools matched your active search query.</p>
                    <p class="text-xs text-slate-400">Try checking spelling or choose "All Tools" category list.</p>
                </div>
            @else
                @foreach($tools as $catSlug => $items)
                    <div>
                        <!-- Category SubHeader -->
                        <div class="flex items-center space-x-3 mb-6">
                            <div class="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            <h3 class="font-extrabold text-xs uppercase tracking-widest text-slate-400">{{ str_replace('-', ' ', $catSlug) }}</h3>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            @foreach($items as $tool)
                                <a href="{{ route('tool.show', $tool->tool_id) }}" class="group bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-blue-150 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between min-h-[200px]">
                                    <div>
                                        <!-- Tool Dynamic Icon placeholder -->
                                        <div class="p-3 bg-blue-50 text-blue-600 rounded-xl inline-block mb-4 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h4 class="font-bold text-sm text-slate-800 mb-2 truncate group-hover:text-blue-600 transition-colors">{{ $tool->name }}</h4>
                                        <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">{{ $tool->description }}</p>
                                    </div>
                                    <span class="text-[10px] font-bold text-blue-600 group-hover:text-blue-700 tracking-wider">SECURE CONVERTER &rarr;</span>
                                </a>
                            @endforeach
                        </div>
                    </div>
                @endforeach
            @endif
        </div>

        <!-- Toolbox Right Ad if Active -->
        @if($hasRightAd)
            <div class="hidden lg:block lg:col-span-1">
                {!! $allAds['toolbox_right_ad']->code !!}
            </div>
        @endif

    </div>

    <!-- Toolbox Bottom Ad Slot -->
    @if(isset($allAds['toolbox_bottom_ad']) && $allAds['toolbox_bottom_ad']->active)
        <div class="mt-12">
            {!! $allAds['toolbox_bottom_ad']->code !!}
        </div>
    @endif

</div>

<!-- FAQ dynamic accordion panels -->
<div class="bg-gray-100 border-t border-b border-gray-150 py-16">
    <div class="max-w-4xl mx-auto px-6">
        <div class="text-center space-y-3 mb-12">
            <h3 class="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">Frequently Asked Questions</h3>
            <p class="text-slate-500 text-sm max-w-lg mx-auto">Get answers to critical privacy compliance and file safety guidelines.</p>
        </div>

        <div class="space-y-4">
            @foreach($faqs as $i => $faq)
                <div class="bg-white border border-slate-105 rounded-2xl shadow-xs overflow-hidden">
                    <button class="w-full text-left p-6 font-bold text-xs text-slate-800 tracking-wider uppercase focus:outline-none flex justify-between items-center faq-btn" data-target="faq-ans-{{ $i }}">
                        <span>{{ $faq['question'] }}</span>
                        <svg class="h-4 w-4 transform transition-transform text-slate-400" id="icon-{{ $i }}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div id="faq-ans-{{ $i }}" class="hidden p-6 pt-0 border-t border-slate-50 text-slate-550 text-xs leading-relaxed">
                        {{ $faq['answer'] }}
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>

<!-- Feedback Form and rating details widget -->
<div class="bg-white py-16">
    <div class="max-w-2xl mx-auto px-6">
        <div class="bg-blue-600 rounded-3xl p-8 text-white space-y-6 shadow-xl relative overflow-hidden" id="feedback-widget-card">
            <!-- Alert success contact feedback -->
            @if(session('contact_success'))
                <div class="bg-emerald-500 text-white rounded-2xl p-4 text-xs font-bold shadow-md">
                    🎉 {{ session('contact_success') }}
                </div>
            @endif

            <div class="space-y-2">
                <span class="text-[9px] font-mono tracking-widest uppercase font-bold text-blue-200">Customer Support Desk</span>
                <h3 class="text-2xl font-extrabold tracking-tight">Need assistance or got feedback?</h3>
                <p class="text-xs text-blue-100 max-w-md leading-relaxed">Our support desk is open 24/7. Submit early purges, custom feature designs, or general inquiries.</p>
            </div>

            <form action="{{ route('feedback.submit') }}" method="POST" class="space-y-4">
                @csrf
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                        <label class="text-[10px] uppercase tracking-wider font-bold text-blue-100">Your Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            required 
                            placeholder="e.g. feedback@domain.com"
                            class="w-full bg-blue-700/50 border border-blue-500 rounded-xl px-4 py-3 text-xs placeholder-blue-300 text-white focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-blue-400 transition"
                        />
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[10px] uppercase tracking-wider font-bold text-blue-100">Experience Rating</label>
                        <select name="rating" class="w-full bg-blue-700/50 border border-blue-500 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-blue-400 transition cursor-pointer">
                            <option value="5" class="text-slate-800">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                            <option value="4" class="text-slate-800">⭐⭐⭐⭐ Very Good (4/5)</option>
                            <option value="3" class="text-slate-800">⭐⭐⭐ Adequate (3/5)</option>
                            <option value="2" class="text-slate-800">⭐⭐ Poor (2/5)</option>
                            <option value="1" class="text-slate-800">⭐ Extremely Bad (1/5)</option>
                        </select>
                    </div>
                </div>

                <div class="space-y-1.5">
                    <label class="text-[10px] uppercase tracking-wider font-bold text-blue-100">Describe message</label>
                    <textarea 
                        name="message" 
                        rows="4" 
                        required 
                        placeholder="Write detailed report details or questions..."
                        class="w-full bg-blue-700/50 border border-blue-500 rounded-xl px-4 py-3 text-xs placeholder-blue-300 text-white focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-blue-400 transition resize-none"
                    ></textarea>
                </div>

                <button type="submit" class="w-full py-3 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer">
                    Submit Message &rarr;
                </button>
            </form>
        </div>
    </div>
</div>

<script>
    // Accordion expand setup
    document.querySelectorAll('.faq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const target = document.getElementById(targetId);
            const icon = btn.querySelector('svg');
            
            if (target) {
                target.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            }
        });
    });
</script>

@endsection

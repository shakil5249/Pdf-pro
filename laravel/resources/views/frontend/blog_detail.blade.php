@extends('layouts.app')

@section('title', ($post->seo_title ?? $post->title) . ' | PDFProTools')
@section('description', $post->seo_description ?? $post->summary)
@section('keywords', $post->seo_keywords ?? 'pdf guidelines, convert pdf files')

@section('content')

<article class="bg-gray-50 pb-20">
    <!-- Jumbotron cover image header -->
    <div class="h-[300px] md:h-[400px] w-full relative overflow-hidden bg-slate-900 flex items-end">
        <img 
            src="{{ $post->featured_image ?: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200' }}" 
            alt="{{ $post->title }}"
            class="absolute inset-0 w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        <div class="max-w-4xl mx-auto px-6 relative z-10 pb-12 w-full text-white space-y-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-xs">
                📖 Guidelines & Tutorials
            </span>
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-3xl">
                {{ $post->title }}
            </h1>
            <div class="flex items-center space-x-4 text-xs font-semibold text-slate-350">
                <span>By PDFPro Editor</span>
                <span>•</span>
                <span>{{ $post->created_at->format('F d, Y') }}</span>
                <span>•</span>
                <span>5 Min Read</span>
            </div>
        </div>
    </div>

    <!-- Content breakdown structure -->
    <div class="max-w-5xl mx-auto px-6 pt-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <!-- Left 2 columns: Content body -->
            <div class="lg:col-span-2 space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-xs">
                
                <!-- Blog summary quote -->
                <div class="bg-blue-50/50 border-l-4 border-blue-600 p-6 rounded-r-2xl font-semibold text-xs leading-relaxed text-slate-705">
                    {{ $post->summary }}
                </div>

                <!-- Main article markdown parsers outputs -->
                <div class="prose max-w-none text-xs text-slate-650 leading-relaxed space-y-6">
                    {!! nl2br(e($post->content)) !!}
                </div>

            </div>

            <!-- Right 1 column: Context side rails widgets -->
            <div class="space-y-6">
                <!-- Highlight tools drawer -->
                <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Suggested utility</span>
                    <h3 class="font-extrabold text-sm text-slate-900">Need to compress or sign PDFs?</h3>
                    <p class="text-xs text-slate-500 leading-relaxed">Our suite contains over 58 free secure single-screen solutions tailored to match security regulations.</p>
                    <a href="{{ route('home') }}" class="w-full inline-flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition shadow-md">
                        Explore Full Suite
                    </a>
                </div>

                <!-- Related recently published items list -->
                @if(isset($relatedPosts) && $relatedPosts->count() > 0)
                    <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Next up guide</span>
                        <div class="space-y-4">
                            @foreach($relatedPosts as $rel)
                                <div class="space-y-1.5 pb-3 border-b border-slate-50 last:border-b-0 last:pb-0">
                                    <h4 class="font-bold text-xs text-slate-800 leading-snug hover:text-blue-600">
                                        <a href="{{ route('blog.show', $rel->slug) }}">{{ $rel->title }}</a>
                                    </h4>
                                    <span class="text-[10px] text-slate-400 font-semibold">{{ $rel->created_at->format('M d, Y') }}</span>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif

                <!-- Related Side visual Ad Spot -->
                @if(isset($allAds['post_sidebar_ad']) && $allAds['post_sidebar_ad']->active)
                    <div class="pt-4">
                        {!! $allAds['post_sidebar_ad']->code !!}
                    </div>
                @endif

            </div>

        </div>
    </div>
</article>

@endsection

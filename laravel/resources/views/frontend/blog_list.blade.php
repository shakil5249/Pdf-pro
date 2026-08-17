@extends('layouts.app')

@section('title', 'Guides, Tutorials & Blog | ' . $siteName)

@section('content')

<!-- Hero section -->
<div class="bg-slate-900 text-white py-16 text-center space-y-4">
    <span class="text-[10px] uppercase tracking-widest font-bold text-blue-400 font-mono">Knowledge Hub</span>
    <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Guides, Productivity & Security Reads</h1>
    <p class="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">Step-by-step guides, compliance recommendations, and contract signing workflows written by document experts.</p>
</div>

<!-- Blog listings grid -->
<div class="max-w-7xl mx-auto px-6 sm:px-8 py-16">
    @if($posts->count() === 0)
        <div class="bg-white border rounded-3xl p-12 text-center text-slate-500 shadow-xs">
            <p class="font-extrabold text-slate-800 text-sm mb-1">No guides or blog articles published yet.</p>
            <p class="text-xs text-slate-400">Head to the Admin dashboard panel under Blogs tab to draft your very first guide!</p>
        </div>
    @else
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @foreach($posts as $post)
                <article class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-xl hover:border-blue-150 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
                    <div>
                        <!-- Cover graphic -->
                        <div class="h-48 overflow-hidden bg-slate-100 relative">
                            <img 
                                src="{{ $post->featured_image ?: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800' }}" 
                                alt="{{ $post->title }}"
                                class="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                        </div>

                        <!-- Card text metadata -->
                        <div class="p-6 space-y-3">
                            <span class="text-[9px] font-bold text-blue-600 uppercase tracking-widest block font-mono">Tutorial / Tip</span>
                            <h2 class="font-bold text-sm text-slate-800 leading-snug hover:text-blue-600 transition">
                                <a href="{{ route('blog.show', $post->slug) }}">{{ $post->title }}</a>
                            </h2>
                            <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">{{ $post->summary }}</p>
                        </div>
                    </div>

                    <!-- Action link -->
                    <div class="p-6 pt-0 flex justify-between items-center text-slate-400 text-[10px] font-bold border-t border-slate-50 mt-4">
                        <span>{{ $post->created_at->format('M d, Y') }}</span>
                        <a href="{{ route('blog.show', $post->slug) }}" class="text-blue-600 hover:text-blue-700 tracking-wider">READ ARTICLE &rarr;</a>
                    </div>
                </article>
            @endforeach
        </div>

        <!-- Custom Pagination indicators links -->
        <div class="pt-12 text-center">
            {{ $posts->links() }}
        </div>
    @endif
</div>

@endsection

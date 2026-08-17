@extends('layouts.app')

@section('title', ($page['title'] ?? 'Custom Page') . ' | ' . $siteName)

@section('content')

<!-- Header Banner -->
<div class="bg-slate-900 text-white py-16 text-center space-y-4 relative">
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    <span class="text-[10px] uppercase tracking-widest font-bold text-blue-400 font-mono">Platform Information</span>
    <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">{{ $page['title'] }}</h1>
    <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">Officially sealed platform guideline resources of our unified utility system.</p>
</div>

<!-- Main Body Structure -->
<div class="max-w-4xl mx-auto px-6 py-16">
    <div class="bg-white p-8 md:p-12 border border-slate-100 shadow-sm rounded-3xl space-y-8">
        
        <!-- Render page text block content formatting -->
        <div class="prose max-w-none text-xs text-slate-750 space-y-6 leading-relaxed">
            {!! nl2br(e($page['content'])) !!}
        </div>

    </div>
</div>

@endsection

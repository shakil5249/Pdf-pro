import React from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import { ToolCategory, CategoryItem, SiteSettings } from '../types';

interface SearchHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ToolCategory | 'all';
  setSelectedCategory: (category: ToolCategory | 'all') => void;
  categories: CategoryItem[];
  settings?: SiteSettings;
}

export default function SearchHero({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  settings,
}: SearchHeroProps) {
  const CATEGORIES = [
    { id: 'all', label: 'All Tools' },
    ...categories.filter(c => c.active).map(c => ({ id: c.id, label: c.label }))
  ];
  return (
    <div className="bg-slate-50 text-slate-900 relative py-16 sm:py-20 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Subtle badge */}
        <div className="inline-flex items-center space-x-1.5 bg-white text-red-600 px-3 py-1.5 rounded-md text-xs font-semibold mb-6 border border-slate-200 shadow-sm">
          <Sparkles className="h-4 w-4" />
          <span>{settings?.homeBadge || "Professional-Grade Multi-tool Suite"}</span>
        </div>

        <h1 
          className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 sm:mb-6"
          dangerouslySetInnerHTML={{ 
            __html: settings?.homeHeading || 'Every PDF Tool You Need, <span class="text-red-600">at your fingertips</span>' 
          }}
        />
        
        <p className="font-sans text-[14px] sm:text-lg text-slate-505 max-w-2xl mx-auto mb-8 leading-relaxed">
          {settings?.homeSubheading || "The ultimate SaaS platform with PDF processing tools. Secure server-side engine with AI-Powered features for document automation."}
        </p>

        {/* Big Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tools... (e.g. compress, merge, translate, signature)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-900 pl-12 pr-4 py-4 rounded-md border border-slate-200 focus:border-red-600 focus:outline-none placeholder-slate-400 transition-all shadow-sm text-[15px] hover:border-slate-300"
              id="search-tools-input"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap justify-center gap-1.5 max-w-5xl mx-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white border border-red-600 shadow-sm'
                  : 'bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300 border border-slate-200'
              }`}
              id={`cat-btn-${cat.id}`}
            >
              {cat.id !== 'all' && <Filter className="inline-block h-3 w-3 mr-1.5 opacity-60" />}
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

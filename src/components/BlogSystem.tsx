import React, { useState } from 'react';
import { BookOpen, User, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { BlogPost, AdSpot } from '../types';

interface BlogSystemProps {
  blogs: BlogPost[];
  ads: AdSpot[];
  selectedBlog: BlogPost | null;
  onSelectBlog: (blog: BlogPost | null) => void;
}

export default function BlogSystem({ blogs, ads, selectedBlog, onSelectBlog }: BlogSystemProps) {
  // Find sidebar ads
  const sidebarAd = ads.find(a => a.id === 'sidebar_ad' && a.active);
  const postTopAd = ads.find(a => a.id === 'post_top_ad' && a.active);
  const postBottomAd = ads.find(a => a.id === 'post_bottom_ad' && a.active);
  const postSidebarAd = ads.find(a => a.id === 'post_sidebar_ad' && a.active);

  const format_date = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {selectedBlog ? (
        /* SINGLE BLOG POST CONTAINER */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <button
              onClick={() => onSelectBlog(null)}
              className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer pb-2"
              id="blog-back-btn"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Listing Guides</span>
            </button>

            {/* Main Featured Image */}
            <div className="rounded-2xl overflow-hidden h-64 sm:h-80 relative shadow border border-slate-100">
              <img
                src={selectedBlog.featured_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200'}
                alt={selectedBlog.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Meta Tags */}
            <div className="flex items-center space-x-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center space-x-1">
                <User className="h-3.5 w-3.5" />
                <span>By PDFProTools Specialist</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{format_date(selectedBlog.created_at)}</span>
              </span>
            </div>

            {postTopAd && (
              <div 
                className="w-full"
                dangerouslySetInnerHTML={{ __html: postTopAd.code }} 
              />
            )}

            <h1 className="font-sans font-extrabold text-2xl sm:text-3.5xl text-slate-800 tracking-tight leading-tight">
              {selectedBlog.title}
            </h1>

            {/* Render Markdown Content Simple Text */}
            <div className="prose max-w-none text-slate-600 space-y-4 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-6">
              {selectedBlog.content.split('\n').map((para, i) => {
                const p = para.trim();
                if (p.startsWith('## ')) {
                  return <h2 key={i} className="font-bold text-lg text-slate-800 pt-4 block">{p.replace('## ', '')}</h2>;
                }
                if (p.startsWith('### ')) {
                  return <h3 key={i} className="font-bold text-sm text-slate-800 pt-3 block">{p.replace('### ', '')}</h3>;
                }
                if (p.startsWith('- ')) {
                  return <li key={i} className="list-disc pl-2 ml-4 font-sans">{p.replace('- ', '')}</li>;
                }
                if (p.match(/^\d+\.\s/)) {
                  return <li key={i} className="list-decimal pl-2 ml-4 font-sans">{p.replace(/^\d+\.\s/, '')}</li>;
                }
                return p !== '' ? <p key={i} className="font-sans font-normal">{p}</p> : null;
              })}
            </div>

            {postBottomAd && (
              <div 
                className="w-full mt-6"
                dangerouslySetInnerHTML={{ __html: postBottomAd.code }} 
              />
            )}
          </div>

          {/* SIDEBAR COL */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
              <h3 className="font-sans font-bold text-sm text-slate-800 mb-3">About PDFProTools</h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                PDFProTools is a high-availability online tools network designed to simplify everyday document processing. Free, safe, and fast, you can secure and edit folders effortlessly.
              </p>
            </div>

            {/* Sidebar ad space */}
            {sidebarAd && (
              <div 
                className="shadow-sm"
                dangerouslySetInnerHTML={{ __html: sidebarAd.code }} 
              />
            )}

            {/* Post sidebar ad space */}
            {postSidebarAd && (
              <div 
                className="shadow-sm"
                dangerouslySetInnerHTML={{ __html: postSidebarAd.code }} 
              />
            )}
          </div>
        </div>
      ) : (
        /* BLOG ARTICLES GRID LISTING */
        <div className="space-y-8">
          <div>
            <h1 className="font-sans font-extrabold text-3xl text-slate-800 mb-1">Guides, Tips & Best Practices</h1>
            <p className="font-sans text-xs sm:text-sm text-slate-500 max-w-xl">Learn how to maximize PDF file operations, secure electronic signatures, and automate workflows.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {blogs.map(b => (
              <div
                key={b.id}
                onClick={() => onSelectBlog(b)}
                className="group cursor-pointer bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex flex-col"
              >
                <div className="h-44 shrink-0 overflow-hidden relative bg-slate-100">
                  <img
                    src={b.featured_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200'}
                    alt={b.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wider block mb-2">Guides & Articles</span>
                    
                    <h3 className="font-sans font-bold text-base sm:text-md text-slate-800 group-hover:text-red-500 transition-colors mb-2 leading-snug line-clamp-2">
                      {b.title}
                    </h3>
                    
                    <p className="font-sans text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                      {b.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-red-500 pt-3 border-t border-slate-50">
                    <span>Read Full Guide</span>
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

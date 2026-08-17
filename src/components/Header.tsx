import React from 'react';
import { FileEdit, Monitor, BookOpen, Settings, Lock, Unlock, LogIn } from 'lucide-react';
import { SiteSettings, MenuItem, AdSpot } from '../types';

interface HeaderProps {
  settings: SiteSettings;
  currentTab: 'home' | 'blog' | 'admin' | 'page';
  onChangeTab: (tab: 'home' | 'blog' | 'admin' | 'page') => void;
  headerMenu?: MenuItem[];
  onClickMenuItem?: (item: MenuItem) => void;
  ads?: AdSpot[];
  isAdminLoggedIn?: boolean;
}

export default function Header({ settings, currentTab, onChangeTab, headerMenu = [], onClickMenuItem, ads = [], isAdminLoggedIn = false }: HeaderProps) {
  const leftAd = ads.find(a => a.id === 'header_left_ad' && a.active);
  const rightAd = ads.find(a => a.id === 'header_right_ad' && a.active);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand with Header Left Ad option */}
          <div className="flex items-center space-x-4">
            <div 
              onClick={() => onChangeTab('home')} 
              className="flex items-center space-x-2.5 cursor-pointer group"
              id="nav-logo"
            >
              {settings.logo && (settings.logo.startsWith('http://') || settings.logo.startsWith('https://') || settings.logo.startsWith('data:image/')) ? (
                <img src={settings.logo} alt={settings.siteName || "Logo"} className="h-9 max-w-[160px] object-contain transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
              ) : (
                <>
                  <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white transition-colors group-hover:bg-red-700">
                    <FileEdit className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-sans font-bold text-xl tracking-tight text-slate-800 italic">
                    {settings.logo || (
                      <>
                        PDF<span className="text-red-600">Pro</span>Tools
                      </>
                    )}
                  </span>
                </>
              )}
            </div>

            {leftAd && (
              <div 
                className="max-h-12 overflow-hidden hidden md:block max-w-[150px] text-xs"
                dangerouslySetInnerHTML={{ __html: leftAd.code }}
              />
            )}
          </div>

          {/* Nav Links */}
          <nav className="flex items-center space-x-6 sm:space-x-8">
            {headerMenu && headerMenu.length > 0 ? (
              headerMenu.map(item => {
                const isActive = (item.type === 'home' && currentTab === 'home') ||
                                 (item.type === 'blog' && currentTab === 'blog') ||
                                 (item.type === 'page' && currentTab === 'page');
                return (
                  <button
                    key={item.id}
                    onClick={() => onClickMenuItem?.(item)}
                    className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      isActive
                        ? 'text-red-600 border-b-2 border-red-600 pb-0.5'
                        : 'text-slate-500 hover:text-red-600'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })
            ) : (
              <>
                <button
                  onClick={() => onChangeTab('home')}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    currentTab === 'home'
                      ? 'text-red-600 border-b-2 border-red-600 pb-0.5'
                      : 'text-slate-500 hover:text-red-600'
                  }`}
                  id="menu-tools-btn"
                >
                  <span className="flex items-center space-x-1">
                    <Monitor className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Merge</span>
                  </span>
                </button>

                <button
                  onClick={() => onChangeTab('blog')}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    currentTab === 'blog'
                      ? 'text-red-600 border-b-2 border-red-600 pb-0.5'
                      : 'text-slate-500 hover:text-red-600'
                  }`}
                  id="menu-blog-btn"
                >
                  <span className="flex items-center space-x-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Guides & Blog</span>
                  </span>
                </button>
              </>
            )}

            {rightAd && (
              <div 
                className="max-h-12 overflow-hidden hidden lg:block max-w-[150px] text-xs"
                dangerouslySetInnerHTML={{ __html: rightAd.code }}
              />
            )}

            {isAdminLoggedIn && (
              <button
                onClick={() => onChangeTab('admin')}
                className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer rounded-xl flex items-center space-x-1.5 ${
                  currentTab === 'admin'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                }`}
                id="menu-admin-btn"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Admin Panel</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

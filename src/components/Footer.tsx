import React from 'react';
import { Heart, FileCheck } from 'lucide-react';
import { SiteSettings, AdSpot, CustomPage, MenuItem } from '../types';

interface FooterProps {
  settings: SiteSettings;
  ads: AdSpot[];
  pages?: CustomPage[];
  onClickPage?: (page: CustomPage) => void;
  footerMenu?: MenuItem[];
  onClickMenuItem?: (item: MenuItem) => void;
}

export default function Footer({ 
  settings, 
  ads, 
  pages = [], 
  onClickPage,
  footerMenu = [],
  onClickMenuItem
}: FooterProps) {
  const stickyAd = ads.find(a => a.id === 'sticky_ad' && a.active);
  const footerAd = ads.find(a => a.id === 'footer_ad' && a.active);

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 mt-20 relative font-sans">
      {footerAd && (
        <div 
          className="max-w-7xl mx-auto px-6 sm:px-8 pt-8"
          dangerouslySetInnerHTML={{ __html: footerAd.code }} 
        />
      )}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-100">
          
          {/* Col 1 Brand */}
          <div className="space-y-4">
            {settings.logo && (settings.logo.startsWith('http://') || settings.logo.startsWith('https://') || settings.logo.startsWith('data:image/')) ? (
              <img src={settings.logo} alt={settings.siteName || "Logo"} className="h-8 max-w-[150px] object-contain" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex items-center space-x-2.5 text-slate-900">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white">
                  <FileCheck className="h-4.5 w-4.5" />
                </div>
                <span className="font-sans font-bold text-lg tracking-tight italic">
                  {settings.logo || (
                    <>
                      PDF<span className="text-red-600">Pro</span>Tools
                    </>
                  )}
                </span>
              </div>
            )}
            
            <p className="font-sans text-xs leading-relaxed max-w-sm text-slate-400">
              {settings.footerAboutText || 'The premier online suite built for maximum optimization. Merge, compress, convert, sign, and redact documents globally. 100% cloud secure.'}
            </p>
          </div>

          {/* Col 2 Safe badge info */}
          <div className="space-y-3">
            <h4 className="text-slate-800 text-xs uppercase tracking-wider font-bold">Data Privacy Security</h4>
            <p className="font-sans text-xs leading-relaxed text-slate-400">
              {settings.footerPrivacyText || 'All files are transferred utilizing optimized TLS encrypted links. Uploaded data is processed server-side in sandbox environments and auto-deleted within 15 minutes of completion.'}
            </p>
          </div>

          {/* Col 3 Useful quicklinks & Pages */}
          <div className="space-y-3">
            <h4 className="text-slate-800 text-xs uppercase tracking-wider font-bold">PDF Resources & Pages</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {footerMenu && footerMenu.length > 0 ? (
                footerMenu.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.type === 'page') {
                        const page = pages.find(p => p.slug === item.value || p.id === item.value);
                        if (page) {
                          onClickPage?.(page);
                        } else {
                          onClickMenuItem?.(item);
                        }
                      } else {
                        onClickMenuItem?.(item);
                      }
                    }}
                    className="hover:text-red-600 font-medium transition-colors cursor-pointer text-slate-400 text-left border-none bg-transparent p-0"
                  >
                    {item.label}
                  </button>
                ))
              ) : (
                <>
                  <span className="hover:text-red-600 transition-colors cursor-pointer text-slate-400">Developers API</span>
                  <span className="hover:text-red-600 transition-colors cursor-pointer text-slate-400">Desktop App</span>
                  <span className="hover:text-red-600 transition-colors cursor-pointer text-slate-400">Mobile App</span>
                  <span className="hover:text-red-600 transition-colors cursor-pointer text-slate-400">Enterprise</span>
                  {pages.filter(p => p.isActive).map(page => (
                    <button
                      key={page.id}
                      onClick={() => onClickPage?.(page)}
                      className="hover:text-red-600 font-medium transition-colors cursor-pointer text-slate-400 text-left border-none bg-transparent p-0"
                    >
                      {page.title}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

        </div>

        {/* Copy layout */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0">
          <span>&copy; {new Date().getFullYear()} {settings.siteName || 'PDFProTools'}. All Rights Reserved.</span>
          <div className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>{settings.footerCopyrightText || 'for Web SaaS Integrations.'}</span>
          </div>
        </div>
      </div>

      {stickyAd && (
        <div 
          className="fixed bottom-0 left-0 w-full z-45 shadow hover:shadow-xl bg-white border-t border-slate-200"
          dangerouslySetInnerHTML={{ __html: stickyAd.code }} 
        />
      )}
    </footer>
  );
}

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchHero from './components/SearchHero';
import ToolCard from './components/ToolCard';
import ToolViewer from './components/ToolViewer';
import AdminPanel from './components/AdminPanel';
import BlogSystem from './components/BlogSystem';
import Footer from './components/Footer';
import FaqSection from './components/FaqSection';
import FeedbackWidget from './components/FeedbackWidget';
import InstallerDemo from './components/InstallerDemo';
import { PdfTool, BlogPost, AdSpot, SiteSettings, ToolCategory, CustomPage, MenuItem, FaqItem, CategoryItem } from './types';
import { INITIAL_TOOLS, INITIAL_BLOGS, INITIAL_ADS, INITIAL_SITE_SETTINGS, INITIAL_PAGES, INITIAL_HEADER_MENU, INITIAL_FOOTER_MENU, INITIAL_FAQS, INITIAL_CATEGORIES } from './data';
import { Sparkles, MessageSquare, ShieldCheck, Heart, User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'blog' | 'admin' | 'page' | 'install'>('home');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [tools, setTools] = useState<PdfTool[]>(INITIAL_TOOLS);
  const [blogsList, setBlogsList] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [adsList, setAdsList] = useState<AdSpot[]>(INITIAL_ADS);
  const [pagesList, setPagesList] = useState<CustomPage[]>(INITIAL_PAGES);
  const [selectedActivePage, setSelectedActivePage] = useState<CustomPage | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [headerMenu, setHeaderMenu] = useState<MenuItem[]>(INITIAL_HEADER_MENU);
  const [footerMenu, setFooterMenu] = useState<MenuItem[]>(INITIAL_FOOTER_MENU);
  const [faqsList, setFaqsList] = useState<FaqItem[]>(INITIAL_FAQS);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  
  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
      return true;
    }
    const savedSession = localStorage.getItem('adminSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.loggedIn === true && session.expiresAt && Date.now() < session.expiresAt) {
          return true;
        } else {
          localStorage.removeItem('adminSession');
        }
      } catch (e) {
        localStorage.removeItem('adminSession');
      }
    }
    return false;
  });
  const [loginUserOrEmail, setLoginUserOrEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Filtering & Selected states
  const [selectedTool, setSelectedTool] = useState<PdfTool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');

  // Load configurations from backend on launch
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const resSettings = await fetch('/api/settings');
      if (resSettings.ok) {
        const d = await resSettings.json();
        setSiteSettings(d);
        // Sync document titles
        document.title = d.title || INITIAL_SITE_SETTINGS.title;
      }

      const resTools = await fetch('/api/tools');
      if (resTools.ok) {
        setTools(await resTools.json());
      }

      const resBlogs = await fetch('/api/blogs');
      if (resBlogs.ok) {
        setBlogsList(await resBlogs.json());
      }

      const resAds = await fetch('/api/ads');
      if (resAds.ok) {
        const loadedAds = await resAds.json() as AdSpot[];
        const merged = [...loadedAds];
        INITIAL_ADS.forEach(initAd => {
          if (!merged.some(ad => ad.id === initAd.id)) {
            merged.push(initAd);
          }
        });
        setAdsList(merged);
      }

      const resPages = await fetch('/api/pages');
      if (resPages.ok) {
        setPagesList(await resPages.json());
      }

      const resMenus = await fetch('/api/menus');
      if (resMenus.ok) {
        const m = await resMenus.json();
        if (m.headerMenu) setHeaderMenu(m.headerMenu);
        if (m.footerMenu) setFooterMenu(m.footerMenu);
      }

      const resFaqs = await fetch('/api/faqs');
      if (resFaqs.ok) {
        setFaqsList(await resFaqs.json());
      }

      const resCategories = await fetch('/api/categories');
      if (resCategories.ok) {
        setCategoriesList(await resCategories.json());
      }
    } catch (err) {
      console.warn("Could not sync complete configurations with Express API, using initial states.", err);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctUser = siteSettings.adminUsername || 'admin';
    const correctEmail = siteSettings.adminEmail || 'admin@your-domain.com';
    const correctPass = siteSettings.adminPassword || 'admin123';

    if (
      (loginUserOrEmail === correctUser || loginUserOrEmail === correctEmail) &&
      loginPass === correctPass
    ) {
      setIsAdminLoggedIn(true);
      if (rememberMe) {
        // Persist session for 30 days
        const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
        localStorage.setItem('adminSession', JSON.stringify({ loggedIn: true, expiresAt }));
        sessionStorage.removeItem('isAdminLoggedIn');
      } else {
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.removeItem('adminSession');
      }
      setLoginError('');
      setLoginPass('');
    } else {
      setLoginError('Invalid administrator credentials. Please check your username/email and password.');
    }
  };

  // Route/Tab change navigator with HTML5 pushState integration
  const navigateTab = (
    tab: 'home' | 'blog' | 'admin' | 'page' | 'install',
    options?: { tool?: PdfTool | null; page?: CustomPage | null; blog?: BlogPost | null }
  ) => {
    setCurrentTab(tab);
    if (tab === 'home') {
      const tool = options?.tool;
      setSelectedTool(tool || null);
      setSelectedActivePage(null);
      setSelectedBlog(null);
      if (tool) {
        window.history.pushState({ tab: 'home', toolId: tool.id }, '', `/${tool.id}`);
      } else {
        window.history.pushState({ tab: 'home' }, '', '/');
      }
    } else if (tab === 'blog') {
      setSelectedTool(null);
      setSelectedActivePage(null);
      const blog = options?.blog;
      setSelectedBlog(blog || null);
      if (blog) {
        window.history.pushState({ tab: 'blog', slug: blog.slug || blog.id }, '', `/blog/${blog.slug || blog.id}`);
      } else {
        window.history.pushState({ tab: 'blog' }, '', '/blog');
      }
    } else if (tab === 'admin') {
      setSelectedTool(null);
      setSelectedActivePage(null);
      setSelectedBlog(null);
      window.history.pushState({ tab: 'admin' }, '', '/admin');
    } else if (tab === 'install') {
      setSelectedTool(null);
      setSelectedActivePage(null);
      setSelectedBlog(null);
      window.history.pushState({ tab: 'install' }, '', '/install');
    } else if (tab === 'page') {
      setSelectedTool(null);
      setSelectedBlog(null);
      const page = options?.page;
      setSelectedActivePage(page || null);
      if (page) {
        window.history.pushState({ tab: 'page', slug: page.slug }, '', `/page/${page.slug}`);
      } else {
        window.history.pushState({ tab: 'home' }, '', '/');
      }
    }
  };

  // Synchronize dynamic application state with URL paths (Router Engine)
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const pageParam = searchParams.get('page');
      const blogParam = searchParams.get('blog');
      const toolParam = searchParams.get('tool');

      if (path === '/admin') {
        setCurrentTab('admin');
        setSelectedTool(null);
        setSelectedActivePage(null);
        setSelectedBlog(null);
      } else if (path === '/install') {
        setCurrentTab('install');
        setSelectedTool(null);
        setSelectedActivePage(null);
        setSelectedBlog(null);
      } else if (path === '/blog') {
        setCurrentTab('blog');
        setSelectedTool(null);
        setSelectedActivePage(null);
        setSelectedBlog(null);
      } else if (path.startsWith('/blog/')) {
        setCurrentTab('blog');
        setSelectedTool(null);
        setSelectedActivePage(null);
        const slug = path.substring(6);
        if (blogsList.length > 0) {
          const blog = blogsList.find(b => b.slug === slug || b.id === slug);
          if (blog) {
            setSelectedBlog(blog);
          }
        }
      } else if (path.startsWith('/page/')) {
        setCurrentTab('page');
        setSelectedTool(null);
        setSelectedBlog(null);
        const slug = path.substring(6);
        if (pagesList.length > 0) {
          const page = pagesList.find(p => p.slug === slug || p.id === slug);
          if (page) {
            setSelectedActivePage(page);
          }
        }
      } else if (pageParam) {
        if (pagesList.length > 0) {
          const page = pagesList.find(p => p.slug === pageParam || p.id === pageParam);
          if (page) {
            setSelectedActivePage(page);
            setCurrentTab('page');
            setSelectedTool(null);
            setSelectedBlog(null);
          }
        }
      } else if (toolParam) {
        if (tools.length > 0) {
          const tool = tools.find(t => t.id === toolParam);
          if (tool) {
            setSelectedTool(tool);
            setCurrentTab('home');
            setSelectedActivePage(null);
            setSelectedBlog(null);
          }
        }
      } else if (blogParam) {
        if (blogsList.length > 0) {
          const blog = blogsList.find(b => b.slug === blogParam || b.id === blogParam);
          if (blog) {
            setSelectedBlog(blog);
            setCurrentTab('blog');
            setSelectedTool(null);
            setSelectedActivePage(null);
          }
        }
      } else {
        // Check if path itself is a tool ID/slug (e.g. /merge-pdf)
        const possibleToolId = path.substring(1);
        if (possibleToolId && tools.length > 0) {
          const tool = tools.find(t => t.id === possibleToolId);
          if (tool) {
            setSelectedTool(tool);
            setCurrentTab('home');
            setSelectedActivePage(null);
            setSelectedBlog(null);
            return;
          }
        }

        if (path === '/' || path === '') {
          setCurrentTab('home');
          if (!toolParam) setSelectedTool(null);
          if (!pageParam) setSelectedActivePage(null);
          setSelectedBlog(null);
        }
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, [pagesList, tools, blogsList]);

  // Sync active title and favicon
  useEffect(() => {
    document.title = siteSettings.title || "PDFProTools";
    if (siteSettings.favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = siteSettings.favicon;
    }
  }, [siteSettings]);

  // Sync state modifications with Express API backend
  const updateSiteSettings = async (next: SiteSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      });
      if (res.ok) {
        setSiteSettings(next);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleToolActive = async (toolId: string, active: boolean) => {
    const orig = tools.find(t => t.id === toolId);
    if (!orig) return;
    const next = { ...orig, isActive: active };
    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      });
      if (res.ok) {
        setTools(prev => prev.map(t => t.id === toolId ? next : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveTool = async (updated: PdfTool) => {
    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setTools(prev => {
          const exists = prev.some(t => t.id === updated.id);
          if (exists) {
            return prev.map(t => t.id === updated.id ? updated : t);
          } else {
            return [...prev, updated];
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveBlogPost = async (blog: Partial<BlogPost>) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog)
      });
      if (res.ok) {
        const json = await res.json();
        if (!blog.id) {
          setBlogsList(prev => [json.blog, ...prev]);
        } else {
          setBlogsList(prev => prev.map(b => b.id === blog.id ? { ...b, ...blog } : b));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setBlogsList(prev => prev.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateAdsConfig = async (updatedAds: AdSpot[]) => {
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ads: updatedAds })
      });
      if (res.ok) {
        setAdsList(updatedAds);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveCustomPage = async (page: Partial<CustomPage>) => {
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page)
      });
      if (res.ok) {
        const json = await res.json();
        if (!page.id) {
          setPagesList(prev => [json.page, ...prev]);
        } else {
          setPagesList(prev => prev.map(p => p.id === page.id ? { ...p, ...page } : p));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCustomPage = async (id: string) => {
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setPagesList(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveFaq = async (faq: Partial<FaqItem>) => {
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq)
      });
      if (res.ok) {
        const resFaqs = await fetch('/api/faqs');
        if (resFaqs.ok) {
          setFaqsList(await resFaqs.json());
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setFaqsList(prev => prev.filter(f => f.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCategory = async (cat: CategoryItem) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
      if (res.ok) {
        setCategoriesList(prev => {
          const exists = prev.some(c => c.id === cat.id);
          if (exists) {
            return prev.map(c => c.id === cat.id ? cat : c);
          } else {
            return [...prev, cat];
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategoriesList(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const reorderFaqs = async (reordered: FaqItem[]) => {
    try {
      setFaqsList(reordered);
      await fetch('/api/faqs/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorderedFaqs: reordered })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const saveHeaderMenu = async (next: MenuItem[]) => {
    try {
      const res = await fetch('/api/menus/header', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      });
      if (res.ok) {
        setHeaderMenu(next);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveFooterMenu = async (next: MenuItem[]) => {
    try {
      const res = await fetch('/api/menus/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      });
      if (res.ok) {
        setFooterMenu(next);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const incrementStats = async (toolId: string) => {
    try {
      await fetch('/api/stats/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.type === 'home') {
      setSearchQuery('');
      setSelectedCategory('all');
      navigateTab('home');
    } else if (item.type === 'blog') {
      navigateTab('blog');
    } else if (item.type === 'page') {
      const page = pagesList.find(p => p.slug === item.value || p.id === item.value);
      if (page) {
        navigateTab('page', { page });
      }
    } else if (item.type === 'external') {
      if (item.value.startsWith('http://') || item.value.startsWith('https://')) {
        window.location.href = item.value;
      } else {
        // Fallback or relative redirect
        window.location.href = `https://${item.value}`;
      }
    }
  };

  // Filter tools list based on landing search query & category selection
  const filteredTools = tools.filter(tool => {
    if (!tool.isActive) return false; // Hide disabled tools

    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between" id="app-container">
      <div>
        <Header 
          settings={siteSettings} 
          currentTab={currentTab} 
          onChangeTab={(tab) => {
            if (tab === 'home') {
              setSearchQuery('');
              setSelectedCategory('all');
            }
            navigateTab(tab);
          }} 
          headerMenu={headerMenu}
          onClickMenuItem={handleMenuItemClick}
          ads={adsList}
          isAdminLoggedIn={isAdminLoggedIn}
        />

        {/* Header Bottom Ad */}
        {adsList.find(a => a.id === 'header_bottom_ad' && a.active) && (
          <div 
            className="w-full bg-white border-b border-rose-100 py-2.5 px-6 sm:px-8"
            dangerouslySetInnerHTML={{ __html: adsList.find(a => a.id === 'header_bottom_ad')?.code || '' }} 
          />
        )}

        {/* Global Header Inject Display code */}
        {siteSettings.customCodeBody && (
          <div dangerouslySetInnerHTML={{ __html: siteSettings.customCodeBody }} />
        )}

        {/* Header visual ad zone */}
        {adsList.find(a => a.id === 'header_ad' && a.active) && (
          <div 
            className="max-w-7xl mx-auto px-4 pt-4 sm:px-6 lg:px-8"
            dangerouslySetInnerHTML={{ __html: adsList.find(a => a.id === 'header_ad')?.code || '' }} 
          />
        )}

        <main>
          {currentTab === 'home' && (
            <>
              {selectedTool ? (
                <ToolViewer 
                  tool={selectedTool} 
                  onBack={() => navigateTab('home')} 
                  ads={adsList}
                  onIncrementUsage={incrementStats}
                />
              ) : (
                <>
                  <SearchHero 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory} 
                    categories={categoriesList}
                    settings={siteSettings}
                  />

                  {/* Body Ad Spot */}
                  {adsList.find(a => a.id === 'body_ad' && a.active) && (
                    <div 
                      className="max-w-7xl mx-auto px-6 sm:px-8 pt-6"
                      dangerouslySetInnerHTML={{ __html: adsList.find(a => a.id === 'body_ad')?.code || '' }} 
                    />
                  )}

                  {/* Main Grid Section */}
                  <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
                    {/* Toolbox Top Ad Slot */}
                    {adsList.find(a => a.id === 'toolbox_top_ad' && a.active) && (
                      <div 
                        className="mb-8"
                        dangerouslySetInnerHTML={{ __html: adsList.find(a => a.id === 'toolbox_top_ad')?.code || '' }} 
                      />
                    )}

                    <div className="flex justify-between items-end mb-8">
                      <h2 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight capitalize">
                        {selectedCategory === 'all' ? 'All Pro Tools' : `${selectedCategory.replace('-', ' ')}`}
                      </h2>
                      <span className="text-xs text-[#94a3b8] font-medium">
                        Showing {filteredTools.length} of {tools.filter(t => t.isActive).length} active tools
                      </span>
                    </div>

                    {/* Highly responsive side panels layout */}
                    {(() => {
                      const hasLeftAd = adsList.some(a => a.id === 'toolbox_left_ad' && a.active);
                      const hasRightAd = adsList.some(a => a.id === 'toolbox_right_ad' && a.active);
                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                          {hasLeftAd && (
                            <div className="lg:col-span-1 hidden lg:block">
                              <div dangerouslySetInnerHTML={{ __html: adsList.find(a => a.id === 'toolbox_left_ad')?.code || '' }} />
                            </div>
                          )}

                          <div className={`col-span-1 ${
                            hasLeftAd && hasRightAd 
                              ? 'lg:col-span-2' 
                              : hasLeftAd || hasRightAd 
                                ? 'lg:col-span-3' 
                                : 'lg:col-span-4'
                          }`}>
                            <div className={`grid grid-cols-1 sm:grid-cols-2 ${
                              hasLeftAd && hasRightAd
                                ? 'lg:grid-cols-2 md:grid-cols-2'
                                : hasLeftAd || hasRightAd
                                  ? 'lg:grid-cols-3 md:grid-cols-3'
                                  : 'md:grid-cols-3 lg:grid-cols-5'
                            } gap-6`}>
                              {filteredTools.map(tool => (
                                <ToolCard 
                                  key={tool.id} 
                                  tool={tool} 
                                  onSelect={(t) => navigateTab('home', { tool: t })} 
                                />
                              ))}
                            </div>

                            {filteredTools.length === 0 && (
                              <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <p className="text-slate-400 font-sans text-xs sm:text-sm mb-2">No matching tools found.</p>
                                <button 
                                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                  className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                                >
                                  Clear filters
                                </button>
                              </div>
                            )}
                          </div>

                          {hasRightAd && (
                            <div className="lg:col-span-1 hidden lg:block">
                              <div dangerouslySetInnerHTML={{ __html: adsList.find(a => a.id === 'toolbox_right_ad')?.code || '' }} />
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Toolbox Bottom Ad Slot */}
                    {adsList.find(a => a.id === 'toolbox_bottom_ad' && a.active) && (
                      <div 
                        className="mt-12"
                        dangerouslySetInnerHTML={{ __html: adsList.find(a => a.id === 'toolbox_bottom_ad')?.code || '' }} 
                      />
                    )}
                  </div>
                  <FaqSection faqs={faqsList} />
                </>
              )}
            </>
          )}

          {currentTab === 'blog' && (
            <BlogSystem 
              blogs={blogsList} 
              ads={adsList} 
              selectedBlog={selectedBlog}
              onSelectBlog={(blog) => navigateTab('blog', { blog })}
            />
          )}

          {currentTab === 'page' && selectedActivePage && (
            <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
              <button
                onClick={() => navigateTab('home')}
                className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer pb-6 border-none bg-transparent"
              >
                <span className="text-sm font-bold">&larr;</span>
                <span>Back to Homepage</span>
              </button>

              <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-left">
                <span className="text-[10px] font-mono font-bold text-slate-400 block mb-2">PUBLISHED ON {new Date(selectedActivePage.createdAt || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <h1 className="font-sans font-extrabold text-3xl text-slate-900 tracking-tight leading-tight mb-8">
                  {selectedActivePage.title}
                </h1>

                {/* Render Markdown Content Simple Text */}
                <div className="prose max-w-none text-slate-600 space-y-4 text-sm leading-relaxed border-t border-slate-150 pt-8 font-sans">
                  {selectedActivePage.content.split('\n').map((para, i) => {
                    const p = para.trim();
                    if (p.startsWith('## ')) {
                      return <h2 key={i} className="font-bold text-lg text-slate-850 pt-4 block">{p.replace('## ', '')}</h2>;
                    }
                    if (p.startsWith('### ')) {
                      return <h3 key={i} className="font-bold text-sm text-slate-855 pt-3 block">{p.replace('### ', '')}</h3>;
                    }
                    if (p.startsWith('- ')) {
                      return <li key={i} className="list-disc pl-2 ml-4 text-slate-700">{p.replace('- ', '')}</li>;
                    }
                    if (p.match(/^\d+\.\s/)) {
                      return <li key={i} className="list-decimal pl-2 ml-4 text-slate-700">{p.replace(/^\d+\.\s/, '')}</li>;
                    }
                    return p !== '' ? <p key={i} className="font-normal text-slate-700">{p}</p> : null;
                  })}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'admin' && !isAdminLoggedIn && (
            <div className="max-w-md mx-auto py-12 px-4">
              <div className="bg-blue-600 border border-blue-700 rounded-3xl shadow-xl overflow-hidden p-8 space-y-6 animate-fade-in text-white" id="admin-login-card">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow">
                    <ShieldCheck className="h-6 w-6 animate-pulse" />
                  </div>
                  <h2 className="font-sans font-extrabold text-xl text-white">Admin Workspace</h2>
                  <p className="font-sans text-xs text-blue-100">Sign in using credentials registered in the database configuration layer.</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  {loginError && (
                    <div className="p-3.5 bg-amber-500 border border-amber-450 rounded-xl text-xs text-white flex items-start space-x-2 shadow-xs">
                      <AlertCircle className="h-4 w-4 text-white shrink-0 mt-0.5" />
                      <span className="font-semibold">{loginError}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-blue-100 block mb-1">Username or Email Address</label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-blue-500" />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={loginUserOrEmail}
                        onChange={(e) => setLoginUserOrEmail(e.target.value)}
                        placeholder="e.g. admin"
                        className="w-full bg-white border border-blue-400 focus:border-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-colors placeholder-slate-400"
                        id="login-username-input"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-blue-100">Access Key Password</label>
                    </div>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-blue-500" />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-blue-400 focus:border-white rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none transition-colors placeholder-slate-400"
                        id="login-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 focus:outline-none cursor-pointer transition-colors"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 bg-white border-blue-400 focus:ring-blue-500 accent-blue-500 cursor-pointer"
                        id="login-remember-me-checkbox"
                      />
                      <span className="text-xs font-semibold text-blue-100">Remember me for 30 days</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-extrabold rounded-xl text-xs shadow-md hover:shadow-lg transition cursor-pointer border-none"
                    id="login-submit-btn"
                  >
                    Login
                  </button>
                </form>


              </div>
            </div>
          )}

          {currentTab === 'admin' && isAdminLoggedIn && (
            <AdminPanel 
              settings={siteSettings} 
              onUpdateSettings={updateSiteSettings} 
              tools={tools} 
              onToggleTool={toggleToolActive} 
              onSaveTool={saveTool}
              blogs={blogsList} 
              onSaveBlog={saveBlogPost} 
              onDeleteBlog={deleteBlogPost} 
              ads={adsList} 
              onUpdateAds={updateAdsConfig} 
              pages={pagesList}
              onSavePage={saveCustomPage}
              onDeletePage={deleteCustomPage}
              headerMenu={headerMenu}
              onSaveHeaderMenu={saveHeaderMenu}
              footerMenu={footerMenu}
              onSaveFooterMenu={saveFooterMenu}
              faqs={faqsList}
              onSaveFaq={saveFaq}
              onDeleteFaq={deleteFaq}
              onReorderFaqs={reorderFaqs}
              categories={categoriesList}
              onSaveCategory={handleSaveCategory}
              onDeleteCategory={handleDeleteCategory}
              onLogout={() => {
                setIsAdminLoggedIn(false);
                sessionStorage.removeItem('isAdminLoggedIn');
              }}
            />
          )}

          {currentTab === 'install' && (
            <InstallerDemo 
              onComplete={(newName, newUrl) => {
                const nextSettings = {
                  ...siteSettings,
                  siteName: newName,
                  title: `${newName} | Professional Online PDF Software`,
                  siteUrl: newUrl
                };
                setSiteSettings(nextSettings);
                updateSiteSettings(nextSettings);
                navigateTab('home');
              }}
            />
          )}
        </main>
      </div>

      <Footer 
        settings={siteSettings} 
        ads={adsList} 
        pages={pagesList}
        onClickPage={(page) => navigateTab('page', { page })}
        footerMenu={footerMenu}
        onClickMenuItem={handleMenuItemClick}
      />

      {/* Floating feedback system */}
      <FeedbackWidget />

      {/* Global Footer Inject display logs */}
      {siteSettings.customCodeFooter && (
        <div dangerouslySetInnerHTML={{ __html: siteSettings.customCodeFooter }} />
      )}
    </div>
  );
}

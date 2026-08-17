import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ToggleLeft, ToggleRight, Newspaper, 
  MessageSquare, Sliders, Code, LayoutGrid, FileCheck, CheckCircle2, 
  Plus, Trash2, Edit2, ShieldCheck, RefreshCw, BarChart2, Download,
  Files, FileText, Menu as MenuIcon, ArrowUp, ArrowDown, ExternalLink, Link,
  UploadCloud, HelpCircle, Tags, Layers, Lock, FilePenLine, Sparkles, Database, User
} from 'lucide-react';
import { PdfTool, BlogPost, AdSpot, SiteSettings, UsageMetric, CustomPage, MenuItem, FaqItem, CategoryItem } from '../types';

interface AdminPanelProps {
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  tools: PdfTool[];
  onToggleTool: (toolId: string, active: boolean) => void;
  onSaveTool?: (updatedTool: PdfTool) => void;
  blogs: BlogPost[];
  onSaveBlog: (blog: Partial<BlogPost>) => void;
  onDeleteBlog: (id: string) => void;
  ads: AdSpot[];
  onUpdateAds: (updatedAds: AdSpot[]) => void;
  pages: CustomPage[];
  onSavePage: (page: Partial<CustomPage>) => void;
  onDeletePage: (id: string) => void;
  headerMenu: MenuItem[];
  onSaveHeaderMenu: (menu: MenuItem[]) => void;
  footerMenu: MenuItem[];
  onSaveFooterMenu: (menu: MenuItem[]) => void;
  faqs?: FaqItem[];
  onSaveFaq?: (faq: Partial<FaqItem>) => void;
  onDeleteFaq?: (id: string) => void;
  onReorderFaqs?: (reordered: FaqItem[]) => void;
  categories?: CategoryItem[];
  onSaveCategory?: (cat: CategoryItem) => void;
  onDeleteCategory?: (id: string) => void;
  onLogout?: () => void;
}

export default function AdminPanel({
  settings,
  onUpdateSettings,
  tools,
  onToggleTool,
  onSaveTool,
  blogs,
  onSaveBlog,
  onDeleteBlog,
  ads,
  onUpdateAds,
  pages,
  onSavePage,
  onDeletePage,
  headerMenu,
  onSaveHeaderMenu,
  footerMenu,
  onSaveFooterMenu,
  faqs = [],
  onSaveFaq,
  onDeleteFaq,
  onReorderFaqs,
  categories = [],
  onSaveCategory,
  onDeleteCategory,
  onLogout,
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'tools' | 'categories' | 'blogs' | 'pages' | 'menus' | 'ads' | 'settings' | 'faqs' | 'admin_manager'>('dashboard');
  
  // Pages Manager State
  const [pagesSubTab, setPagesSubTab] = useState<'manage' | 'add' | 'edit'>('manage');
  const [editingPage, setEditingPage] = useState<Partial<CustomPage> | null>(null);

  // FAQ Manager State
  const [editingFaq, setEditingFaq] = useState<Partial<FaqItem> | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  // Category Manager State
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [catId, setCatId] = useState('');
  const [catLabel, setCatLabel] = useState('');
  const [catIcon, setCatIcon] = useState('Layers');
  const [catDescription, setCatDescription] = useState('');
  const [catActive, setCatActive] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  
  // Settings Form State
  const [siteName, setSiteName] = useState(settings.siteName);
  const [siteUrl, setSiteUrl] = useState(settings.siteUrl);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [logo, setLogo] = useState(settings.logo || '');
  const [favicon, setFavicon] = useState(settings.favicon || '');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUri = event.target?.result as string;
        try {
          const res = await fetch('/api/storage/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: file.name, dataUri })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              setLogo(data.url);
              setUploadingLogo(false);
              return;
            }
          }
        } catch (uploadErr) {
          console.warn("Backend upload failed, utilizing Base64 data string instead.", uploadErr);
        }
        setLogo(dataUri);
        setUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploadingLogo(false);
    }
  };

  const handleFaviconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFavicon(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUri = event.target?.result as string;
        try {
          const res = await fetch('/api/storage/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: file.name, dataUri })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              setFavicon(data.url);
              setUploadingFavicon(false);
              return;
            }
          }
        } catch (uploadErr) {
          console.warn("Backend upload failed, utilizing Base64 data string instead.", uploadErr);
        }
        setFavicon(dataUri);
        setUploadingFavicon(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploadingFavicon(false);
    }
  };

  const [title, setTitle] = useState(settings.title);
  const [description, setDescription] = useState(settings.description);
  const [keywords, setKeywords] = useState(settings.keywords);
  const [analyticsId, setAnalyticsId] = useState(settings.analyticsId);
  const [customHeader, setCustomHeader] = useState(settings.customCodeHeader);
  const [customBody, setCustomBody] = useState(settings.customCodeBody);
  const [customFooter, setCustomFooter] = useState(settings.customCodeFooter);
  const [footerAboutText, setFooterAboutText] = useState(settings.footerAboutText || '');
  const [footerPrivacyText, setFooterPrivacyText] = useState(settings.footerPrivacyText || '');
  const [footerCopyrightText, setFooterCopyrightText] = useState(settings.footerCopyrightText || '');
  
  // Dynamic Homepage Content State
  const [homeBadge, setHomeBadge] = useState(settings.homeBadge || '');
  const [homeHeading, setHomeHeading] = useState(settings.homeHeading || '');
  const [homeSubheading, setHomeSubheading] = useState(settings.homeSubheading || '');

  // Admin Manager State
  const [adminUsername, setAdminUsername] = useState(settings.adminUsername || 'admin');
  const [adminEmail, setAdminEmail] = useState(settings.adminEmail || 'admin@your-domain.com');
  const [adminPassword, setAdminPassword] = useState(settings.adminPassword || 'admin123');
  const [adminManagerSuccess, setAdminManagerSuccess] = useState('');

  // Blog Editor State
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [isBlogNew, setIsBlogNew] = useState(false);

  // Tool Editor State
  const [editingTool, setEditingTool] = useState<PdfTool | null>(null);
  const [isAddingTool, setIsAddingTool] = useState(false);
  const [newTool, setNewTool] = useState<PdfTool>({
    id: '',
    name: '',
    description: '',
    category: 'organize',
    icon: 'FileCode',
    isActive: true,
    requiresFile: true,
    acceptMimes: 'application/pdf',
    code: ''
  });

  // Ads spot textareas State
  const [localAds, setLocalAds] = useState<AdSpot[]>([...ads]);

  // Analytics Metrics State
  const [usageStats, setUsageStats] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    setLocalAds([...ads]);
  }, [ads]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const json = await res.json();
        setUsageStats(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SiteSettings = {
      siteName,
      siteUrl,
      timezone,
      logo,
      favicon,
      title,
      description,
      keywords,
      analyticsId,
      customCodeHeader: customHeader,
      customCodeBody: customBody,
      customCodeFooter: customFooter,
      footerAboutText,
      footerPrivacyText,
      footerCopyrightText,
      homeBadge,
      homeHeading,
      homeSubheading,
      adminUsername,
      adminEmail,
      adminPassword,
    };
    onUpdateSettings(payload);
  };

  const handleSaveAdminManager = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SiteSettings = {
      siteName,
      siteUrl,
      timezone,
      logo,
      favicon,
      title,
      description,
      keywords,
      analyticsId,
      customCodeHeader: customHeader,
      customCodeBody: customBody,
      customCodeFooter: customFooter,
      footerAboutText,
      footerPrivacyText,
      footerCopyrightText,
      homeBadge,
      homeHeading,
      homeSubheading,
      adminUsername,
      adminEmail,
      adminPassword,
    };
    onUpdateSettings(payload);
    setAdminManagerSuccess('Admin login information updated successfully! These credentials are now required for administrative panels.');
    setTimeout(() => {
      setAdminManagerSuccess('');
    }, 6000);
  };

  const handleSaveBlogForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlog) {
      onSaveBlog(editingBlog);
      setEditingBlog(null);
    }
  };

  const handleToggleLocalAd = (id: string, active: boolean) => {
    const updated = localAds.map(ad => ad.id === id ? { ...ad, active } : ad);
    setLocalAds(updated);
    onUpdateAds(updated);
  };

  const handleEditAdCode = (id: string, code: string) => {
    const updated = localAds.map(ad => ad.id === id ? { ...ad, code } : ad);
    setLocalAds(updated);
  };

  const handleSaveAdCode = () => {
    onUpdateAds(localAds);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    if (onSaveFaq) {
      if (editingFaq) {
        onSaveFaq({
          id: editingFaq.id,
          question: faqQuestion,
          answer: faqAnswer,
          order: editingFaq.order
        });
      } else {
        onSaveFaq({
          question: faqQuestion,
          answer: faqAnswer
        });
      }
    }
    // RESET
    setEditingFaq(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setIsAddingFaq(false);
  };

  const handleStartEditFaq = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setIsAddingFaq(true);
  };

  const handleCancelFaqEdit = () => {
    setEditingFaq(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setIsAddingFaq(false);
  };

  const handleMoveFaqUp = (index: number) => {
    if (index === 0 || !onReorderFaqs) return;
    const reordered = [...faqs];
    const temp = reordered[index];
    reordered[index] = reordered[index - 1];
    reordered[index - 1] = temp;
    const updated = reordered.map((f, i) => ({ ...f, order: i + 1 }));
    onReorderFaqs(updated);
  };

  const handleMoveFaqDown = (index: number) => {
    if (index === faqs.length - 1 || !onReorderFaqs) return;
    const reordered = [...faqs];
    const temp = reordered[index];
    reordered[index] = reordered[index + 1];
    reordered[index + 1] = temp;
    const updated = reordered.map((f, i) => ({ ...f, order: i + 1 }));
    onReorderFaqs(updated);
  };

  // Compute stats totals
  const totalProcessed = usageStats.reduce((acc, curr) => acc + curr.totalCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Visual Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
            <Sliders className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-sans font-extrabold text-2xl text-slate-800">Admin Workspace</h1>
            <p className="font-sans text-xs text-slate-500">Configure global configurations, advertisements, blogging guidelines, and export code standards.</p>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="self-start sm:self-center inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs hover:text-slate-950 transition cursor-pointer"
            id="admin-logout-btn"
          >
            <Lock className="h-3.5 w-3.5 text-slate-550" />
            <span>Secure Log Out</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sub-navigation Controls */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Usage Analytics', icon: BarChart2 },
            { id: 'tools', label: 'Tools Manager', icon: LayoutGrid },
            { id: 'categories', label: 'Tools Category', icon: Tags },
            { id: 'blogs', label: 'Blog & Articles Manager', icon: Newspaper },
            { id: 'pages', label: 'Pages & Layouts', icon: Files },
            { id: 'menus', label: 'Header & Footer Menus', icon: MenuIcon },
            { id: 'ads', label: 'Ad-Banner Injector', icon: Code },
            { id: 'settings', label: 'SEO & Site Configs', icon: Sliders },
            { id: 'faqs', label: 'FAQ Section Manager', icon: HelpCircle },
            { id: 'admin_manager', label: 'Admin Manager', icon: User },
          ].map(it => {
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                onClick={() => setActiveSubTab(it.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeSubTab === it.id
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'
                }`}
                id={`admin-tab-btn-${it.id}`}
              >
                <Icon className="h-4 w-4" />
                <span>{it.label}</span>
              </button>
            );
          })}
        </div>

        {/* RIGHT SIDEBAR: Action Panel Contents */}
        <div className="lg:col-span-3">
          {/* ANALYTICS PANEL */}
          {activeSubTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Premium Source ZIP Download Card */}
              <div id="laravel-zip-download-banner" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-left">
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-200">
                    <Database className="h-3 w-3" />
                    <span>Complete PHP Laravel CMS Bundle Included</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight leading-snug">
                    Download Finished Source Code Package
                  </h3>
                  <p className="text-xs text-blue-100 leading-relaxed max-w-xl">
                    Get the production-ready <strong>Laravel PDF Pro Tools CMS</strong> source script, including full routing parameters, database schema migrations, customizable web layouts, modern Blade templates, secure controllers, 16 ads segments manager, and dynamic SEO modules.
                  </p>
                </div>
                <a 
                  href="/api/download-laravel-zip" 
                  download 
                  className="shrink-0 flex items-center space-x-2.5 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 px-6 py-3.5 rounded-xl text-xs font-extrabold shadow-md transition-all duration-300 transform hover:scale-[1.03] cursor-pointer"
                  id="btn-download-laravel-cms"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>Download CMS ZIP</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Total Combined Files</span>
                  <span className="text-4xl font-mono font-black text-slate-900">{totalProcessed}</span>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Loaded PDF Tools</span>
                  <span className="text-4xl font-mono font-black text-red-500">{tools.length}</span>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Active Articles</span>
                  <span className="text-4xl font-mono font-black text-indigo-500">{blogs.length}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
                  <h3 className="text-sm font-bold text-slate-800">Tool Processing Statistics</h3>
                  <button 
                    onClick={fetchStats}
                    className="p-1 text-slate-400 hover:text-slate-600"
                    title="Refresh data"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {usageStats.map(stat => (
                    <div key={stat.toolId} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl transition-all">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800">{stat.toolName}</span>
                        <span className="text-[10px] font-mono text-slate-400 block">{stat.toolId}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (stat.totalCount / (totalProcessed || 1)) * 100)}%` }} 
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-700">{stat.totalCount} times</span>
                      </div>
                    </div>
                  ))}
                  {usageStats.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No tool uploads recorded in database yet! Go test the conversion pages.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SAAS TOOLS MANAGER */}
          {activeSubTab === 'tools' && (
            editingTool ? (
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Edit Tool: {editingTool.name}</h3>
                    <p className="text-xs text-slate-400">Modify properties, category designations, restrictions and operational switches.</p>
                  </div>
                  <button
                    onClick={() => setEditingTool(null)}
                    type="button"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold border-none cursor-pointer"
                  >
                    Back to List
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (onSaveTool) {
                    onSaveTool(editingTool);
                  }
                  setEditingTool(null);
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Tool ID (Read Only)</label>
                      <input
                        type="text"
                        disabled
                        value={editingTool.id}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Tool Title / Name</label>
                      <input
                        type="text"
                        required
                        value={editingTool.name}
                        onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Tool Description / Subtitle</label>
                    <textarea
                      rows={2}
                      required
                      value={editingTool.description}
                      onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Operational Category</label>
                      <select
                        value={editingTool.category}
                        onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value as any })}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Lucide/UI Icon Identifier</label>
                      <input
                        type="text"
                        required
                        value={editingTool.icon}
                        onChange={(e) => setEditingTool({ ...editingTool, icon: e.target.value })}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Allowed File Drop Mimings / Extensions</label>
                      <input
                        type="text"
                        placeholder="e.g. application/pdf, .docx, .xlsx"
                        value={editingTool.acceptMimes || ''}
                        onChange={(e) => setEditingTool({ ...editingTool, acceptMimes: e.target.value })}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center space-x-6 h-full pt-4 md:pt-0">
                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editingTool.requiresFile}
                          onChange={(e) => setEditingTool({ ...editingTool, requiresFile: e.target.checked })}
                          className="rounded border-slate-300 text-red-550 focus:ring-red-500 h-4 w-4"
                        />
                        <span className="text-xs font-semibold text-slate-600">Requires Drag & Drop File Uploads</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editingTool.isActive}
                          onChange={(e) => setEditingTool({ ...editingTool, isActive: e.target.checked })}
                          className="rounded border-slate-300 text-red-550 focus:ring-red-500 h-4 w-4"
                        />
                        <span className="text-xs font-semibold text-slate-600">Tool Module is Active</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Tools Code (HTML / JavaScript Layout Custom Code Extension)</label>
                    <textarea
                      rows={6}
                      placeholder="e.g. <div class='text-center p-6 bg-red-50 border border-red-100 rounded-xl'><h1 class='text-red-650 font-bold'>Custom Workspace Active!</h1></div>"
                      value={editingTool.code || ''}
                      onChange={(e) => setEditingTool({ ...editingTool, code: e.target.value })}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingTool(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl border-none cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl border-none cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            ) : isAddingTool ? (
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Add New Tool (Upload Code)</h3>
                    <p className="text-xs text-slate-400">Specify metadata details and operational custom code sequence for the brand new SaaS tool.</p>
                  </div>
                  <button
                    onClick={() => setIsAddingTool(false)}
                    type="button"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold border-none cursor-pointer"
                  >
                    Back to List
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newTool.id) {
                    return;
                  }
                  if (onSaveTool) {
                    onSaveTool(newTool);
                  }
                  setIsAddingTool(false);
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Tool ID</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. custom-editor-tool"
                        value={newTool.id}
                        onChange={(e) => setNewTool({ ...newTool, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-') })}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Tool Title / Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. My Custom Tool"
                        value={newTool.name}
                        onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Tool Description / Subtitle</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Enter a brief, crisp description of the tool's core actions"
                      value={newTool.description}
                      onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Operational Category</label>
                      <select
                        value={newTool.category}
                        onChange={(e) => setNewTool({ ...newTool, category: e.target.value as any })}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Lucide/UI Icon Identifier</label>
                      <input
                        type="text"
                        required
                        placeholder="FileCode, Layers, Play, Settings, etc."
                        value={newTool.icon}
                        onChange={(e) => setNewTool({ ...newTool, icon: e.target.value })}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Allowed File Drop Mimings / Extensions</label>
                      <input
                        type="text"
                        placeholder="e.g. application/pdf, .docx, .xlsx"
                        value={newTool.acceptMimes || ''}
                        onChange={(e) => setNewTool({ ...newTool, acceptMimes: e.target.value })}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center space-x-6 h-full pt-4 md:pt-0">
                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newTool.requiresFile}
                          onChange={(e) => setNewTool({ ...newTool, requiresFile: e.target.checked })}
                          className="rounded border-slate-300 text-red-550 focus:ring-red-500 h-4 w-4"
                        />
                        <span className="text-xs font-semibold text-slate-600">Requires Drag & Drop File Uploads</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newTool.isActive}
                          onChange={(e) => setNewTool({ ...newTool, isActive: e.target.checked })}
                          className="rounded border-slate-300 text-red-550 focus:ring-red-500 h-4 w-4"
                        />
                        <span className="text-xs font-semibold text-slate-600">Tool Module is Active</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1 font-mono uppercase tracking-widest text-red-600">Tools Code (Executable Interactive Sandbox/Markup)</label>
                    <textarea
                      rows={8}
                      required
                      placeholder="e.g. <div class='text-center p-6 bg-red-50 border border-red-100 rounded-xl'><h1 class='text-red-650 font-bold'>Custom Workspace Active!</h1></div>"
                      value={newTool.code || ''}
                      onChange={(e) => setNewTool({ ...newTool, code: e.target.value })}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddingTool(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl border-none cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl border-none cursor-pointer"
                    >
                      Upload & Add Tool
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">Configure Toolbox Modules</h3>
                    <p className="text-xs text-slate-400">Toggled tools instantly update landing zones, preventing access block routes or SEO mismatches.</p>
                  </div>
                  <button
                    onClick={() => {
                      setNewTool({
                        id: '',
                        name: '',
                        description: '',
                        category: 'organize',
                        icon: 'FileCode',
                        isActive: true,
                        requiresFile: true,
                        acceptMimes: 'application/pdf',
                        code: ''
                      });
                      setIsAddingTool(true);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-colors shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Tools / Upload Code</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tools.map(tool => (
                    <div key={tool.id} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="space-y-0.5 max-w-[60%]">
                        <span className="text-xs font-bold text-slate-700 block truncate">{tool.name}</span>
                        <span className="text-[9px] bg-red-100 text-red-600 border border-red-200/50 rounded px-1.5 py-0.5 font-mono uppercase font-bold inline-block mb-1">{tool.category}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{tool.description}</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* Edit Button */}
                        <button
                          onClick={() => setEditingTool(tool)}
                          className="p-1.5 bg-white text-slate-600 hover:text-red-500 rounded-lg shadow-sm border border-slate-100 cursor-pointer"
                          title="Edit tool configuration"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => onToggleTool(tool.id, !tool.isActive)}
                          className="cursor-pointer"
                          id={`tool-toggle-${tool.id}`}
                        >
                          {tool.isActive ? (
                            <ToggleRight className="h-7 w-7 text-green-500" />
                          ) : (
                            <ToggleLeft className="h-7 w-7 text-slate-300" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* TOOLS CATEGORY MANAGER */}
          {activeSubTab === 'categories' && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
              {(!editingCategory && !isAddingCategory) ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="font-sans font-bold text-lg text-slate-800">Tools Category Manager</h2>
                      <p className="font-sans text-xs text-slate-500">Add, edit, or delete the categories that organize your PDF power-tools on the landing grid.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setCatId('');
                        setCatLabel('');
                        setCatIcon('Layers');
                        setCatDescription('');
                        setCatActive(true);
                        setIsAddingCategory(true);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow transition-all cursor-pointer"
                      id="add-category-btn"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New Category</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                          <th className="py-3 px-4">Icon & Name</th>
                          <th className="py-3 px-4">Slug / ID</th>
                          <th className="py-3 px-4">Slogan & Description</th>
                          <th className="py-3 px-4 text-center">Associated Tools</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat) => {
                          const associatedTools = tools.filter(t => t.category === cat.id);
                          const iconMapping: { [key: string]: any } = {
                            'Layers': Layers,
                            'ShieldCheck': ShieldCheck,
                            'Lock': Lock,
                            'FilePenLine': FilePenLine,
                            'Sparkles': Sparkles,
                            'ArrowDown': ArrowDown,
                            'ExternalLink': ExternalLink,
                          };
                          const IconComponent = iconMapping[cat.icon] || Tags;
                          
                          return (
                            <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors" id={`cat-row-${cat.id}`}>
                              <td className="py-4 px-4 font-semibold text-slate-700 flex items-center space-x-2.5">
                                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600">
                                  <IconComponent className="h-4 w-4 text-slate-600" />
                                </div>
                                <span className="font-bold text-[13px]">{cat.label}</span>
                              </td>
                              <td className="py-4 px-4 font-mono text-slate-500 font-medium">
                                {cat.id}
                              </td>
                              <td className="py-4 px-4 text-slate-500 max-w-xs truncate">
                                {cat.description || <span className="italic text-slate-400">No description...</span>}
                              </td>
                              <td className="py-4 px-4 text-center font-bold text-slate-600 text-[13px]">
                                {associatedTools.length}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  cat.active ? 'bg-green-100 text-green-700 border border-thin border-green-200' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {cat.active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex justify-end items-center space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingCategory(cat);
                                      setCatId(cat.id);
                                      setCatLabel(cat.label);
                                      setCatIcon(cat.icon || 'Layers');
                                      setCatDescription(cat.description || '');
                                      setCatActive(cat.active ?? true);
                                      setIsAddingCategory(false);
                                    }}
                                    className="p-1 px-2.5 py-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold border border-transparent hover:border-blue-100 hover:bg-blue-50/50 rounded-lg transition-all cursor-pointer flex items-center space-x-1"
                                    id={`edit-cat-${cat.id}`}
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (associatedTools.length > 0) {
                                        alert(`Notice: Cannot remove category "${cat.label}" because there are ${associatedTools.length} tools registered under it (e.g. "${associatedTools[0].name}"). Please re-assign those tools in the Tools Manager before removing this category.`);
                                      } else {
                                        if (confirm(`Are you sure you want to permanently delete category "${cat.label}"? This action cannot be undone.`)) {
                                          onDeleteCategory && onDeleteCategory(cat.id);
                                        }
                                      }
                                    }}
                                    className="p-1 px-2.5 py-1 text-[11px] text-rose-600 hover:text-rose-800 font-semibold border border-transparent hover:border-rose-100 hover:bg-rose-50/50 rounded-lg transition-all cursor-pointer flex items-center space-x-1"
                                    id={`delete-cat-${cat.id}`}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                // Add / Edit Form Overlay
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="font-sans font-bold text-lg text-slate-800">
                        {isAddingCategory ? 'Create New Category' : 'Modify Category Parameters'}
                      </h2>
                      <p className="font-sans text-xs text-slate-400">Ensure the configurations matches corresponding database routing rules.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAddingCategory(false);
                        setEditingCategory(null);
                      }}
                      className="text-slate-450 hover:text-slate-700 bg-transparent border-none cursor-pointer text-xs font-semibold"
                    >
                      &larr; Cancel and Return to List
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!catId.trim() || !catLabel.trim()) {
                      alert('Slug/ID and Category Name are required fields.');
                      return;
                    }
                    const cleanId = catId.toLowerCase().replace(/[^a-z0-9_-]+/g, '');
                    if (!cleanId) {
                      alert('ID contains invalid characters.');
                      return;
                    }
                    if (onSaveCategory) {
                      onSaveCategory({
                        id: cleanId,
                        label: catLabel,
                        icon: catIcon,
                        active: catActive,
                        description: catDescription,
                      });
                    }
                    setIsAddingCategory(false);
                    setEditingCategory(null);
                  }} className="space-y-4 max-w-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category ID / Slug</label>
                        <input
                          type="text"
                          value={catId}
                          onChange={(e) => setCatId(e.target.value)}
                          disabled={!isAddingCategory}
                          placeholder="e.g. ai-advanced"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-500 disabled:opacity-60 disabled:cursor-not-allowed"
                          id="cat-form-id-input"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Unique alphanumeric string used for routing filters. Cannot be changed once created.</p>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category Label / Name</label>
                        <input
                          type="text"
                          value={catLabel}
                          onChange={(e) => setCatLabel(e.target.value)}
                          placeholder="e.g. AI & Advanced"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-500"
                          id="cat-form-title-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Aesthetic Hero Icon</label>
                        <select
                          value={catIcon}
                          onChange={(e) => setCatIcon(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-500 cursor-pointer"
                          id="cat-form-icon-select"
                        >
                          <option value="Layers">Layers (Organize)</option>
                          <option value="ShieldCheck">ShieldCheck (Optimize)</option>
                          <option value="Lock">Lock (Security)</option>
                          <option value="FilePenLine">FilePenLine (Edit)</option>
                          <option value="Sparkles">Sparkles (AI)</option>
                          <option value="ArrowDown">ArrowDown (Inbound/To)</option>
                          <option value="ExternalLink">ExternalLink (Outbound/From)</option>
                          <option value="Tags">Tags (General/Other)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Aesthetic Visibility Status</label>
                        <div className="flex items-center space-x-3 h-10 mt-1">
                          <button
                            type="button"
                            onClick={() => setCatActive(!catActive)}
                            className="bg-transparent border-none cursor-pointer"
                            id="cat-form-active-toggle"
                          >
                            {catActive ? (
                              <ToggleRight className="h-8 w-8 text-green-500" />
                            ) : (
                              <ToggleLeft className="h-8 w-8 text-slate-300" />
                            )}
                          </button>
                          <span className="text-xs text-slate-600 font-semibold">{catActive ? 'Active and listed on homepage bar' : 'Suspended / Hidden'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Slogan / Suffix Description</label>
                      <textarea
                        value={catDescription}
                        onChange={(e) => setCatDescription(e.target.value)}
                        placeholder="e.g. Merge, split, rotate, and manage PDF page matrices."
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-500 resize-none"
                        id="cat-form-desc-textarea"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCategory(false);
                          setEditingCategory(null);
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-sans text-xs font-semibold cursor-pointer transition-all border-none"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl font-sans text-xs font-semibold cursor-pointer shadow transition-all border-none flex items-center space-x-1"
                        id="cat-form-save-submit"
                      >
                        <FileCheck className="h-4 w-4" />
                        <span>Save Category</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* BLOG & GUIDES MANAGER */}
          {activeSubTab === 'blogs' && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
              {!editingBlog ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Visual Blogging Base</h3>
                      <p className="text-xs text-slate-400">Increase ranking vectors through helpful SEO guides.</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsBlogNew(true);
                        setEditingBlog({ title: '', summary: '', content: '' });
                      }}
                      className="inline-flex items-center space-x-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-all border-none"
                      id="add-blog-btn"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Write Article</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {blogs.map(b => (
                      <div key={b.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{b.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">slug: /{b.slug}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setIsBlogNew(false);
                              setEditingBlog(b);
                            }}
                            className="p-2 bg-white text-slate-600 hover:text-indigo-500 rounded-lg shadow-sm border border-slate-100 cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          
                          <button
                            onClick={() => onDeleteBlog(b.id)}
                            className="p-2 bg-white text-slate-600 hover:text-red-500 rounded-lg shadow-sm border border-slate-100 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <form onSubmit={handleSaveBlogForm} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Article Title</label>
                    <input
                      type="text"
                      required
                      value={editingBlog.title || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Executive Summary</label>
                    <input
                      type="text"
                      required
                      value={editingBlog.summary || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, summary: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Markdown Body Content</label>
                    <textarea
                      required
                      rows={8}
                      value={editingBlog.content || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">SEO Title</label>
                      <input
                        type="text"
                        value={editingBlog.seo_title || ''}
                        onChange={(e) => setEditingBlog({ ...editingBlog, seo_title: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">SEO Keywords</label>
                      <input
                        type="text"
                        value={editingBlog.seo_keywords || ''}
                        onChange={(e) => setEditingBlog({ ...editingBlog, seo_keywords: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingBlog(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl border-none cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl border-none cursor-pointer"
                    >
                      Save Article
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* PAGES & CONTENT MANAGER */}
          {activeSubTab === 'pages' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Custom Page & Layout Manager</h3>
                  <p className="text-xs text-slate-400">Add, manage, and edit custom text pages (about, privacy, custom terms) dynamically.</p>
                </div>
                
                {/* Pages Tab Selector */}
                <div className="flex space-x-1 mt-4 sm:mt-0 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => {
                      setPagesSubTab('manage');
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all ${
                      pagesSubTab === 'manage'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    id="admin-pages-manage-tab"
                  >
                    Manage Pages
                  </button>
                  <button
                    onClick={() => {
                      setPagesSubTab('add');
                      setEditingPage({ title: '', slug: '', content: '', isActive: true, seoTitle: '', seoDescription: '', seoKeywords: '' });
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all ${
                      pagesSubTab === 'add'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    id="admin-pages-add-tab"
                  >
                    Add Page
                  </button>
                  <button
                    onClick={() => {
                      setPagesSubTab('edit');
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all ${
                      pagesSubTab === 'edit'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    disabled={!editingPage?.id}
                    title={!editingPage?.id ? "Please select a page to edit from the list first" : ""}
                    id="admin-pages-edit-tab"
                  >
                    Edit Page
                  </button>
                </div>
              </div>

              {/* MANAGE PAGES VIEW */}
              {pagesSubTab === 'manage' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg text-slate-500 text-xs font-semibold">
                    <span className="w-1/3 text-left">PAGE TITLE & SLUG</span>
                    <span className="w-1/4 text-center">STATUS</span>
                    <span className="w-1/4 text-center">CREATED</span>
                    <span className="w-1/6 text-right">ACTIONS</span>
                  </div>

                  {pages.map(page => (
                    <div key={page.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                      <div className="w-1/3 space-y-0.5 text-left">
                        <span className="text-xs font-bold text-slate-800 block">{page.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">slug: /{page.slug}</span>
                      </div>

                      <div className="w-1/4 text-center">
                        <button
                          onClick={() => onSavePage({ ...page, isActive: !page.isActive })}
                          className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            page.isActive 
                              ? 'bg-green-50 text-green-600 border border-green-100'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {page.isActive ? 'Active' : 'Draft'}
                        </button>
                      </div>

                      <div className="w-1/4 text-center text-xs text-slate-400">
                        {new Date(page.createdAt || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>

                      <div className="w-1/6 flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingPage(page);
                            setPagesSubTab('edit');
                          }}
                          className="p-2 bg-slate-50 text-slate-600 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg shadow-sm border border-slate-100 cursor-pointer transition-all"
                          title="Edit page"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the "${page.title}" page?`)) {
                              onDeletePage(page.id);
                              if (editingPage?.id === page.id) {
                                setEditingPage(null);
                              }
                            }
                          }}
                          className="p-2 bg-slate-50 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg shadow-sm border border-slate-100 cursor-pointer transition-all"
                          title="Delete page"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {pages.length === 0 && (
                    <div className="text-center py-12 text-slate-400 text-xs text-[#94a3b8]">
                      No custom pages found. Click "Add Page" to create your first page!
                    </div>
                  )}
                </div>
              )}

              {/* ADD PAGE VIEW */}
              {pagesSubTab === 'add' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingPage) {
                      onSavePage(editingPage);
                      setPagesSubTab('manage');
                      setEditingPage(null);
                    }
                  }}
                  className="space-y-4"
                  id="add-page-form"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="text-left">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Page Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Terms of Service"
                        value={editingPage?.title || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                          setEditingPage({ 
                            ...editingPage, 
                            title: val, 
                            slug, 
                            seoTitle: `${val} | ${settings.siteName}` 
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="text-left">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Custom Slug (URL path)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. terms-of-service"
                        value={editingPage?.slug || ''}
                        onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="text-left">
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Page Content (Markdown / Text supported)</label>
                    <textarea
                      required
                      placeholder="Write your beautiful page layout, details, or terms here..."
                      rows={10}
                      value={editingPage?.content || ''}
                      onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-red-500 font-sans"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="add-page-active"
                      checked={editingPage?.isActive ?? true}
                      onChange={(e) => setEditingPage({ ...editingPage, isActive: e.target.checked })}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500 h-3.5 w-3.5"
                    />
                    <label htmlFor="add-page-active" className="text-xs text-slate-600 font-medium cursor-pointer select-none">Publish Page (Make visible on site footer / menus)</label>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl space-y-4">
                    <span className="text-xs font-bold text-slate-700 block mb-1 border-b border-slate-200 pb-1 text-left">Optional Search Engine Optimization (SEO) Metadata</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="text-left">
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">SEO Title Header</label>
                        <input
                          type="text"
                          placeholder="e.g. Privacy Guard | PDFProTools"
                          value={editingPage?.seoTitle || ''}
                          onChange={(e) => setEditingPage({ ...editingPage, seoTitle: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                        />
                      </div>
                      <div className="text-left">
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">SEO Keywords</label>
                        <input
                          type="text"
                          placeholder="privacy policy, safe conversion, secure file"
                          value={editingPage?.seoKeywords || ''}
                          onChange={(e) => setEditingPage({ ...editingPage, seoKeywords: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">SEO Description Meta</label>
                      <input
                        type="text"
                        placeholder="Military-grade end-to-end data safety charter details that power global PDF tools..."
                        value={editingPage?.seoDescription || ''}
                        onChange={(e) => setEditingPage({ ...editingPage, seoDescription: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setPagesSubTab('manage');
                        setEditingPage(null);
                      }}
                      className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl border-none cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer"
                    >
                      Save and Add Custom Page
                    </button>
                  </div>
                </form>
              )}

              {/* EDIT PAGE VIEW */}
              {pagesSubTab === 'edit' && (
                <>
                  {editingPage?.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (editingPage) {
                          onSavePage(editingPage);
                          setPagesSubTab('manage');
                          setEditingPage(null);
                        }
                      }}
                      className="space-y-4"
                      id="edit-page-form"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="text-left">
                          <label className="text-xs font-semibold text-slate-600 block mb-1">Page Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Terms of Service"
                            value={editingPage.title || ''}
                            onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-500"
                          />
                        </div>
                        <div className="text-left">
                          <label className="text-xs font-semibold text-slate-600 block mb-1">Custom Slug (URL path)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. terms-of-service"
                            value={editingPage.slug || ''}
                            onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-500 font-mono"
                          />
                        </div>
                      </div>

                      <div className="text-left">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Page Content (Markdown / Text supported)</label>
                        <textarea
                          required
                          placeholder="Write your beautiful page layout, details, or terms here..."
                          rows={10}
                          value={editingPage.content || ''}
                          onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-red-500 font-sans"
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="edit-page-active"
                          checked={editingPage.isActive ?? true}
                          onChange={(e) => setEditingPage({ ...editingPage, isActive: e.target.checked })}
                          className="rounded border-slate-300 text-red-600 focus:ring-red-500 h-3.5 w-3.5"
                        />
                        <label htmlFor="edit-page-active" className="text-xs text-slate-600 font-medium cursor-pointer select-none">Publish Page (Make visible on site footer / menus)</label>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl space-y-4">
                        <span className="text-xs font-bold text-slate-700 block mb-1 border-b border-slate-200 pb-1 text-left">Optional Search Engine Optimization (SEO) Metadata</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="text-left">
                            <label className="text-[11px] font-semibold text-slate-500 block mb-1">SEO Title Header</label>
                            <input
                              type="text"
                              value={editingPage.seoTitle || ''}
                              onChange={(e) => setEditingPage({ ...editingPage, seoTitle: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                          <div className="text-left">
                            <label className="text-[11px] font-semibold text-slate-500 block mb-1">SEO Keywords</label>
                            <input
                              type="text"
                              value={editingPage.seoKeywords || ''}
                              onChange={(e) => setEditingPage({ ...editingPage, seoKeywords: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="text-left">
                          <label className="text-[11px] font-semibold text-slate-500 block mb-1">SEO Description Meta</label>
                          <input
                            type="text"
                            value={editingPage.seoDescription || ''}
                            onChange={(e) => setEditingPage({ ...editingPage, seoDescription: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 font-sans">
                        <button
                          type="button"
                          onClick={() => {
                            setPagesSubTab('manage');
                            setEditingPage(null);
                          }}
                          className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl border-none cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer"
                        >
                          Save Page Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl">
                      <p className="text-slate-400 text-xs mb-4">No page selected to edit. Proceed to the Manage Pages tab and click the edit icon on any listing.</p>
                      <button
                        onClick={() => setPagesSubTab('manage')}
                        className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl border-none cursor-pointer hover:bg-slate-850"
                      >
                        Go to Manage Pages
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* HEADER & FOOTER NAVIGATION MENUS */}
          {activeSubTab === 'menus' && (
            <div className="space-y-8">
              {/* Header Menu Configuration */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Header Navigation Menu</h3>
                  <p className="text-xs text-slate-400">Configure public links appearing at the top sticky header section of PDFProTools.</p>
                </div>
                
                {/* List of current Header Menu Items */}
                <div className="space-y-2">
                  {headerMenu.length === 0 ? (
                    <div className="text-center p-6 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">No header menu links created yet.</div>
                  ) : (
                    [...headerMenu].sort((a,b) => a.order - b.order).map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <span className="text-[10px] bg-slate-900 text-white rounded px-2 py-0.5 font-mono uppercase font-bold">{item.type}</span>
                          <span className="text-xs font-bold text-slate-700">{item.label}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({item.value || '/'})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Reorder controls */}
                          <button
                            type="button"
                            onClick={() => {
                              if (idx === 0) return;
                              const updated = [...headerMenu].sort((a,b) => a.order - b.order);
                              const temp = updated[idx].order;
                              updated[idx].order = updated[idx-1].order;
                              updated[idx-1].order = temp;
                              onSaveHeaderMenu(updated);
                            }}
                            disabled={idx === 0}
                            className={`p-1.5 rounded bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer ${idx === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            <ArrowUp className="h-3 w-3 text-slate-500" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (idx === headerMenu.length - 1) return;
                              const updated = [...headerMenu].sort((a,b) => a.order - b.order);
                              const temp = updated[idx].order;
                              updated[idx].order = updated[idx+1].order;
                              updated[idx+1].order = temp;
                              onSaveHeaderMenu(updated);
                            }}
                            disabled={idx === headerMenu.length - 1}
                            className={`p-1.5 rounded bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer ${idx === headerMenu.length - 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            <ArrowDown className="h-3 w-3 text-slate-500" />
                          </button>
                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = headerMenu.filter(h => h.id !== item.id).map((h, i) => ({ ...h, order: i + 1 }));
                              onSaveHeaderMenu(updated);
                            }}
                            className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors cursor-pointer border border-transparent hover:border-red-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Form to Add New Header Item */}
                <MenuAdder pages={pages} onAdd={(newItem) => {
                  const nextOrder = headerMenu.length > 0 ? Math.max(...headerMenu.map(m => m.order)) + 1 : 1;
                  onSaveHeaderMenu([...headerMenu, { ...newItem, id: 'h_' + Date.now(), order: nextOrder }]);
                }} />
              </div>

              {/* Footer Menu Configuration */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Footer Navigation Menu</h3>
                  <p className="text-xs text-slate-400">Configure secondary redirect links appearing at bottom visual grid footer area.</p>
                </div>
                
                {/* List of current Footer Menu Items */}
                <div className="space-y-2">
                  {footerMenu.length === 0 ? (
                    <div className="text-center p-6 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">No footer menu links created yet.</div>
                  ) : (
                    [...footerMenu].sort((a,b) => a.order - b.order).map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <span className="text-[10px] bg-slate-900 text-white rounded px-2 py-0.5 font-mono uppercase font-bold">{item.type}</span>
                          <span className="text-xs font-bold text-slate-700">{item.label}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({item.value || '/'})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Reorder controls */}
                          <button
                            type="button"
                            onClick={() => {
                              if (idx === 0) return;
                              const updated = [...footerMenu].sort((a,b) => a.order - b.order);
                              const temp = updated[idx].order;
                              updated[idx].order = updated[idx-1].order;
                              updated[idx-1].order = temp;
                              onSaveFooterMenu(updated);
                            }}
                            disabled={idx === 0}
                            className={`p-1.5 rounded bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer ${idx === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            <ArrowUp className="h-3 w-3 text-slate-500" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (idx === footerMenu.length - 1) return;
                              const updated = [...footerMenu].sort((a,b) => a.order - b.order);
                              const temp = updated[idx].order;
                              updated[idx].order = updated[idx+1].order;
                              updated[idx+1].order = temp;
                              onSaveFooterMenu(updated);
                            }}
                            disabled={idx === footerMenu.length - 1}
                            className={`p-1.5 rounded bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer ${idx === footerMenu.length - 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            <ArrowDown className="h-3 w-3 text-slate-500" />
                          </button>
                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = footerMenu.filter(h => h.id !== item.id).map((h, i) => ({ ...h, order: i + 1 }));
                              onSaveFooterMenu(updated);
                            }}
                            className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors cursor-pointer border border-transparent hover:border-red-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Form to Add New Footer Item */}
                <MenuAdder pages={pages} onAdd={(newItem) => {
                  const nextOrder = footerMenu.length > 0 ? Math.max(...footerMenu.map(m => m.order)) + 1 : 1;
                  onSaveFooterMenu([...footerMenu, { ...newItem, id: 'f_' + Date.now(), order: nextOrder }]);
                }} />
              </div>
            </div>
          )}

          {/* AD SPOTS INJECTOR */}
          {activeSubTab === 'ads' && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Ad Unit Settings</h3>
                <p className="text-xs text-slate-400">Embed Adsense, Ezoic, or custom HTML advertisement slots easily across pages.</p>
              </div>

              <div className="space-y-6">
                {localAds.map(ad => (
                  <div key={ad.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{ad.name}</span>
                      <button
                        onClick={() => handleToggleLocalAd(ad.id, !ad.active)}
                        className="cursor-pointer"
                      >
                        {ad.active ? (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">● LIVE</span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">○ STOPPED</span>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={ad.code}
                      onChange={(e) => handleEditAdCode(ad.id, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[11px] font-mono text-slate-600"
                    />
                  </div>
                ))}

                <button
                  onClick={handleSaveAdCode}
                  className="px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl border-none cursor-pointer hover:shadow"
                >
                  Save Ad Configurations
                </button>
              </div>
            </div>
          )}

          {/* SEO & CONFIGS INJECTOR */}
          {activeSubTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Global Site configurations</h3>
                <p className="text-xs text-slate-400 mb-4">Set title tags, tracking tags and injected header codes.</p>
              </div>

              {/* AUTOMATIC CPANEL INSTALLER DOCUMENTATION REFERENCE */}
              <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl text-xs text-indigo-700 leading-relaxed space-y-3">
                <span className="font-bold flex items-center space-x-1.5 text-indigo-900">
                  <Database className="h-4.5 w-4.5 text-indigo-605" />
                  <span>cPanel Web Installer Protocol Primed</span>
                </span>
                <p className="text-[11px] text-indigo-650/90 leading-relaxed font-normal">
                  When you bundle this script and host it in your cPanel <code>public_html</code> directory, your administrators can seamlessly execute configurations—connecting database hosts, establishing table relationships, seeding 21 PDF SaaS conversion blocks, and writing standard <code>.env</code> settings flags—simply by navigating in their browser to:
                </p>
                <div className="bg-indigo-100/50 p-2 px-3 rounded-lg font-mono text-[11px] text-indigo-900 border border-indigo-100 max-w-sm flex items-center justify-between">
                  <span>https://your-domain.com/install</span>
                </div>
                <div className="pt-1.5">
                  <a 
                    href="/install" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState({ tab: 'install' }, '', '/install');
                      window.dispatchEvent(new Event('popstate'));
                    }}
                    className="inline-flex items-center space-x-1 bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl text-[10px] shadow transition cursor-pointer"
                  >
                    <span>Launch Interactive Installer Simulator &rarr;</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Site Brand Name</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Timezone Location</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* WEBSITE LOGO & FAVICON SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                {/* WEBSITE LOGO SECTION */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Website Logo</span>
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
                    {logo ? (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 block">Current Logo Preview</label>
                        <div className="flex items-center space-x-4 bg-white p-3 rounded-lg border border-slate-200">
                          <div className="h-12 w-24 bg-slate-100 rounded border border-slate-200/50 flex items-center justify-center overflow-hidden p-1">
                            {logo.startsWith('http') || logo.startsWith('data:') ? (
                              <img src={logo} alt="Site logo preview" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="text-xs font-bold font-sans text-slate-700">{logo}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono text-slate-500 block truncate" title={logo}>
                              {logo}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLogo('')}
                            className="p-1 px-2.5 text-[10px] bg-red-50 text-red-600 rounded hover:bg-red-100 border-none font-bold cursor-pointer transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-white border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center">
                        <UploadCloud className="h-6 w-6 text-slate-400 mb-1" />
                        <span className="text-[11px] font-medium text-slate-500">No logo uploaded. Using name brand fallback.</span>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <label className="relative flex-1">
                          <span className="w-full inline-flex items-center justify-center px-4 py-2 bg-slate-900 border border-slate-900 rounded-xl text-xs font-bold text-white cursor-pointer hover:bg-slate-800 transition-colors text-center">
                            {uploadingLogo ? 'Reading file...' : 'Choose Logo Image File'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            disabled={uploadingLogo}
                            className="hidden"
                          />
                        </label>
                        <span className="text-xs text-slate-400 font-medium">Or input URL:</span>
                      </div>
                      <input
                        type="text"
                        placeholder="https://example.com/logo.png or Base64 URI"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* WEBSITE FAVICON SECTION */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Website Favicon</span>
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
                    {favicon ? (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 block">Current Favicon Preview</label>
                        <div className="flex items-center space-x-4 bg-white p-3 rounded-lg border border-slate-200">
                          <div className="h-10 w-10 bg-slate-100 rounded border border-slate-200/50 flex items-center justify-center overflow-hidden p-1.5">
                            {favicon.startsWith('http') || favicon.startsWith('data:') ? (
                              <img src={favicon} alt="Site favicon preview" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                            ) : (
                              <FileCheck className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono text-slate-500 block truncate" title={favicon}>
                              {favicon}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFavicon('')}
                            className="p-1 px-2.5 text-[10px] bg-red-50 text-red-600 rounded hover:bg-red-100 border-none font-bold cursor-pointer transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-white border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center">
                        <UploadCloud className="h-6 w-6 text-slate-400 mb-1" />
                        <span className="text-[11px] font-medium text-slate-500">No favicon uploaded. Using default file icon.</span>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <label className="relative flex-1">
                          <span className="w-full inline-flex items-center justify-center px-4 py-2 bg-slate-900 border border-slate-900 rounded-xl text-xs font-bold text-white cursor-pointer hover:bg-slate-800 transition-colors text-center">
                            {uploadingFavicon ? 'Reading file...' : 'Choose Favicon File'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFaviconChange}
                            disabled={uploadingFavicon}
                            className="hidden"
                          />
                        </label>
                        <span className="text-xs text-slate-400 font-medium">Or input URL:</span>
                      </div>
                      <input
                        type="text"
                        placeholder="https://example.com/favicon.png or Base64 URI"
                        value={favicon}
                        onChange={(e) => setFavicon(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* HOMEPAGE CONTENT SECTION */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Homepage Content Section</span>
                <p className="text-[11px] text-slate-400 -mt-2">Customize the hero sections, main labels, badges, and headings of your home page dynamically.</p>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Homepage Promo Badge Text</label>
                    <input
                      type="text"
                      value={homeBadge}
                      onChange={(e) => setHomeBadge(e.target.value)}
                      placeholder="e.g. Professional-Grade Multi-tool Suite"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500 animate-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Homepage Hero Main Heading (HTML tags supported, e.g. <span className="text-red-600">&lt;span class="text-red-605"&gt;red text&lt;/span&gt;</span>)</label>
                    <input
                      type="text"
                      value={homeHeading}
                      onChange={(e) => setHomeHeading(e.target.value)}
                      placeholder='e.g. Every PDF Tool You Need, <span class="text-red-600">at your fingertips</span>'
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Homepage Hero Description Subheading</label>
                    <textarea
                      rows={3}
                      value={homeSubheading}
                      onChange={(e) => setHomeSubheading(e.target.value)}
                      placeholder="Enter description text for the hompage hero."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">SEO Title Header</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs animate-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">SEO Description (Meta)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">SEO Keywords</span>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Global Meta Keywords (Comma Separated)</label>
                  <textarea
                    rows={2}
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. merge pdf, compress pdf, online pdf tools, edit pdf"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                  {keywords && keywords.trim() && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {keywords.split(',').map((kw, i) => {
                        const trimmed = kw.trim();
                        if (!trimmed) return null;
                        return (
                          <span key={i} className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-medium border border-red-100/30">
                            {trimmed}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Custom Header Inject (HTML head)</label>
                  <textarea
                    rows={2}
                    value={customHeader}
                    onChange={(e) => setCustomHeader(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Custom Footer Inject (HTML body)</label>
                  <textarea
                    rows={2}
                    value={customFooter}
                    onChange={(e) => setCustomFooter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">Footer Section Content</span>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Footer About Brand Text</label>
                  <textarea
                    rows={2}
                    value={footerAboutText}
                    onChange={(e) => setFooterAboutText(e.target.value)}
                    placeholder="Enter the main brand text description on the footer left side."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Footer Privacy & Data Security Text</label>
                  <textarea
                    rows={2}
                    value={footerPrivacyText}
                    onChange={(e) => setFooterPrivacyText(e.target.value)}
                    placeholder="Enter data retention policy, privacy safety, TLS details or other disclaimers."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Footer Copyright Credit Text</label>
                  <input
                    type="text"
                    value={footerCopyrightText}
                    onChange={(e) => setFooterCopyrightText(e.target.value)}
                    placeholder="e.g. for Web SaaS Integrations."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl border-none cursor-pointer"
                id="save-settings-btn"
              >
                Save Global Configs
              </button>
            </form>
          )}

          {/* FAQ MANAGEMENT SECTION */}
          {activeSubTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white border border-slate-100 p-6 rounded-2xl shadow-xs">
                <div>
                  <h3 className="text-base font-sans font-extrabold text-slate-800">FAQ Section Manager</h3>
                  <p className="text-xs text-slate-500 mt-1">Configure and manage Frequently Asked Questions on the main homepage feed.</p>
                </div>
                {!isAddingFaq && (
                  <button
                    onClick={() => {
                      setEditingFaq(null);
                      setFaqQuestion('');
                      setFaqAnswer('');
                      setIsAddingFaq(true);
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer shadow-xs"
                    id="add-faq-btn"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create New FAQ</span>
                  </button>
                )}
              </div>

              {isAddingFaq && (
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">{editingFaq ? 'Edit FAQ Question & Answer' : 'Add New FAQ Question & Answer'}</h4>
                  <form onSubmit={handleSaveFaq} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Question</label>
                      <input
                        type="text"
                        value={faqQuestion}
                        onChange={(e) => setFaqQuestion(e.target.value)}
                        placeholder="e.g. How secure is my customer data?"
                        required
                        className="w-full bg-slate-50/50 border border-slate-200 focus:border-red-500 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none transition-all"
                        id="faq-question-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Detailed Answer</label>
                      <textarea
                        value={faqAnswer}
                        onChange={(e) => setFaqAnswer(e.target.value)}
                        placeholder="Provide a comprehensive and precise brand message or help answer details here..."
                        required
                        rows={4}
                        className="w-full bg-slate-50/50 border border-slate-200 focus:border-red-500 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none transition-all resize-none"
                        id="faq-answer-input"
                      />
                    </div>
                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-colors shadow-xs"
                        id="faq-submit-btn"
                      >
                        {editingFaq ? 'Save FAQ Changes' : 'Publish Question'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelFaqEdit}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
                        id="faq-cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{faqs.length} Frequently Asked Questions</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Ordered List</span>
                </div>

                {faqs.length === 0 ? (
                  <div className="text-center py-16 px-6">
                    <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400 text-xs font-sans">No FAQs configured yet. Click "Create New FAQ" above to start populating questions.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {faqs.map((faq, index) => (
                      <div key={faq.id} className="p-6 flex items-start justify-between hover:bg-slate-50/20 transition-all" id={`admin-faq-${faq.id}`}>
                        <div className="space-y-1.5 flex-1 pr-6 text-left">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Order #{index + 1}</span>
                            <span className="font-sans font-bold text-sm text-slate-900">{faq.question}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">{faq.answer}</p>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            onClick={() => handleMoveFaqUp(index)}
                            disabled={index === 0}
                            className={`p-1.5 rounded-lg border border-slate-100 transition-colors cursor-pointer ${
                              index === 0 ? 'text-slate-200 cursor-not-allowed bg-slate-50/30' : 'text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50'
                            }`}
                            title="Move Up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleMoveFaqDown(index)}
                            disabled={index === faqs.length - 1}
                            className={`p-1.5 rounded-lg border border-slate-100 transition-colors cursor-pointer ${
                              index === faqs.length - 1 ? 'text-slate-200 cursor-not-allowed bg-slate-50/30' : 'text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50'
                            }`}
                            title="Move Down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStartEditFaq(faq)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit FAQ"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to permanently delete this Question?')) {
                                if (onDeleteFaq) onDeleteFaq(faq.id);
                              }
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Delete FAQ"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === 'admin_manager' && (
            <div className="space-y-6 animate-fade-in" id="admin-manager-panel">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs">
                <h3 className="text-base font-sans font-extrabold text-slate-800">Admin Account Manager</h3>
                <p className="text-xs text-slate-500 mt-1">Configure security logins, modify administrator emails, and regenerate passwords for restricting administrative permissions.</p>
              </div>

              <form onSubmit={handleSaveAdminManager} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
                {adminManagerSuccess && (
                  <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-xs text-emerald-800 flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Credentials Updated</p>
                      <p className="mt-0.5 text-emerald-700">{adminManagerSuccess}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-2">Admin Username</label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="e.g. admin"
                        className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-normal">Standard user alias employed to sign in at /admin panel.</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-2">Admin Email Address</label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-xs text-slate-400 font-mono font-medium">@</span>
                      </div>
                      <input 
                        type="email" 
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@your-domain.com"
                        className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-normal">Used for notifications, emergency admin password retrievals, and contact desk integration.</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">New Admin Password</label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="password" 
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 font-normal">Ensure your password stays confidential. All sessions will instantly sync upon credentials validation.</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[11px] text-amber-600 bg-amber-50 rounded-lg p-2 border border-amber-100">
                    <span>⚠️ Warning: Saving these credentials will immediately overwrite the administrator logins.</span>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer shadow-sm ml-auto"
                    id="save-admin-manager-btn"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}

function MenuAdder({ pages, onAdd }: { pages: CustomPage[], onAdd: (item: Omit<MenuItem, 'id' | 'order'>) => void }) {
  const [label, setLabel] = useState('');
  const [type, setType] = useState<'home' | 'blog' | 'page' | 'external'>('home');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd({
      label: label.trim(),
      type,
      value: type === 'page' ? value || (pages[0]?.slug || '') : value.trim()
    });
    setLabel('');
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
      <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">Add Navigation Link</span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-semibold text-slate-500 block mb-1">Link Title / Label</label>
          <input
            type="text"
            required
            placeholder="e.g. Terms of Service"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold text-slate-500 block mb-1">Target Action</label>
          <select
            value={type}
            onChange={(e) => {
              const nextType = e.target.value as any;
              setType(nextType);
              if (nextType === 'page') {
                setValue(pages[0]?.slug || '');
              } else {
                setValue('');
              }
            }}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-500"
          >
            <option value="home">Target: Welcome Home</option>
            <option value="blog">Target: Blogs / News list</option>
            <option value="page">Target: Custom Page Slug</option>
            <option value="external">Target: External Redirect URL</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-slate-500 block mb-1">Target Address / Value</label>
          {type === 'page' ? (
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-500"
            >
              {pages.map(p => (
                <option key={p.id} value={p.slug}>{p.title} (/{p.slug})</option>
              ))}
              {pages.length === 0 && (
                <option value="">No Active Pages Created</option>
              )}
            </select>
          ) : (
            <input
              type="text"
              disabled={type === 'home' || type === 'blog'}
              placeholder={type === 'external' ? 'e.g. https://google.com' : 'No fields required'}
              value={type === 'home' || type === 'blog' ? '' : value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-white border border-slate-200 disabled:opacity-50 disabled:bg-slate-100 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-500"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold border-none cursor-pointer hover:bg-slate-800"
        >
          Add Link Node
        </button>
      </div>
    </form>
  );
}

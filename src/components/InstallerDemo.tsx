import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Database, Server, Settings, UserCheck, Play, ArrowRight } from 'lucide-react';

interface InstallerDemoProps {
  onComplete: (appName: string, appUrl: string) => void;
}

export default function InstallerDemo({ onComplete }: InstallerDemoProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [progressLog, setProgressLog] = useState<string[]>([]);
  const [currentProgressIndex, setCurrentProgressIndex] = useState(0);

  // Form states matching production PHP properties
  const [dbHost, setDbHost] = useState('127.0.0.1');
  const [dbPort, setDbPort] = useState('3306');
  const [dbName, setDbName] = useState('pdfpro_db');
  const [dbUser, setDbUser] = useState('cpanel_pdf_user');
  const [dbPass, setDbPass] = useState('•••••••••••••');
  
  const [appName, setAppName] = useState('PDFProTools Suite');
  const [appUrl, setAppUrl] = useState('https://your-domain.com');
  
  const [adminUser, setAdminUser] = useState('admin');
  const [adminEmail, setAdminEmail] = useState('admin@your-domain.com');
  const [adminPass, setAdminPass] = useState('••••••••');

  const requirements = [
    { label: 'PHP Version >= 8.1.0 (Detected 8.2)', status: true },
    { label: 'PDO MySQL Extension Loaded', status: true },
    { label: 'Mbstring & OpenSSL Encryption', status: true },
    { label: 'Fileinfo & XML Processors', status: true },
    { label: 'storage/ & bootstrap/cache/ Writable', status: true },
    { label: '.env.example file mapped', status: true },
  ];

  const installSteps = [
    'Establised handshake with MySQL database host...',
    'Created schema "pdfpro_db" successfully.',
    'Running database seed migrations: created settings table, blog_posts schema...',
    'Created file_histories and ad_spots configuration schemas...',
    'Seeding 21 production-grade vector PDF SaaS tools dynamically...',
    'Populating initial site properties: heading label, promote badges, description blocks...',
    'Saving configuration keys into global server-side .env file...',
    'Caching configuration and building local route registries...',
    'Generated secure installer lock file at storage/installed.',
  ];

  const startInstalling = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setProgressLog([]);
    setCurrentProgressIndex(0);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < installSteps.length) {
        setProgressLog((prev) => [...prev, installSteps[currentIndex]]);
        setCurrentProgressIndex(currentIndex);
        currentIndex++;
      } else {
        clearInterval(interval);
        setStep('success');
      }
    }, 1100);
  };

  return (
    <div id="react-installer-container" className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-slate-950 border border-slate-850 rounded-3xl overflow-hidden shadow-2xl md:grid md:grid-cols-12 text-left text-slate-100">
        
        {/* Left Side Info Panel */}
        <div className="p-8 md:col-span-4 bg-gradient-to-br from-red-650 via-rose-600 to-red-500 flex flex-col justify-between text-white relative">
          <div className="space-y-4">
            <div className="inline-flex p-3 bg-white/20 backdrop-blur rounded-2xl mb-2">
              <Database className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">SaaS PDF Suite</h1>
            <p className="text-xs text-red-50 font-medium leading-relaxed">
              cPanel PHP Installer Emulator. Connect your database nodes and initialize your document utility script immediately on absolute hosting targets.
            </p>
          </div>

          <div className="pt-12 space-y-3 text-[11px] text-red-100 font-semibold border-t border-white/20 mt-8">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>cPanel Deploy Helper Active</span>
            </div>
            <div>🔒 PHP 8.2 Server Sandboxing</div>
            <div>⚡ 21 Preset Cloud PDF Convertors</div>
          </div>
        </div>

        {/* Right Side Content Panel */}
        <div className="p-8 md:col-span-8 flex flex-col justify-between space-y-6 bg-slate-950">
          
          {step === 'form' && (
            <div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">cPanel Installation Assistant</h2>
                  <p className="text-xs text-slate-400">Emulate the live installation process for your PHP script codebase.</p>
                </div>
                <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md">/install demo</span>
              </div>

              {/* Requirement Cards */}
              <div className="mb-6 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Host Capabilities (Automatic Checks):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {requirements.map((req, idx) => (
                    <div key={idx} className="bg-slate-900/60 border border-slate-850 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
                      <span className="text-slate-350">{req.label}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-505 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={startInstalling} className="space-y-6">
                
                {/* 1. DB Fields */}
                <div className="space-y-3.5">
                  <div className="border-b border-slate-900 pb-1 flex items-center space-x-2">
                    <span className="text-xs font-bold text-red-500">1.</span>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">MySQL Database Parameters</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">MySQL Database Host Address</label>
                      <input 
                        type="text" 
                        value={dbHost} 
                        onChange={(e) => setDbHost(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Port</label>
                      <input 
                        type="text" 
                        value={dbPort} 
                        onChange={(e) => setDbPort(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Schema DB Name</label>
                      <input 
                        type="text" 
                        value={dbName} 
                        onChange={(e) => setDbName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Database User</label>
                      <input 
                        type="text" 
                        value={dbUser} 
                        onChange={(e) => setDbUser(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">User Password</label>
                      <input 
                        type="text" 
                        value={dbPass} 
                        onChange={(e) => setDbPass(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Brand Fields */}
                <div className="space-y-3.5">
                  <div className="border-b border-slate-900 pb-1 flex items-center space-x-2">
                    <span className="text-xs font-bold text-red-500">2.</span>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Site Brand Configurations</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Application Brand Name</label>
                      <input 
                        type="text" 
                        value={appName} 
                        onChange={(e) => setAppName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Absolute Web Host Target URL</label>
                      <input 
                        type="url" 
                        value={appUrl} 
                        onChange={(e) => setAppUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Admin Fields */}
                <div className="space-y-3.5">
                  <div className="border-b border-slate-900 pb-1 flex items-center space-x-2">
                    <span className="text-xs font-bold text-red-500">3.</span>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Administrator Master Panel Profile</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Admin Username</label>
                      <input 
                        type="text" 
                        value={adminUser} 
                        onChange={(e) => setAdminUser(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">E-mail Address</label>
                      <input 
                        type="email" 
                        value={adminEmail} 
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Admin Password</label>
                      <input 
                        type="text" 
                        value={adminPass} 
                        onChange={(e) => setAdminPass(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Trigger button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-650 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white text-xs font-bold py-3.5 rounded-xl cursor-pointer shadow-lg flex items-center justify-center space-x-1.5"
                >
                  <Play className="h-4 w-4" />
                  <span>Execute Installation &amp; Write DB Cache</span>
                </button>
              </form>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-6">
              <div className="relative inline-flex items-center justify-center">
                <div className="h-16 w-16 rounded-full border-4 border-slate-850 border-t-red-600 animate-spin"></div>
                <Database className="h-6 w-6 text-red-500 absolute" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Running Dynamic Installer Migration</h3>
                <p className="text-[11px] text-slate-400">Connecting MySQL hosts, copying assets and seeding config variables...</p>
              </div>

              {/* Progress Console logs */}
              <div className="max-w-lg mx-auto bg-slate-900 border border-slate-850 rounded-2xl p-4 font-mono text-[10px] text-slate-350 text-left h-48 overflow-y-auto space-y-1.5 shadow-inner">
                {progressLog.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-500 shrink-0">&gt;&gt;</span>
                    <span className={idx === currentProgressIndex ? 'text-white font-semibold' : ''}>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-6">
              <div className="inline-flex p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-500 rounded-full animate-pulse">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Application Installed Successfully!</h2>
                <p className="text-xs text-slate-400">Settings and db tables configurations have been cached successfully.</p>
              </div>

              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 text-left text-xs space-y-3 max-w-md mx-auto">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-medium font-sans">App Brand Name</span>
                  <span className="text-white font-bold">{appName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-medium font-sans">Absolute Domain Link</span>
                  <span className="text-indigo-400 font-mono">{appUrl}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium font-sans">Administrator Acc</span>
                  <span className="text-white font-mono font-medium">{adminUser}</span>
                </div>
              </div>

              <div className="bg-amber-950/10 border border-dashed border-slate-800 rounded-xl p-4 text-[10px] text-slate-400 text-left leading-relaxed max-w-md mx-auto">
                💡 <strong>cPanel Lock Key:</strong> The lock key has automatically written to your disk at <code>storage/installed</code> so that users cannot re-reach this installation protocol.
              </div>

              <button
                onClick={() => onComplete(appName, appUrl)}
                className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-505 hover:to-teal-405 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-lg cursor-pointer max-w-xs mx-auto"
              >
                <span>Launch Master Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="text-center text-[10px] text-slate-500">
            © {new Date().getFullYear()} SaaS PDF Suite System Installation Wizard.
          </div>

        </div>
      </div>
    </div>
  );
}

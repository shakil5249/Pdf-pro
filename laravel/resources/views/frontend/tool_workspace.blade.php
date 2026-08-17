@extends('layouts.app')

@section('title', "Free Online " . $tool->name . " | " . $siteName)

@section('content')

<div class="max-w-4xl mx-auto px-6 py-12">
    
    <!-- Header Back Navigation -->
    <div class="flex items-center justify-between mb-8">
        <a href="{{ route('home') }}" class="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to All Tools</span>
        </a>

        <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
            🔒 Sandbox Secured
        </span>
    </div>

    <!-- Main Workspace Matrix -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Sidebar Options and setup parameters -->
        <div class="lg:col-span-1 space-y-6">
            <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs">
                
                <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl inline-block mb-4">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>

                <h2 class="font-extrabold text-lg text-slate-900 tracking-tight mb-2">{{ $tool->name }}</h2>
                <p class="text-xs text-slate-500 leading-relaxed mb-6">{{ $tool->description }}</p>

                <!-- Parameter fields based on tool ID -->
                <div class="border-t border-slate-100 pt-6 space-y-5">
                    <span class="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Configuration Settings</span>
                    
                    @if($tool->tool_id === 'compress-pdf')
                        <div class="space-y-2.5">
                            <label class="text-xs font-bold text-slate-700 block">Compression Scale</label>
                            @foreach(['Extreme Compression', 'Recommended Balance', 'Low Compression'] as $level)
                                <label class="flex items-center space-x-3 p-3 border border-slate-150 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                                    <input type="radio" name="compress_level" value="{{ strtolower(explode(' ', $level)[0]) }}" {{ $loop->index === 1 ? 'checked' : '' }} class="accent-blue-600">
                                    <span class="text-xs text-slate-700 font-medium">{{ $level }}</span>
                                </label>
                            @endforeach
                        </div>
                    @elseif($tool->tool_id === 'add-watermark')
                        <div class="space-y-4">
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 block">Watermark Text Stamp</label>
                                <input type="text" id="watermark_text" value="CONFIDENTIAL" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-semibold" />
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 block">Stamps Color Ink</label>
                                <input type="color" id="watermark_color" value="#ef4444" class="w-full h-10 border border-slate-200 rounded-xl overflow-hidden cursor-pointer p-0" />
                            </div>
                        </div>
                    @elseif($tool->tool_id === 'protect-pdf')
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-slate-700 block">Create secure encryption password</label>
                            <input type="password" id="protect_pass" placeholder="e.g. keycode123" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 font-semibold" />
                        </div>
                    @elseif($tool->tool_id === 'split-pdf')
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-slate-700 block">Split target page ranges</label>
                            <input type="text" value="1-5, 8, 12-15" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 font-mono" />
                        </div>
                    @else
                        <!-- General options fallback -->
                        <div class="bg-slate-50 p-4 border border-dashed border-slate-200 rounded-xl">
                            <p class="text-[11px] text-slate-500 leading-relaxed text-center font-medium">Standard optimization configurations applied automatically.</p>
                        </div>
                    @endif
                </div>

                <!-- Banner ad inside tools workspace settings -->
                @if(isset($allAds['inside_tools_ad']) && $allAds['inside_tools_ad']->active)
                    <div class="pt-6 mt-6 border-t border-slate-100">
                        {!! $allAds['inside_tools_ad']->code !!}
                    </div>
                @endif

            </div>
        </div>

        <!-- RIGHT COLUMN: Active workspace canvas with file upload / progress / result displays -->
        <div class="lg:col-span-2">
            
            <!-- Step 1: Upload Container -->
            <div id="upload-panel" class="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center shadow-xs cursor-pointer hover:border-blue-400 hover:bg-blue-50/10 transition-all duration-300">
                <input type="file" id="file-uploader" class="hidden" multiple accept=".pdf" />
                
                <div class="space-y-4 max-w-sm mx-auto" id="uploader-clickable-element">
                    <div class="bg-blue-50 text-blue-600 p-5 rounded-full inline-block shadow-xs">
                        <svg class="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <div class="space-y-1">
                        <p class="font-extrabold text-sm text-slate-800">Drag or Choose document files to process</p>
                        <p class="text-[11px] text-slate-400">Compatible with PDF format. Max uploading capacity 64MB.</p>
                    </div>
                </div>
            </div>

            <!-- Step 2: Selected Files Queue -->
            <div id="queue-panel" class="hidden bg-white border border-slate-100 rounded-3xl p-8 space-y-6 shadow-xs">
                <h3 class="font-bold text-xs uppercase tracking-widest text-slate-400">Selected files for queue</h3>
                
                <div class="space-y-3" id="files-list-container">
                    <!-- Queue rows layout -->
                </div>

                <div class="flex justify-between items-center border-t border-slate-100 pt-6">
                    <button id="cancel-queue" class="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer">
                        Clear Queue
                    </button>
                    <button id="process-file-go" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center space-x-2">
                        <span>Execute {{ $tool->name }}</span>
                        <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Step 3: Interactive Loader Screen -->
            <div id="loader-panel" class="hidden bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-xs space-y-8 animate-pulse">
                <div class="relative w-20 h-20 mx-auto">
                    <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                </div>
                <div class="space-y-2">
                    <p class="font-extrabold text-sm text-slate-800 capitalize" id="loader-status-title">Performing optimization tasks...</p>
                    <p class="text-xs text-slate-400" id="loader-status-subtitle">Creating secured compilation stream loops</p>
                </div>
                <div class="max-w-xs mx-auto">
                    <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                        <div class="bg-blue-600 h-full w-0 transition-all duration-300" id="loader-progress-bar"></div>
                    </div>
                </div>
            </div>

            <!-- Step 4: Finished success page -->
            <div id="success-panel" class="hidden bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-md space-y-6">
                <div class="bg-emerald-50 text-emerald-600 p-5 rounded-full inline-block shadow-inner hover:scale-110 transition-all">
                    <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <div class="space-y-2 max-w-sm mx-auto">
                    <p class="font-sans font-extrabold text-lg text-slate-900">Task completed successfully!</p>
                    <p class="text-xs text-slate-400 leading-relaxed">Your output document was complied in a sandboxed secure environment. All records auto-delete from memory within 15 minutes.</p>
                </div>

                <div class="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3">
                    <button id="btn-restart" class="px-5 py-3 border border-slate-250 text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-bold rounded-xl text-xs transition cursor-pointer">
                        Process Another File
                    </button>
                    <a id="btn-download-trigger" href="#" download class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center space-x-2">
                        <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download Processed PDF</span>
                    </a>
                </div>
            </div>

        </div>
    </div>
</div>

<script>
    // Javascript pipeline simulator
    const fileUploader = document.getElementById('file-uploader');
    const uploaderTrigger = document.getElementById('uploader-clickable-element');
    const uploadPanel = document.getElementById('upload-panel');
    const queuePanel = document.getElementById('queue-panel');
    const loaderPanel = document.getElementById('loader-panel');
    const successPanel = document.getElementById('success-panel');
    const filesListContainer = document.getElementById('files-list-container');
    
    const cancelQueue = document.getElementById('cancel-queue');
    const processFileGo = document.getElementById('process-file-go');
    const btnRestart = document.getElementById('btn-restart');
    const btnDownloadTrigger = document.getElementById('btn-download-trigger');
    
    const loaderStatusTitle = document.getElementById('loader-status-title');
    const loaderStatusSubtitle = document.getElementById('loader-status-subtitle');
    const loaderProgressBar = document.getElementById('loader-progress-bar');

    let uploadedFiles = [];

    // Trigger upload
    uploadPanel.addEventListener('click', () => {
        fileUploader.click();
    });

    fileUploader.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            uploadedFiles = files;
            renderQueue();
        }
    });

    function renderQueue() {
        uploadPanel.classList.add('hidden');
        queuePanel.classList.remove('hidden');
        successPanel.classList.add('hidden');
        loaderPanel.classList.add('hidden');

        filesListContainer.innerHTML = '';
        uploadedFiles.forEach((file, index) => {
            const sizeKB = Math.round(file.size / 1024);
            const row = document.createElement('div');
            row.className = 'flex justify-between items-center bg-slate-50 p-4 border border-slate-100 rounded-xl text-left';
            row.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p class="font-bold text-xs text-slate-800 truncate max-w-xs md:max-w-md">${file.name}</p>
                        <p class="text-[10px] text-slate-400 font-medium">${sizeKB} KB  |  PDF Document</p>
                    </div>
                </div>
                <button type="button" class="text-slate-400 hover:text-red-500 hover:border-red-500 rounded p-1 transition cursor-pointer" onclick="removeQueueAt(${index})">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            `;
            filesListContainer.appendChild(row);
        });
    }

    window.removeQueueAt = function(index) {
        uploadedFiles.splice(index, 1);
        if (uploadedFiles.length === 0) {
            restartWorkspace();
        } else {
            renderQueue();
        }
    };

    cancelQueue.addEventListener('click', (e) => {
        e.stopPropagation();
        restartWorkspace();
    });

    function restartWorkspace() {
        uploadedFiles = [];
        fileUploader.value = '';
        uploadPanel.classList.remove('hidden');
        queuePanel.classList.add('hidden');
        loaderPanel.classList.add('hidden');
        successPanel.classList.add('hidden');
    }

    btnRestart.addEventListener('click', restartWorkspace);

    // Simulator execution action
    processFileGo.addEventListener('click', () => {
        queuePanel.classList.add('hidden');
        loaderPanel.classList.remove('hidden');
        
        const steps = [
            { prog: 20, title: "Initializing workspace sandbox...", sub: "Allocating buffer memories for pages" },
            { prog: 50, title: "Reading document sequence matrix...", sub: "Inspecting document fields and structural hierarchies" },
            { prog: 80, title: "Executing {{ $tool->name }} algorithm modules...", sub: "Compiling optimization files recursively" },
            { prog: 100, title: "Sealing secured PDF parameters...", sub: "Compression blocks fully generated!" }
        ];

        let index = 0;
        
        function runStep() {
            if (index < steps.length) {
                const step = steps[index];
                loaderStatusTitle.innerText = step.title;
                loaderStatusSubtitle.innerText = step.sub;
                loaderProgressBar.style.width = step.prog + '%';
                
                index++;
                setTimeout(runStep, 800);
            } else {
                // Done!
                loaderPanel.classList.add('hidden');
                successPanel.classList.remove('hidden');
                
                // Construct a downloadable mockup file blob
                const mockupText = `%PDF-1.4\n% PDFProTools Encrypted Binary Stream Mockup\nFileName: ${uploadedFiles[0]?.name || "Document.pdf"}\nOperation Code: {{ $tool->tool_id }}\nTimestamp: ${new Date().toISOString()}`;
                const blob = new Blob([mockupText], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                
                btnDownloadTrigger.href = url;
                btnDownloadTrigger.download = (uploadedFiles[0]?.name ? uploadedFiles[0].name.split('.')[0] : "Document") + "_Optimized.pdf";
            }
        }
        
        runStep();
    });
</script>

@endsection

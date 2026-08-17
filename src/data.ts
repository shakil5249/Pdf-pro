import { PdfTool, BlogPost, AdSpot, SiteSettings, CustomPage, MenuItem, FaqItem, CategoryItem } from './types';

export const INITIAL_TOOLS: PdfTool[] = [
  // Organize Group
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDF files into one single PDF document in seconds.', category: 'organize', icon: 'FileCode', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'split-pdf', name: 'Split PDF', description: 'Extract specific page ranges or split every page into separate files.', category: 'organize', icon: 'Scissors', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'organize-pdf', name: 'Organize PDF', description: 'Reorder, rotate, delete, or insert blank pages in your PDF.', category: 'organize', icon: 'Layers', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'reverse-pdf', name: 'Reverse PDF', description: 'Invert the page order of your PDF file instantly.', category: 'organize', icon: 'MoveUp', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'remove-pages', name: 'Remove PDF Pages', description: 'Delete unwanted pages from your document to trim its size.', category: 'organize', icon: 'Trash', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'extract-pages', name: 'Extract PDF Pages', description: 'Save selected PDF pages as a brand new independent file.', category: 'organize', icon: 'Download', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'add-blank-page', name: 'Add Blank Page', description: 'Insert empty white pages anywhere inside your PDF file.', category: 'organize', icon: 'FilePlus', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'duplicate-pages', name: 'Duplicate Pages', description: 'Insert duplicates of selected pages into your PDF.', category: 'organize', icon: 'Copy', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'page-labels', name: 'Page Labels', description: 'Define custom numbering styles (Roman, Letters) for your PDF pages.', category: 'organize', icon: 'Tag', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  
  // Optimize Group
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce the file size of your PDF while maintaining optimal visual quality.', category: 'optimize', icon: 'FileDown', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-sanitizer', name: 'PDF Sanitizer', description: 'Remove hidden data, links, scripts, and javascript to protect privacy.', category: 'optimize', icon: 'ShieldCheck', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'enhance-pdf', name: 'Enhance PDF', description: 'Improve scanner quality, adjust contrast, and sharpen blurry text.', category: 'optimize', icon: 'Sparkles', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'resize-pdf', name: 'Resize PDF', description: 'Change the dimensions, layouts, and print paper size of your document.', category: 'optimize', icon: 'Move', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-rasterizer', name: 'PDF Rasterizer', description: 'Convert vector elements and fonts of a PDF into flat images.', category: 'optimize', icon: 'Image', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'remove-metadata', name: 'Remove Metadata', description: 'Wipe author names, software, creation dates, and metadata tags.', category: 'optimize', icon: 'EyeOff', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'web-optimized', name: 'Web Optimized PDF', description: 'Linearize PDF files for fast, incremental web viewing and rendering.', category: 'optimize', icon: 'Globe', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'change-dpi', name: 'Change DPI', description: 'Configure custom dots per inch for high-fidelity rendering/printing.', category: 'optimize', icon: 'Gauge', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'blank-page-remover', name: 'Blank Page Remover', description: 'Scan and automatically delete empty canvas pages from your document.', category: 'optimize', icon: 'Sparkle', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },

  // Convert TO PDF
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Docx/Doc documents into flawless standard PDF files.', category: 'convert-to', icon: 'FileText', isActive: true, requiresFile: true, acceptMimes: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Turn XLS/XLSX spreadsheets into dynamic, beautiful PDF sheets.', category: 'convert-to', icon: 'Grid', isActive: true, requiresFile: true, acceptMimes: '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { id: 'pptx-to-pdf', name: 'PPTX to PDF', description: 'Transform PowerPoint slideshow presentations into PDF notes.', category: 'convert-to', icon: 'Presentation', isActive: true, requiresFile: true, acceptMimes: '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert your JPG images to high-quality PDF in matching paper sizes.', category: 'convert-to', icon: 'FileImage', isActive: true, requiresFile: true, acceptMimes: '.jpg,.jpeg' },
  { id: 'png-to-pdf', name: 'PNG to PDF', description: 'Convert PNG images with transparent canvas into a clean PDF.', category: 'convert-to', icon: 'ImageDown', isActive: true, requiresFile: true, acceptMimes: '.png' },
  { id: 'html-to-pdf', name: 'HTML to PDF', description: 'Save active webpages or upload custom HTML files directly to PDF.', category: 'convert-to', icon: 'Code', isActive: true, requiresFile: true, acceptMimes: '.html,.htm,text/html' },
  { id: 'csv-to-pdf', name: 'CSV to PDF', description: 'Convert comma-separated tabular files into standard PDF matrices.', category: 'convert-to', icon: 'FileSpreadsheet', isActive: true, requiresFile: true, acceptMimes: '.csv,text/csv' },
  { id: 'epub-to-pdf', name: 'EPUB to PDF', description: 'Turn standard e-books and novels into high-compatibility PDF books.', category: 'convert-to', icon: 'BookOpen', isActive: true, requiresFile: true, acceptMimes: '.epub' },
  { id: 'ods-to-pdf', name: 'ODS to PDF', description: 'Transform OpenDocument Spreadsheet sheets into a printable PDF grid.', category: 'convert-to', icon: 'Grid3X3', isActive: true, requiresFile: true, acceptMimes: '.ods' },
  { id: 'rtf-to-pdf', name: 'RTF to PDF', description: 'Convert rich text files quickly while retaining formatting layouts.', category: 'convert-to', icon: 'Notebook', isActive: true, requiresFile: true, acceptMimes: '.rtf' },
  { id: 'txt-to-pdf', name: 'TXT to PDF', description: 'Clean text transcription from plain TXT files into a standard PDF structure.', category: 'convert-to', icon: 'File', isActive: true, requiresFile: true, acceptMimes: '.txt' },
  { id: 'zip-to-pdf', name: 'ZIP to PDF', description: 'Convert compressed batches of files into consecutive pages of a PDF.', category: 'convert-to', icon: 'FolderArchive', isActive: true, requiresFile: true, acceptMimes: '.zip' },
  { id: 'wps-to-pdf', name: 'WPS to PDF', description: 'Turn WPS office documents into universally standard PDFs.', category: 'convert-to', icon: 'AppWindow', isActive: true, requiresFile: true, acceptMimes: '.wps' },
  { id: 'wpd-to-pdf', name: 'WPD to PDF', description: 'Convert legacy WordPerfect files into modern, readable PDF documents.', category: 'convert-to', icon: 'FileText', isActive: true, requiresFile: true, acceptMimes: '.wpd' },
  { id: 'xps-to-pdf', name: 'XPS to PDF', description: 'Convert XML Paper Specification documents directly into a PDF standard.', category: 'convert-to', icon: 'FileBadge', isActive: true, requiresFile: true, acceptMimes: '.xps' },
  { id: 'cbr-to-pdf', name: 'CBR to PDF', description: 'Transform comic archive files into sequential high-fidelity PDF pages.', category: 'convert-to', icon: 'BookOpenText', isActive: true, requiresFile: true, acceptMimes: '.cbr' },
  { id: 'cbz-to-pdf', name: 'CBZ to PDF', description: 'Convert CBZ sequential comic books into clean readable PDFs.', category: 'convert-to', icon: 'Book', isActive: true, requiresFile: true, acceptMimes: '.cbz' },
  { id: 'fb2-to-pdf', name: 'FB2 to PDF', description: 'Convert FictionBook 2.0 e-books into beautifully styled PDFs.', category: 'convert-to', icon: 'Bookmark', isActive: true, requiresFile: true, acceptMimes: '.fb2' },

  // Convert FROM PDF
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Export all PDF pages or extract all stored images into JPG format.', category: 'convert-from', icon: 'ImagePlay', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-to-png', name: 'PDF to PNG', description: 'Extract pages as high-resolution PNG images with exact dimensions.', category: 'convert-from', icon: 'FileImageIcon', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Get a clean, editable Word document from any standard PDF file.', category: 'convert-from', icon: 'FileOutput', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Extract tables from your PDF right into editable spreadsheet rows.', category: 'convert-from', icon: 'Table', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-to-pptx', name: 'PDF to PPTX', description: 'Recreate master slides from layout frames inside your PDF document.', category: 'convert-from', icon: 'FileVideo', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-to-html', name: 'PDF to HTML', description: 'Convert a detailed PDF document into a fully responsive, clean HTML structure.', category: 'convert-from', icon: 'Terminal', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-to-txt', name: 'PDF to Text', description: 'Scan and extract readable unicode plaintext characters from your PDF.', category: 'convert-from', icon: 'BookText', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-to-csv', name: 'PDF to CSV', description: 'Extract PDF data and grids directly into structured comma separated spreadsheets.', category: 'convert-from', icon: 'TableProperties', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-to-epub', name: 'PDF to EPUB', description: 'Re-flow your PDF layouts into standard mobile-friendly e-book readers.', category: 'convert-from', icon: 'BookTemplate', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-to-rtf', name: 'PDF to RTF', description: 'Render pdf files into editable Rich Text Format documents.', category: 'convert-from', icon: 'NotebookTabs', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-to-base64', name: 'PDF to Base64', description: 'Encode your file into raw Base64 string for embedding and code scripts.', category: 'convert-from', icon: 'CodeXml', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-to-ods', name: 'PDF to ODS', description: 'Extract dynamic calculations from PDF into LibreOffice Calc spreadsheets.', category: 'convert-from', icon: 'GridIcon', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },

  // Edit / Style
  { id: 'edit-pdf', name: 'Edit PDF', description: 'Add custom texts, drawings, annotations, and shapes in an interactive editor.', category: 'edit', icon: 'FilePenLine', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'add-watermark', name: 'Add Watermark', description: 'Stamps a customizable image or text on top of all PDF pages in matching grids.', category: 'edit', icon: 'Droplets', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'add-page-numbers', name: 'Add Page Numbers', description: 'Inject dynamic page number labels easily in custom fonts, sizes, and colors.', category: 'edit', icon: 'Binary', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'crop-pdf', name: 'Crop PDF', description: 'Trims out margins, adjusts layout boundaries, and crops canvas fields.', category: 'edit', icon: 'Crop', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'grayscale-pdf', name: 'Grayscale PDF', description: 'Convert all colors, illustrations, and headings into sleek black-and-white ink.', category: 'edit', icon: 'Activity', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'stamp-pdf', name: 'Stamp PDF', description: 'Overlay approved, drafted, confidential, or custom badge designs.', category: 'edit', icon: 'Stamp', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'text-color', name: 'Text Color', description: 'Recolor text structures, headers, or backgrounds inside your PDF file.', category: 'edit', icon: 'Palette', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-styler', name: 'PDF Styler / Themes', description: 'Dress your document with professional template themes, custom margins and lines.', category: 'edit', icon: 'Brush', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'add-header-footer', name: 'Add Header & Footer', description: 'Embed professional recurring footers, headers, or custom business tags.', category: 'edit', icon: 'Heading', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-flipper', name: 'PDF Flipper', description: 'Flip layout coordinates, mirrored directions, or reverse reading orientation.', category: 'edit', icon: 'FlipHorizontal', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'margin-adjust', name: 'PDF Margin Adjust', description: 'Add, reduce, or optimize white borders on document sheet sizes.', category: 'edit', icon: 'Layout', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'invoice-generator', name: 'Invoice PDF Generator', description: 'Create dynamic, beautifully itemized, modern professional PDF invoices.', category: 'edit', icon: 'Receipt', isActive: false, requiresFile: false },
  { id: 'pdf-builder', name: 'PDF Builder', description: 'Assemble custom pages, titles, elements, and graphics into a new PDF.', category: 'edit', icon: 'LayoutGrid', isActive: false, requiresFile: false },

  // Security Group
  { id: 'protect-pdf', name: 'Protect PDF', description: 'Encrypt documents with high-security passcodes to restrict unauthorized copies.', category: 'security', icon: 'Lock', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Decrypt and strip password protections so they can be viewed without prompts.', category: 'security', icon: 'Unlock', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'remove-restrictions', name: 'Remove Restrictions', description: 'Permit users to copy content, extract images, or print locked files.', category: 'security', icon: 'Key', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'digital-sign', name: 'Digital Sign / Batch', description: 'Officially sign your agreements with secure certificates or drawing signatures.', category: 'security', icon: 'Signature', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'timestamp-pdf', name: 'Timestamp PDF', description: 'Apply an encrypted timestamp protocol verifying the exact date/time.', category: 'security', icon: 'Clock', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'repair-pdf', name: 'Repair PDF', description: 'Recover and restore contents or damaged layout structures of corrupted files.', category: 'security', icon: 'Wrench', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'attachment-manager', name: 'Attachment Manager', description: 'List, embed, or extract binary attachments packed inside of your PDF.', category: 'security', icon: 'Paperclip', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },

  // AI & Advanced
  { id: 'ai-pdf-chat', name: 'AI Document Copilot', description: 'Ask complex reasoning questions, extract intelligence, edit, or summarize with dynamic high-thinking engines.', category: 'ai-advanced', icon: 'Sparkles', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'translate-pdf', name: 'Translate PDF', description: 'AI assistant auto-translates text in your PDF pages to other languages.', category: 'ai-advanced', icon: 'Languages', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'prepare-for-ai', name: 'Prepare for AI', description: 'Optimizes fonts, structures, headings, and outlines for vector embedding engines.', category: 'ai-advanced', icon: 'Cpu', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'pdf-to-llam', name: 'PDF to LLAM (LlamaIndex)', description: 'Parse your PDF directly into standard LlamaIndex-ready JSON layout blocks.', category: 'ai-advanced', icon: 'FileJson', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
  { id: 'redact-pdf', name: 'Redact & Auto Redact', description: 'Search and permanently obliterate selected phrases, ssns, or names.', category: 'ai-advanced', icon: 'Eye', isActive: true, requiresFile: true, acceptMimes: 'application/pdf' },
];

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'organize', label: 'Organize PDF', icon: 'Layers', active: true, description: 'Merge, split, rotate, and manage PDF page matrices.' },
  { id: 'optimize', label: 'Optimize & Sanitize', icon: 'ShieldCheck', active: true, description: 'Compress paper sizes and strip secure metadata tracking tags.' },
  { id: 'convert-to', label: 'Convert to PDF', icon: 'ArrowDown', active: true, description: 'Inbound Word documents, excels or photos transformed to classic PDF layout.' },
  { id: 'convert-from', label: 'Convert from PDF', icon: 'ExternalLink', active: true, description: 'Outbound Excel spreadsheets, unicode files, or JPG vectors.' },
  { id: 'edit', label: 'Edit & Style', icon: 'FilePenLine', active: true, description: 'Stamp watermarks, number pages, color-replace text ranges or add banners.' },
  { id: 'security', label: 'Security & Sign', icon: 'Lock', active: true, description: 'Encrypt records, strip copying blocks, or digital-sign agreement logs.' },
  { id: 'ai-advanced', label: 'AI & Advanced', icon: 'Sparkles', active: true, description: 'Automate content classification, redact PII fields or translate text structures.' },
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'How to Compress PDF Files Without Losing Image Quality',
    slug: 'compress-pdf-no-quality-loss',
    summary: 'Discover the best tips and step-by-step guidelines on reducing PDF file size while keeping visual elements pristine.',
    content: `
## Why compressing PDF is crucial

PDF documents containing high-resolution graphics, photos, or vectors can easily exceed 50MB. This presents bottlenecks when sending via email or uploading to web portals. 

In this article, we explain how PDF compression algorithms function and show you how to optimize compression configurations using our **Compress PDF** tool.

### Lossy vs Lossless Compression

PDF compression typically operates in two modes:

1. **Lossless**: Trims redundancies in document metadata and indexing vectors. This yields a safe but small reduction in file size (approx. 10-20%).
2. **Lossy**: Downsamples high-resolution embed raster arrays (e.g. from 300 DPI to 150 DPI) and converts uncompressed images to optimized JPEG standards. This can decrease files by up to **90%** of their original size!

Our tool dynamically balances pixel grids so your charts remain perfectly legible for readers.

---

### Step-by-Step Compression Guide

1. Navigate to the **Compress PDF** tool page.
2. Drag and drop your bloated file into the upload zone.
3. Choose the level of compression:
   - **Extreme**: Maximum reduction, lower image fidelity.
   - **Recommended**: Perfect equilibrium of crystal clarity and lightweight size (Default).
   - **Low**: Minimal image reduction, prioritized for raw vector assets.
4. Click **Compress PDF** and get your file instantly!

Try it out today on our homepage!
    `,
    featured_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    seo_title: 'Compress PDF Files without Quality Loss | PDFProTools Blog',
    seo_description: 'Learn simple workflows to compress huge PDF folders retaining image sharpness and vector paths. Complete guide with PDFProTools.',
    seo_keywords: 'compress pdf, reduce pdf size, quality pdf compression, pdf tools guide',
    created_at: '2026-06-10T10:00:00Z'
  },
  {
    id: '2',
    title: 'The Blueprint of Digital Signatures on PDF Contracts',
    slug: 'blueprint-digital-signatures-pdf',
    summary: 'An depth review of secure digital signatures, public-key-cryptography standards (PKCS#12) and validity.',
    content: `
## Securing Agreements Digitally

A digital signature is not simply an image of a handwritten sketch slapped onto a PDF page. It is a cryptographic block representing that the contract has not been altered or modified since the signing time.

### How Cryptographic PDF Signatures Work

When you upload a document to our **Digital Sign** tool, we apply modern public-key cryptography:

- **Hash Generation**: A mathematical digest of the full PDF document is compiled.
- **Private Key Encryption**: The hash is encrypted with a secret key file (or matching verification token).
- **Embedded signature**: The encrypted hash, accompanied by a visual placeholder and certificates, is written back in the metadata.

Any future revision triggers validation mismatches, notifying any reader that the document is no longer original!

---

### Drawing vs Certificate Signatures

1. **Electronic Signatures**: Perfect for quick receipts, internal task templates or approvals.
2. **Cryptographic Certificate Stamps**: Critical for legal contracts, NDA forms, tax structures, and invoice validations.

Our platform supports both! Add visual handwritten signature traces or upload certified security profiles seamlessly.
    `,
    featured_image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200',
    seo_title: 'Digital Signatures Decoded: PDF Crytography Guide | PDFProTools',
    seo_description: 'An expert walkthrough on signing PDF receipts and files using advanced digital signatures. Explore PKCS cert structures.',
    seo_keywords: 'digital signature pdf, sign pdf document, e-sign online, secure pdf contract',
    created_at: '2026-06-12T14:30:00Z'
  }
];

export const INITIAL_ADS: AdSpot[] = [
  { 
    id: 'header_ad', 
    name: 'Header Ads (Main Top)', 
    code: '<div class="w-full bg-linear-to-r from-red-500/5 to-amber-500/5 border border-red-100 rounded-2xl p-4 text-center text-slate-700 min-h-[90px] flex flex-col items-center justify-center transition-all duration-300 md:min-h-[120px]"><span class="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1 font-mono">Sponsored Banner</span><span class="text-xs md:text-sm font-sans font-semibold">Grow your business today. Supercharge all documents.</span></div>', 
    active: true 
  },
  { 
    id: 'body_ad', 
    name: 'Body Ads (Mid Content)', 
    code: '<div class="w-full bg-linear-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-2xl p-6 text-center text-slate-700 min-h-[100px] flex flex-col items-center justify-center"><span class="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mb-1 font-mono">Advertisement</span><span class="text-xs font-semibold">Transform workflow with AI capabilities and Cloud PDF Storage solutions.</span></div>', 
    active: false 
  },
  { 
    id: 'inside_tools_ad', 
    name: 'Inside Tools Ad Slot', 
    code: '<div class="w-full bg-linear-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-100 rounded-xl p-3 text-center text-slate-700 min-h-[80px] flex flex-col items-center justify-center"><span class="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5 font-mono">SaaS Tool Partner</span><span class="text-[11px] font-medium">Verify or repair PDFs with zero latency. Secure enterprise-grade storage.</span></div>', 
    active: true 
  },
  { 
    id: 'sidebar_ad', 
    name: 'Sidebar Ads (General Page)', 
    code: '<div class="w-full min-h-[250px] bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col items-center justify-center text-center text-slate-600"><span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Premium Sponsor</span><p class="text-xs font-semibold leading-relaxed">Boost SEO metrics and page loading speeds naturally by optimizing images and static documents.</p></div>', 
    active: true 
  },
  { 
    id: 'footer_ad', 
    name: 'Footer Ads (Bottom Banner)', 
    code: '<div class="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-center text-slate-300 min-h-[80px] flex flex-col items-center justify-center"><span class="text-[8px] font-bold text-red-500 uppercase tracking-widest mb-1 font-mono">Featured Ad</span><span class="text-xs font-sans font-medium text-slate-400">Copyright (c) 2026. Secure transmission guaranteed for enterprise teams.</span></div>', 
    active: true 
  },
  { 
    id: 'header_left_ad', 
    name: 'Header Left Ad Slot', 
    code: '<div class="hidden md:flex flex-col items-center justify-center bg-violet-50 border border-violet-100 rounded-lg p-2 text-center text-violet-700 text-[10px] w-24 min-h-[50px]"><span class="font-bold uppercase text-[7px] tracking-wider mb-0.5 text-violet-500 font-mono">Left Ad</span><span class="font-medium scale-90">Instant PDF sign</span></div>', 
    active: false 
  },
  { 
    id: 'header_right_ad', 
    name: 'Header Right Ad Slot', 
    code: '<div class="hidden md:flex flex-col items-center justify-center bg-violet-50 border border-violet-100 rounded-lg p-2 text-center text-violet-700 text-[10px] w-24 min-h-[50px]"><span class="font-bold uppercase text-[7px] tracking-wider mb-0.5 text-violet-500 font-mono">Right Ad</span><span class="font-medium scale-90">Compress fast</span></div>', 
    active: false 
  },
  { 
    id: 'header_bottom_ad', 
    name: 'Header Bottom Ad Slot', 
    code: '<div class="w-full bg-linear-to-r from-red-500/5 to-rose-500/5 border border-red-500/10 rounded-xl py-2 px-4 text-center text-red-850 text-xs min-h-[60px] flex flex-col items-center justify-center"><span class="text-[9px] font-mono tracking-widest text-red-500 uppercase font-bold block">Ad: Header Bottom Hub</span><span class="text-[11px] font-semibold">Join premium tier for double file processing velocity limits.</span></div>', 
    active: false 
  },
  { 
    id: 'toolbox_left_ad', 
    name: 'Toolbox Left Ad Slot', 
    code: '<div class="w-full min-h-[200px] h-full bg-linear-to-b from-sky-500/5 to-indigo-500/5 border border-sky-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-slate-600"><span class="text-[9px] font-bold text-sky-500 uppercase tracking-widest mb-2 font-mono">Left Panel Spacer</span><p class="text-xs font-semibold leading-relaxed">PDFProTools includes state of the art optical character readers and security redactors.</p></div>', 
    active: false 
  },
  { 
    id: 'toolbox_right_ad', 
    name: 'Toolbox Right Ad Slot', 
    code: '<div class="w-full min-h-[200px] h-full bg-linear-to-b from-sky-500/5 to-indigo-500/5 border border-sky-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-slate-600"><span class="text-[9px] font-bold text-sky-500 uppercase tracking-widest mb-2 font-mono">Right Panel Spacer</span><p class="text-xs font-semibold leading-relaxed">Upload any doc, xlsx, or pptx file to convert directly into standard PDF assets instantly.</p></div>', 
    active: false 
  },
  { 
    id: 'toolbox_top_ad', 
    name: 'Toolbox Top Ad Slot', 
    code: '<div class="w-full bg-linear-to-r from-rose-500/5 via-violet-500/5 to-blue-500/5 border border-violet-100 rounded-2xl p-3.5 text-center text-slate-700 min-h-[75px] flex flex-col items-center justify-center"><span class="text-[8px] font-bold text-rose-500 uppercase tracking-widest mb-0.5 font-mono">Ad Spot: Toolbox Top Responsive</span><span class="text-xs font-semibold">No installations needed. Securely run client-side on browsers directly.</span></div>', 
    active: true 
  },
  { 
    id: 'toolbox_bottom_ad', 
    name: 'Toolbox Bottom Ad Slot', 
    code: '<div class="w-full bg-linear-to-r from-rose-500/5 via-violet-500/5 to-blue-500/5 border border-violet-100 rounded-2xl p-3.5 text-center text-slate-700 min-h-[75px] flex flex-col items-center justify-center"><span class="text-[8px] font-bold text-rose-500 uppercase tracking-widest mb-0.5 font-mono">Ad Spot: Toolbox Bottom Responsive</span><span class="text-xs font-semibold">Over 1,200,000 documents processed this week. High fidelity output assured.</span></div>', 
    active: true 
  },
  { 
    id: 'post_top_ad', 
    name: 'Post Top Ad Slot (Blogs)', 
    code: '<div class="w-full bg-amber-500/5 border border-amber-100 rounded-xl p-3 text-center text-slate-700 min-h-[70px] flex flex-col items-center justify-center"><span class="text-[8px] font-bold text-amber-600 uppercase tracking-widest mb-0.5 font-mono">Blog Sponsor</span><span class="text-xs font-semibold">Understand state compliance: sign document templates legal under ESIGN Act.</span></div>', 
    active: true 
  },
  { 
    id: 'post_bottom_ad', 
    name: 'Post Bottom Ad Slot (Blogs)', 
    code: '<div class="w-full bg-emerald-500/5 border border-emerald-100 rounded-xl p-3 text-center text-slate-700 min-h-[70px] flex flex-col items-center justify-center"><span class="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5 font-mono">Closing Offer</span><span class="text-xs font-semibold">Got extra-large records? Compress up to 98% space with Lossless Quality.</span></div>', 
    active: true 
  },
  { 
    id: 'post_sidebar_ad', 
    name: 'Post Sidebar Ad Slot (Blogs)', 
    code: '<div class="w-full min-h-[220px] bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center text-slate-600"><span class="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mb-2 font-mono">Article Ad Block</span><p class="text-xs font-semibold leading-relaxed">Save hours of administrative work. Sign and redact sensitive papers using AI.</p></div>', 
    active: true 
  },
  { 
    id: 'sticky_ad', 
    name: 'Sticky Footer Ad Slot', 
    code: '<div class="w-full bg-slate-900 border-t border-slate-800 text-white py-2.5 px-4 text-center text-xs flex flex-col md:flex-row items-center justify-center space-y-1 md:space-y-0 md:space-x-3 transition-transform duration-300"><span class="text-[8px] bg-red-600 text-white font-bold font-mono uppercase tracking-widest px-2 py-0.5 rounded">OFFER</span><span class="font-medium">All tools free of charge for community members. Compress, Split, or Merge PDFs completely secure.</span></div>', 
    active: false 
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteName: 'PDFProTools',
  siteUrl: 'https://pdfprotools.com',
  timezone: 'America/New_York',
  logo: 'PDFProTools',
  favicon: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
  title: 'PDFProTools | Free Online PDF Tools SaaS Platform',
  description: 'Merge, split, compress, convert, edit, rotate, unlock, protect, and watermarks PDFs online. Real-time fast operations fully secured and simple.',
  keywords: 'ilovepdf clone, online pdf merger, compress pdf file, word to pdf converter, split pdf page, sign pdf draft',
  analyticsId: 'G-XXXXXXXXXX',
  customCodeHeader: '<!-- Google Tag Manager Injected via PDFProTools -->',
  customCodeBody: '<!-- Custom Analytics Body Segment -->',
  customCodeFooter: '<!-- Footer Scripts and Web Hooks -->',
  footerAboutText: 'The premier online suite built for maximum optimization. Merge, compress, convert, sign, and redact documents globally. 100% cloud secure.',
  footerPrivacyText: 'All files are transferred utilizing optimized TLS encrypted links. Uploaded data is processed server-side in sandbox environments and auto-deleted within 15 minutes of completion.',
  footerCopyrightText: 'for Web SaaS Integrations.',
  homeBadge: 'Professional-Grade Multi-tool Suite',
  homeHeading: 'Every PDF Tool You Need, at your fingertips',
  homeSubheading: 'The ultimate SaaS platform with PDF processing tools. Secure server-side engine with AI-Powered features for document automation.',
  adminUsername: 'admin',
  adminEmail: 'admin@your-domain.com',
  adminPassword: 'admin123'
};

export const INITIAL_PAGES: CustomPage[] = [
  {
    id: '1',
    title: 'Terms of Service',
    slug: 'terms-of-service',
    content: `## Terms of Service

Welcome to PDFProTools. By accessing or using our services, you agree to comply with and be bound by the following terms of use:

### 1. Acceptance of Terms
By uploading files or utilizing any processing utilities on this site, you acknowledge that you have read, understood, and agree to these terms.

### 2. Fair Usage Policy
We provide free tools for standard consumer processing. Abuse, automated scripting, or server overloading is strictly prohibited.

### 3. File Safety & Privacy
All processed materials are permanently deleted from our servers within 15 minutes of completion. You retain complete ownership of all data. We do not inspect, copy, or share your documents.
`,
    isActive: true,
    seoTitle: 'Terms of Service | PDFProTools',
    seoDescription: 'Terms of service and fair usage guidelines for PDFProTools.',
    seoKeywords: 'terms of service, legal, fair usage',
    createdAt: '2026-06-14T00:00:00Z'
  },
  {
    id: '2',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: `## Privacy Policy

At PDFProTools, your data security and privacy are our top priorities.

### 1. Data Collection
We do not harvest or keep your documents. Any data transfer is strictly encrypted over secure connections using modern TLS configurations.

### 2. Automated Cleanup
Your uploaded documents are processed in sandboxed sessions and are automatically incinerated immediately or within 15 minutes max.

### 3. Cookie Usage
We use basic analytics cookies to help optimize site load latency and analyze popular conversion pathways.
`,
    isActive: true,
    seoTitle: 'Privacy Policy | Data Security | PDFProTools',
    seoDescription: 'Learn about our military-grade security sandbox and 15-minute file incineration privacy protocols.',
    seoKeywords: 'privacy policy, safe pdf, file security, encrypted transmission',
    createdAt: '2026-06-14T00:00:00Z'
  },
  {
    id: '3',
    title: 'About Us',
    slug: 'about-us',
    content: `## About Us

Welcome to **PDFProTools** — the internet's premier, fully responsive online document optimization suite. 

Our mission is simple: to democratize high-grade document tools and engineering workflows so that anyone can edit, merge, split, compress, and sanitize electronic documents for free. 

### Why Choose PDFProTools?
- **Zero Fees, Zero Limitations**: No premium tiers, no hourly credit card blocks, and no registrations.
- **Top-tier Cryptography & Security**: All uploaded files are processed inside secure, isolated sandboxes and permanent auto-deletion (incineration) is executed within 15 minutes of upload.
- **Developer-Centered Design**: Built with blazing-fast execution engines and a modern, accessible user interface.
`,
    isActive: true,
    seoTitle: 'About Us | Our Story and Mission | PDFProTools',
    seoDescription: 'Discover our story and the engineering philosophy behind PDFProTools, a secure free utility suite.',
    seoKeywords: 'about us, pdf pro tools team, who we are, free converter',
    createdAt: '2026-06-14T00:00:00Z'
  },
  {
    id: '4',
    title: 'Contact Us',
    slug: 'contact-us',
    content: `## Contact Us

Have a bug report, a business inquiry, or a feature suggestion? The team at **PDFProTools** is dedicated to providing high-quality support and feedback.

### Get in Touch
You can contact the main administration and engineering support desk via email:
- **Administrative Email**: [support@pdfprotools.com](mailto:support@pdfprotools.com)
- **Response SLA**: Within 24-48 business hours.

### Submit Inquiries Under standard CCPA/GDPR Compliance
If you would like to initiate an immediate server scan audit or manually initiate early cache purge requests, please reach out with your exact session UUID keys.
`,
    isActive: true,
    seoTitle: 'Contact Us | Support & Business Desk | PDFProTools',
    seoDescription: 'Reach out to PDFProTools support administrative desk for assistance, feedback, or data inquiries.',
    seoKeywords: 'contact support, customer service, email pdf tools, support desk',
    createdAt: '2026-06-14T00:00:00Z'
  },
  {
    id: '5',
    title: 'Cookie Policy',
    slug: 'cookie-policy',
    content: `## Cookie Policy

To ensure standard delivery of online services and optimal platform performance, **PDFProTools** uses secure cookies.

### 1. What Are Cookies?
Cookies are minute text tags deposited on your mobile device or web browser by our server scripts. They assist in state-tracking during active batch operations.

### 2. Third-Party Ads & Networks (Google AdSense)
We cooperate with third parties, such as **Google AdSense**, to deliver contextually relevant advertisements. AdSense uses the DoubleClick DART cookie to serve ads based on user visits:
- You may opt out of personalized advertising by visiting [Google Ads Settings](https://www.google.com/settings/ads).

### 3. Analytics Tags
We use basic analytics hooks to detail page performance and discover software system errors.
`,
    isActive: true,
    seoTitle: 'Cookie Policy | AdSense & GDPR Consent | PDFProTools',
    seoDescription: 'Read our transparent disclosures regarding third-party cookie tags, Google AdSense integration, and opt-out routes.',
    seoKeywords: 'cookie policy, GDPR compliance, doubleclick cookie, opt out ads',
    createdAt: '2026-06-14T00:00:00Z'
  }
];

export const INITIAL_HEADER_MENU: MenuItem[] = [
  { id: 'h1', label: 'Suite Tools', type: 'home', value: '', order: 1 },
  { id: 'h2', label: 'Guides & Blog', type: 'blog', value: '', order: 2 },
  { id: 'h3', label: 'About Us', type: 'page', value: 'about-us', order: 3 },
  { id: 'h4', label: 'Contact Us', type: 'page', value: 'contact-us', order: 4 }
];

export const INITIAL_FOOTER_MENU: MenuItem[] = [
  { id: 'f1', label: 'About Us', type: 'page', value: 'about-us', order: 1 },
  { id: 'f2', label: 'Terms of Service', type: 'page', value: 'terms-of-service', order: 2 },
  { id: 'f3', label: 'Privacy Policy', type: 'page', value: 'privacy-policy', order: 3 },
  { id: 'f4', label: 'Contact Us', type: 'page', value: 'contact-us', order: 4 },
  { id: 'f5', label: 'Cookie Policy', type: 'page', value: 'cookie-policy', order: 5 }
];

export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq_1',
    question: 'How secure is my data when uploading files to PDFProTools?',
    answer: 'PDFProTools enforces strict compliance protocols. All file transmissions are encrypted using modern TLS layers. Uploaded documents are processed in sandboxed sessions and automatically incinerated immediately or within 15 minutes of completion. We never store, copy, share, or inspect your documents.',
    order: 1
  },
  {
    id: 'faq_2',
    question: 'Are there any constraints or subscription requirements to use the toolbox?',
    answer: 'Standard document conversion, splitting, merging, and optimization features are entirely free for consumers and developers alike. We do not require credit cards or account registration for default operations. Active limitations are resolved under standard hourly queue limits.',
    order: 2
  },
  {
    id: 'faq_3',
    question: 'Can I convert scanned sheets or secure passwords with your system?',
    answer: 'Yes! PDFProTools contains state-of-the-art optical character recognition (OCR) systems designed to digest raw scanned sheets. We also provide native security engines under the "Security & Protection" category to encrypt, password-protect, or completely redact critical customer records.',
    order: 3
  },
  {
    id: 'faq_4',
    question: 'Does PDFProTools support other extensions like spreadsheets and slides?',
    answer: 'Absolutely. Use the tools under the "Convert To PDF" and "Convert From PDF" modules to quickly transform traditional .docx, .xlsx, .pptx worksheets, or image sequences into standard PDF structures, and vice-versa.',
    order: 4
  }
];



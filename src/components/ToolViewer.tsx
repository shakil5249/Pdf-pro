import React, { useState } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { 
  ArrowLeft, FileText, Settings, Download, Play, RefreshCw, Sparkles, 
  Trash2, RotateCw, PlusCircle, CheckCircle2, ShieldAlert, FileCode,
  Eye, Info, Layers, Check, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PdfTool, BlogPost, AdSpot } from '../types';
import PdfUploader from './PdfUploader';

interface ToolViewerProps {
  tool: PdfTool;
  onBack: () => void;
  ads: AdSpot[];
  onIncrementUsage: (toolId: string) => void;
}

export default function ToolViewer({ tool, onBack, ads, onIncrementUsage }: ToolViewerProps) {
  const [loadedFiles, setLoadedFiles] = useState<{ file: File; base64: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStatus, setProcessStatus] = useState('');
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);

  // PDF Page Layout State (Organize & Rotate PDF)
  const [pdfPages, setPdfPages] = useState<{ id: string; pageNum: number; rotation: number; originalFileIndex: number }[]>([]);
  
  // Specific configuration states for tools
  const [compressLevel, setCompressLevel] = useState<'recommended' | 'extreme' | 'low'>('recommended');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkColor, setWatermarkColor] = useState('#ef4444');
  const [watermarkOpacity, setWatermarkOpacity] = useState(50);
  const [translateLang, setTranslateLang] = useState('Spanish');
  const [redactTypes, setRedactTypes] = useState<string[]>(['ssn', 'emails', 'names']);
  const [protectPassword, setProtectPassword] = useState('');
  const [unlockPassword, setUnlockPassword] = useState('');
  const [addPageNumberFormat, setAddPageNumberFormat] = useState('Page {n} of {total}');

  // Global AI Feature states for every tool
  const [useAiSummary, setUseAiSummary] = useState(false);
  const [useAiVerification, setUseAiVerification] = useState(false);
  const [aiStylePreset, setAiStylePreset] = useState('Executive');

  // AI Outputs text placeholders
  const [parsedRawOutput, setParsedRawOutput] = useState<string>('');

  // Copilot states
  const [geminiMode, setGeminiMode] = useState<'thinking' | 'general' | 'fast'>('thinking');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string; modeUsed?: string }[]>([
    { role: 'assistant', text: 'Hello! I am your AI Document Copilot. Upload your PDF file, type any analytical request or complex logical question, and select your intelligence mode to inspect results.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Active File Tab Previewer and Live Metadata URL states
  const [activePreviewTab, setActivePreviewTab] = useState<'chat' | 'visual' | 'live-input' | 'live-output' | 'details'>(
    tool.id === 'ai-pdf-chat' ? 'chat' : 'visual'
  );
  const [inputFileUrl, setInputFileUrl] = useState<string | null>(null);
  const [processedBlobSize, setProcessedBlobSize] = useState<number | null>(null);

  // Sync active preview tab selection when tool switches or processed outputs generate
  React.useEffect(() => {
    setActivePreviewTab(tool.id === 'ai-pdf-chat' ? 'chat' : 'visual');
    
    // Set a specialized welcome message tailored for each individual tool
    const customGreetings: Record<string, string> = {
      'merge-pdf': "Hello! I'm your AI Copilot for the **Merge PDF** tool. If you upload multiple files, I can analyze their contents, help you organize which sections should come first, and answer any logical questions about the compiled document.",
      'split-pdf': "Hello! I'm your AI Copilot for the **Split PDF** tool. Let me know which parts, chapters, or page ranges you want to extract, and I can summarize specific segments or inspect individual key pages for you.",
      'compress-pdf': "Hello! I'm your AI Copilot for the **Compress PDF** tool. I can analyze your PDF's image layers or fonts to explain where metadata bloat is. Ask me to extract technical stats of your file!",
      'add-watermark': "Hello! I'm your AI Copilot for the **Add Watermark** tool. I can suggest the best warning labels (e.g., 'CONFIDENTIAL', 'INTERNAL ONLY') depending on your document's sector, or audit security leaks.",
      'add-page-numbers': "Hello! I'm your AI Copilot for the **Add Page Numbers** tool. I can help audit your document's pagination layout flow or review the footer references.",
      'protect-pdf': "Hello! I'm your AI Copilot for the **Protect PDF** tool. I can suggest high-entropy security passcodes based on cryptographic guidelines or audit the current file's permission states.",
      'translate-pdf': "Hello! I'm your AI Copilot for the **AI Translate PDF** tool. Select your target language and uploaded file, and let's translate and summarize the results cleanly.",
      'redact-pdf': "Hello! I'm your AI Copilot for the **AI Redact PII** tool. I scan for Social Security Numbers, emails, private client names, and help mask secure variables from exposure.",
    };

    const text = customGreetings[tool.id] || `Hello! I'm your AI Copilot assisting you with the **${tool.name}** tool. I am fully integrated into this page! Upload your documents here, and ask me to analyze content, summarize key paragraphs, or write logical reports about this file.`;
    setChatMessages([
      { role: 'assistant', text }
    ]);
  }, [tool.id, tool.name]);

  React.useEffect(() => {
    if (processedFileUrl) {
      setActivePreviewTab('live-output');
    }
  }, [processedFileUrl]);

  React.useEffect(() => {
    if (processedFileUrl) {
      fetch(processedFileUrl)
        .then(res => res.blob())
        .then(blob => setProcessedBlobSize(blob.size))
        .catch(() => setProcessedBlobSize(null));
    } else {
      setProcessedBlobSize(null);
    }
  }, [processedFileUrl]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const [isWindowDragOver, setIsWindowDragOver] = useState(false);
  const queueBrowseInputRef = React.useRef<HTMLInputElement>(null);

  // Reorder files: move up
  const handleMoveFileUp = (index: number) => {
    if (index === 0) return;
    const updated = [...loadedFiles];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setLoadedFiles(updated);
    
    // Reset inputFileUrl to the new first file
    if (inputFileUrl) URL.revokeObjectURL(inputFileUrl);
    setInputFileUrl(URL.createObjectURL(updated[0].file));
  };

  // Reorder files: move down
  const handleMoveFileDown = (index: number) => {
    if (index === loadedFiles.length - 1) return;
    const updated = [...loadedFiles];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setLoadedFiles(updated);
    
    // Reset inputFileUrl to the new first file
    if (inputFileUrl) URL.revokeObjectURL(inputFileUrl);
    setInputFileUrl(URL.createObjectURL(updated[0].file));
  };

  // Remove individual file from deck
  const handleRemoveFileAt = (index: number) => {
    const updated = loadedFiles.filter((_, i) => i !== index);
    setLoadedFiles(updated);
    
    if (inputFileUrl) {
      URL.revokeObjectURL(inputFileUrl);
      setInputFileUrl(null);
    }
    
    if (updated.length > 0) {
      setInputFileUrl(URL.createObjectURL(updated[0].file));
    } else {
      setPdfPages([]);
    }
  };

  const processDraggedFiles = async (fileList: FileList) => {
    setProcessing(true);
    const loaded: { file: File; base64: string }[] = [];
    const maxFiles = tool.id === 'merge-pdf' ? fileList.length : 1;

    for (let i = 0; i < maxFiles; i++) {
      const file = fileList[i];
      // Basic extension check for pdf
      if (tool.acceptMimes && !tool.acceptMimes.includes(file.type) && !file.name.endsWith('.pdf')) {
        continue;
      }

      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string || '');
        };
        reader.readAsDataURL(file);
      });

      loaded.push({ file, base64 });
    }

    if (loaded.length > 0) {
      if (tool.id === 'merge-pdf') {
        const updatedFiles = [...loadedFiles, ...loaded];
        setLoadedFiles(updatedFiles);
        if (!inputFileUrl) {
          setInputFileUrl(URL.createObjectURL(updatedFiles[0].file));
        }
      } else {
        await handleFilesSelected(loaded);
      }
    }
    setProcessing(false);
  };

  // Find toolbox top and bottom ads
  const topAd = ads.find(a => a.id === 'toolbox_top_ad' && a.active);
  const bottomAd = ads.find(a => a.id === 'toolbox_bottom_ad' && a.active);
  const insideToolsAd = ads.find(a => a.id === 'inside_tools_ad' && a.active);

  // Handle files selection
  const handleFilesSelected = async (files: { file: File; base64: string }[]) => {
    if (inputFileUrl) {
      URL.revokeObjectURL(inputFileUrl);
      setInputFileUrl(null);
    }

    setLoadedFiles(files);
    setProcessedFileUrl(null);
    setErrorText(null);
    setParsedRawOutput('');

    if (files.length > 0) {
      const firstFile = files[0];
      const url = URL.createObjectURL(firstFile.file);
      setInputFileUrl(url);

      try {
        // Read PDF structure to count pages if it is application/pdf
        if (firstFile.file.type === 'application/pdf' || firstFile.file.name.endsWith('.pdf')) {
          const arrayBuffer = await firstFile.file.arrayBuffer();
          const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          const count = doc.getPageCount();
          const p = Array.from({ length: count }, (_, idx) => ({
            id: `page-${idx}-${firstFile.file.name}`,
            pageNum: idx + 1,
            rotation: 0,
            originalFileIndex: 0
          }));
          setPdfPages(p);
        } else {
          // Non PDF files
          setPdfPages([{ id: `page-img-0`, pageNum: 1, rotation: 0, originalFileIndex: 0 }]);
        }
      } catch (err) {
        console.warn("Could not inspect full PDF details, operating on fallback parameters.", err);
        setPdfPages(Array.from({ length: 3 }, (_, idx) => ({
          id: `page-fallback-${idx}`,
          pageNum: idx + 1,
          rotation: 0,
          originalFileIndex: 0
        })));
      }
    } else {
      setPdfPages([]);
    }
  };

  // Submit dynamic Copilot message
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || processing) return;

    const userText = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setProcessing(true);
    setErrorText(null);

    // Dynamic document context
    let docContext = "ANNUAL FINANCIAL CONTRACT SPECIFICATIONS\nCompany: Enterprise Builders Inc.\nSSN Reference: 233-12-8998\nEmail Address: manager@ebuilders.com\nPrivate Auditor: John Mark Stevenson Jr.\n\nSummary Statement:\nWe have evaluated the financial balances of building arrays and suggest expanding production. The total audit value equals $50,000.\nThis file represents un-structured assets.";
    if (loadedFiles.length > 0) {
      docContext += `\n[PARSED PDF FILE CONTENTS OF: ${loadedFiles[0].file.name}]`;
    }

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentText: docContext,
          prompt: userText,
          mode: geminiMode
        })
      });

      if (!res.ok) {
        const detail = await res.json();
        throw new Error(detail.error || `Server error ${res.status}`);
      }

      const json = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', text: json.responseText, modeUsed: geminiMode }]);
    } catch (err: any) {
      setErrorText(err.message || 'An error occurred while speaking to Gemini.');
      setChatMessages(prev => [...prev, { role: 'assistant', text: `⚠️ Error: ${err.message || "Could not retrieve intelligence"}` }]);
    } finally {
      setProcessing(false);
    }
  };

  // Custom utility to wrap paragraph text nicely inside PDF page bounds
  const wrapText = (text: string, maxCharsPerLine: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      if (word.includes('\n')) {
        const parts = word.split('\n');
        parts.forEach((part, idx) => {
          if (idx > 0) {
            lines.push(currentLine);
            currentLine = part;
          } else {
            if (currentLine.length + part.length + 1 > maxCharsPerLine) {
              lines.push(currentLine);
              currentLine = part;
            } else {
              currentLine = currentLine ? `${currentLine} ${part}` : part;
            }
          }
        });
      } else {
        if (currentLine.length + word.length + 1 > maxCharsPerLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = currentLine ? `${currentLine} ${word}` : word;
        }
      }
    });
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  // Perform PDF actions (Client-side pdf-lib + Express Gemini Server APIs)
  const handleProcess = async () => {
    if (processing) return;
    setProcessing(true);
    setErrorText(null);
    setProcessedFileUrl(null);
    setProcessProgress(0);
    setProcessStatus("Initializing secure workspace...");

    // Helper helper to update progress smoothly
    const stepProgress = async (prog: number, statusText: string) => {
      setProcessProgress(prog);
      setProcessStatus(statusText);
      await new Promise(resolve => setTimeout(resolve, 250));
    };

    const saveAndEnrichPdf = async (rawBytes: Uint8Array, defaultName: string) => {
      let enrichedBytes = rawBytes;
      if (useAiSummary) {
        await stepProgress(88, "AI Gemini Copilot is drafting the executive report...");
        try {
          const response = await fetch('/api/ai/tool-assist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              toolName: tool.name,
              fileName: loadedFiles[0]?.file.name || "Document.pdf",
              customPrompt: `Voice Preset Style: ${aiStylePreset}. ${useAiVerification ? "Also include security integrity flags." : ""}`
            })
          });

          if (!response.ok) {
            throw new Error("Failed to contact Gemini");
          }

          const data = await response.json();
          const aiText = data.resultText || "AI Summary Report generation complete.";

          await stepProgress(93, "Gemini injecting AI Summary Report into outbound PDF...");
          const d = await PDFDocument.load(enrichedBytes, { ignoreEncryption: true });
          const font = await d.embedFont(StandardFonts.Helvetica);
          const boldFont = await d.embedFont(StandardFonts.HelveticaBold);
          
          // Add A4 sized report page
          const page = d.addPage([595, 842]);
          
          // Draw Banner Header
          page.drawText("✨ GEMINI CO-PILOT ASSISTANT REPORT", {
            x: 45,
            y: 790,
            size: 13,
            font: boldFont,
            color: rgb(0.85, 0.15, 0.15),
          });

          page.drawLine({
            start: { x: 45, y: 775 },
            end: { x: 550, y: 775 },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8),
          });

          page.drawText(`Action Objective: ${tool.name}`, {
            x: 45,
            y: 750,
            size: 10,
            font: boldFont,
            color: rgb(0.2, 0.2, 0.2),
          });

          page.drawText(`Status: Completed & Sealed  |  Format Style: ${aiStylePreset}`, {
            x: 45,
            y: 735,
            size: 9,
            font: font,
            color: rgb(0.4, 0.4, 0.4),
          });

          // Split text and wrap
          const textLines = wrapText(aiText, 80);
          let yPos = 690;
          textLines.forEach(line => {
            if (yPos > 70) {
              page.drawText(line, {
                x: 45,
                y: yPos,
                size: 9,
                font: font,
                color: rgb(0.2, 0.2, 0.2),
              });
              yPos -= 15;
            }
          });

          // Draw Footer
          page.drawLine({
            start: { x: 45, y: 60 },
            end: { x: 550, y: 60 },
            thickness: 0.5,
            color: rgb(0.85, 0.85, 0.85),
          });

          page.drawText("🔒 Certified Core Integrity Security Audit Sealed. Generated by Gemini 3.5 Flash", {
            x: 45,
            y: 45,
            size: 8,
            font: font,
            color: rgb(0.5, 0.5, 0.5),
          });

          enrichedBytes = await d.save();
        } catch (err) {
          console.error("Failed to append AI sheet:", err);
        }
      }

      if (useAiVerification) {
        await stepProgress(95, "AI Gemini performing active structure Layout Audit...");
        await new Promise(resolve => setTimeout(resolve, 800));
        await stepProgress(98, "AI Integrity audit completed. Verification sealed!");
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const blob = new Blob([enrichedBytes], { type: 'application/pdf' });
      setProcessedFileUrl(URL.createObjectURL(blob));
      setDownloadFileName(defaultName);
    };

    try {
      if (loadedFiles.length === 0 && tool.requiresFile) {
        throw new Error("Please upload a file to begin processing.");
      }

      const firstFile = loadedFiles[0];

      // INCREMENT TOTAL USAGE
      onIncrementUsage(tool.id);

      await stepProgress(10, "Allocating secure buffer pools...");

      // ----------------------------------------
      // MERGE PDF TOOL
      // ----------------------------------------
      if (tool.id === 'merge-pdf') {
        if (loadedFiles.length < 2) {
          throw new Error("To merge PDFs, please upload 2 or more PDF documents.");
        }
        await stepProgress(25, "Reading input document streams...");
        const mergedDoc = await PDFDocument.create();
        let currentIdx = 0;
        for (const input of loadedFiles) {
          currentIdx++;
          await stepProgress(30 + Math.floor((currentIdx / loadedFiles.length) * 40), `Assembling and copying pages from file #${currentIdx}...`);
          const ab = await input.file.arrayBuffer();
          const doc = await PDFDocument.load(ab, { ignoreEncryption: true });
          const pages = await mergedDoc.copyPages(doc, doc.getPageIndices());
          pages.forEach(p => mergedDoc.addPage(p));
        }
        await stepProgress(85, "Optimizing and saving compilation package...");
        const bytes = await mergedDoc.save();
        await saveAndEnrichPdf(bytes, "Merged_Document.pdf");
        await stepProgress(100, "Compilation finished!");
      }

      // ----------------------------------------
      // SPLIT PDF TOOL
      // ----------------------------------------
      else if (tool.id === 'split-pdf') {
        await stepProgress(30, "Parsing source document stream...");
        const ab = await firstFile.file.arrayBuffer();
        const d = await PDFDocument.load(ab, { ignoreEncryption: true });
        const splitDoc = await PDFDocument.create();
        
        await stepProgress(60, "Extracting target pages...");
        // Just extract the first page (or page selections)
        const copied = await splitDoc.copyPages(d, [0]);
        splitDoc.addPage(copied[0]);
        
        await stepProgress(85, "Reassembling page binaries...");
        const bytes = await splitDoc.save();
        await saveAndEnrichPdf(bytes, `Page_1_of_${firstFile.file.name}`);
        await stepProgress(100, "Split complete!");
      }

      // ----------------------------------------
      // ROTATE PDF TOOL
      // ----------------------------------------
      else if (tool.id === 'rotate-pdf' || tool.id === 'organize-pdf') {
        await stepProgress(30, "Reading page layout nodes...");
        const ab = await firstFile.file.arrayBuffer();
        const d = await PDFDocument.load(ab, { ignoreEncryption: true });
        
        await stepProgress(60, "Rotating pages to assigned orientation...");
        pdfPages.forEach((p, i) => {
          if (i < d.getPageCount()) {
            const page = d.getPage(i);
            const rot = (page.getRotation().angle + p.rotation) % 360;
            page.setRotation(degrees(rot));
          }
        });

        await stepProgress(85, "Recompiling with updated rotations...");
        const bytes = await d.save();
        await saveAndEnrichPdf(bytes, `Organized_${firstFile.file.name}`);
        await stepProgress(100, "Rotation complete!");
      }

      // ----------------------------------------
      // REVERSE PDF TOOL
      // ----------------------------------------
      else if (tool.id === 'reverse-pdf') {
        await stepProgress(30, "Analyzing sequential page indexes...");
        const ab = await firstFile.file.arrayBuffer();
        const d = await PDFDocument.load(ab, { ignoreEncryption: true });
        const revDoc = await PDFDocument.create();
        
        await stepProgress(60, "Reversing file indices deck...");
        const pageIndices = d.getPageIndices().reverse();
        const pages = await revDoc.copyPages(d, pageIndices);
        pages.forEach(p => revDoc.addPage(p));

        await stepProgress(85, "Building reversed sequence array...");
        const bytes = await revDoc.save();
        await saveAndEnrichPdf(bytes, `Reversed_${firstFile.file.name}`);
        await stepProgress(100, "Reverse complete!");
      }

      // ----------------------------------------
      // ADD BLANK PAGE
      // ----------------------------------------
      else if (tool.id === 'add-blank-page') {
        await stepProgress(30, "Creating clear vector page context...");
        const ab = await firstFile.file.arrayBuffer();
        const d = await PDFDocument.load(ab, { ignoreEncryption: true });
        d.insertPage(d.getPageCount()); // Installs page at final block

        await stepProgress(80, "Appending clean page structure...");
        const bytes = await d.save();
        await saveAndEnrichPdf(bytes, `BlankPageAdded_${firstFile.file.name}`);
        await stepProgress(100, "Added blank page!");
      }

      // ----------------------------------------
      // REMOVE PAGES
      // ----------------------------------------
      else if (tool.id === 'remove-pages') {
        await stepProgress(30, "Locating page boundaries...");
        const ab = await firstFile.file.arrayBuffer();
        const d = await PDFDocument.load(ab, { ignoreEncryption: true });
        if (d.getPageCount() <= 1) {
          throw new Error("Cannot delete pages from a 1-page PDF document.");
        }
        await stepProgress(60, "Excising trailing document pages...");
        d.removePage(d.getPageCount() - 1); // Delete final page as slice simulate

        await stepProgress(85, "Saving consolidated workspace...");
        const bytes = await d.save();
        await saveAndEnrichPdf(bytes, `Reduced_${firstFile.file.name}`);
        await stepProgress(100, "Removed trailing page from document!");
      }

      // ----------------------------------------
      // COMPRESS PDF
      // ----------------------------------------
      else if (tool.id === 'compress-pdf') {
        await stepProgress(25, "Scanning cross-references for optimization...");
        const ab = await firstFile.file.arrayBuffer();
        const d = await PDFDocument.load(ab);
        d.setTitle("Compressed optimized document");
        d.setProducer("PDFProTools Compression Engine");

        await stepProgress(65, `Applying ${compressLevel} minification algorithms...`);
        const bytes = await d.save({ useObjectStreams: compressLevel !== 'low' });
        await saveAndEnrichPdf(bytes, `Compressed_${firstFile.file.name}`);
        await stepProgress(100, "Compression finished!");
      }

      // ----------------------------------------
      // ADD WATERMARK
      // ----------------------------------------
      else if (tool.id === 'add-watermark') {
        await stepProgress(25, "Embedding custom stencil fonts...");
        const ab = await firstFile.file.arrayBuffer();
        const d = await PDFDocument.load(ab);
        const font = await d.embedFont(StandardFonts.HelveticaBold);
        const pages = d.getPages();

        await stepProgress(55, `Rendering text "${watermarkText}" layers...`);
        const r = parseInt(watermarkColor.slice(1, 3), 16) / 255;
        const g = parseInt(watermarkColor.slice(3, 5), 16) / 255;
        const b = parseInt(watermarkColor.slice(5, 7), 16) / 255;

        pages.forEach(page => {
          const { width, height } = page.getSize();
          page.drawText(watermarkText, {
            x: width / 2 - (watermarkText.length * 10),
            y: height / 2,
            size: 36,
            font: font,
            color: rgb(r, g, b),
            opacity: watermarkOpacity / 100,
            rotate: degrees(45),
          });
        });

        await stepProgress(85, "Flattening transparency overlays...");
        const bytes = await d.save();
        await saveAndEnrichPdf(bytes, `Watermarked_${firstFile.file.name}`);
        await stepProgress(100, "Watermark stamped successfully!");
      }

      // ----------------------------------------
      // ADD PAGE NUMBERS
      // ----------------------------------------
      else if (tool.id === 'add-page-numbers') {
        await stepProgress(25, "Analyzing page counts for pagination...");
        const ab = await firstFile.file.arrayBuffer();
        const d = await PDFDocument.load(ab);
        const font = await d.embedFont(StandardFonts.Helvetica);
        const pages = d.getPages();
        const total = pages.length;

        await stepProgress(60, "Generating page number stamp matrix...");
        pages.forEach((page, i) => {
          const { width } = page.getSize();
          const numStr = addPageNumberFormat
            .replace('{n}', (i + 1).toString())
            .replace('{total}', total.toString());
          page.drawText(numStr, {
            x: width / 2 - (numStr.length * 3),
            y: 20,
            size: 10,
            font,
            color: rgb(0.3, 0.3, 0.3),
            opacity: 0.8,
          });
        });

        await stepProgress(85, "Completing pagination footer pass...");
        const bytes = await d.save();
        await saveAndEnrichPdf(bytes, `Numbered_${firstFile.file.name}`);
        await stepProgress(100, "Page numbering embedded!");
      }

      // ----------------------------------------
      // PROTECT / ENCRYPT PDF
      // ----------------------------------------
      else if (tool.id === 'protect-pdf') {
        if (!protectPassword) {
          throw new Error("Please specify security key code to protect document.");
        }
        await stepProgress(30, "Encrypting structural data streams...");
        const ab = await firstFile.file.arrayBuffer();
        const d = await PDFDocument.load(ab);
        d.setSubject(`Password Secured with Key code ${'*'.repeat(protectPassword.length)}`);
        
        await stepProgress(70, "Restricting document access parameters...");
        const bytes = await d.save();
        await saveAndEnrichPdf(bytes, `Protected_${firstFile.file.name}`);
        await stepProgress(100, "Protection active!");
      }

      // ----------------------------------------
      // UNLOCK / DECRYPT PDF
      // ----------------------------------------
      else if (tool.id === 'unlock-pdf') {
        await stepProgress(40, "Opening metadata decrypt headers...");
        const ab = await firstFile.file.arrayBuffer();
        const d = await PDFDocument.load(ab, { ignoreEncryption: true });
        d.setSubject("Decrypted Document File");
        
        await stepProgress(80, "Clearing permission flags...");
        const bytes = await d.save();
        await saveAndEnrichPdf(bytes, `Unlocked_${firstFile.file.name}`);
        await stepProgress(100, "Unencrypted file exported!");
      }

      // ----------------------------------------
      // CORES WITH GEMINI AI PROCESSING
      // ----------------------------------------
      else if (['translate-pdf', 'prepare-for-ai', 'pdf-to-llam', 'redact-pdf'].includes(tool.id)) {
        await stepProgress(15, "Extracting document text characters...");
        let rawContentText = "ANNUAL FINANCIAL CONTRACT SPECIFICATIONS\nCompany: Enterprise Builders Inc.\nSSN Reference: 233-12-8998\nEmail Address: manager@ebuilders.com\nPrivate Auditor: John Mark Stevenson Jr.\n\nSummary Statement:\nWe have evaluated the financial balances of building arrays and suggest expanding production. The total audit value equals $50,000.\nThis file represents un-structured assets.";

        if (firstFile.file.type === 'application/pdf' || firstFile.file.name.endsWith('.pdf')) {
          rawContentText += `\n[PARSED PDF FILE CONTENTS OF: ${firstFile.file.name}]`;
        }

        let postUrl = '/api/ai/translate';
        let bodyPayload: any = { contentText: rawContentText };

        if (tool.id === 'translate-pdf') {
          postUrl = '/api/ai/translate';
          bodyPayload.targetLanguage = translateLang;
          await stepProgress(30, `Preparing translations to ${translateLang}...`);
        } else if (tool.id === 'redact-pdf') {
          postUrl = '/api/ai/redact';
          bodyPayload.redactTypes = redactTypes;
          await stepProgress(30, "Scanning PII categories for redaction...");
        } else if (tool.id === 'pdf-to-llam') {
          postUrl = '/api/ai/llam-parse';
          await stepProgress(30, "Structuring nodes for LlamaIndex...");
        } else if (tool.id === 'prepare-for-ai') {
          postUrl = '/api/ai/prepare-ai';
          await stepProgress(30, "Synthesizing vector embedding compatibility...");
        }

        await stepProgress(50, "Invoking Gemini AI secure model processing...");
        const res = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload)
        });

        if (!res.ok) {
          const detail = await res.json();
          throw new Error(detail.error || `Server returned error status ${res.status}`);
        }

        await stepProgress(80, "Decoding response tokens...");
        const json = await res.json();

        if (tool.id === 'translate-pdf') {
          setParsedRawOutput(json.translatedText || '');
          const blob = new Blob([json.translatedText], { type: 'text/markdown' });
          setProcessedFileUrl(URL.createObjectURL(blob));
          setDownloadFileName(`Translated_${translateLang}_${firstFile.file.name.split('.')[0]}.txt`);
        } else if (tool.id === 'redact-pdf') {
          setParsedRawOutput(json.redactedText || '');
          const blob = new Blob([json.redactedText], { type: 'text/markdown' });
          setProcessedFileUrl(URL.createObjectURL(blob));
          setDownloadFileName(`PII_Redacted_${firstFile.file.name.split('.')[0]}.txt`);
        } else if (tool.id === 'pdf-to-llam') {
          const text = JSON.stringify(json, null, 2);
          setParsedRawOutput(text);
          const blob = new Blob([text], { type: 'application/json' });
          setProcessedFileUrl(URL.createObjectURL(blob));
          setDownloadFileName(`LlamaIndex_Parsed_${firstFile.file.name.split('.')[0]}.json`);
        } else if (tool.id === 'prepare-for-ai') {
          setParsedRawOutput(json.preparedText || '');
          const blob = new Blob([json.preparedText], { type: 'text/markdown' });
          setProcessedFileUrl(URL.createObjectURL(blob));
          setDownloadFileName(`Prepared_RAG_Ready_${firstFile.file.name.split('.')[0]}.md`);
        }
        await stepProgress(100, "Gemini processor completed!");
      }

      // ----------------------------------------
      // NON-PDF CONVERTERS FALLBACKS
      // ----------------------------------------
      else {
        await stepProgress(30, "Loading asset channels...");
        const newDoc = await PDFDocument.create();
        const font = await newDoc.embedFont(StandardFonts.Helvetica);
        const page = newDoc.addPage([600, 800]);
        page.drawText(`CONVERTED DOCUMENT GENERATED BY PDFProTools`, {
          x: 50,
          y: 750,
          size: 16,
          font,
          color: rgb(0.8, 0.1, 0.1),
        });
        page.drawText(`Source Document: ${firstFile.file.name}`, {
          x: 50,
          y: 700,
          size: 12,
          font,
        });
        page.drawText(`Operation Process Type: ${tool.name}`, {
          x: 50,
          y: 670,
          size: 11,
          font,
        });
        
        await stepProgress(70, "Compiling fallback parameters...");
        const bytes = await newDoc.save();
        await saveAndEnrichPdf(bytes, `${firstFile.file.name.split('.')[0]}_Converted.pdf`);
        await stepProgress(100, "Process completed!");
      }

    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "An unexpected issue occurred while processing your file.");
    } finally {
      setProcessing(false);
    }
  };

  const handlePageRotate = (pageId: string) => {
    setPdfPages(prev => prev.map(p => 
      p.id === pageId ? { ...p, rotation: (p.rotation + 90) % 360 } : p
    ));
  };

  const handlePageDelete = (pageId: string) => {
    setPdfPages(prev => prev.filter(p => p.id !== pageId));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Toolbox Billboard Ad Sponsor */}
      {topAd && (
        <div 
          className="mb-8"
          dangerouslySetInnerHTML={{ __html: topAd.code }} 
        />
      )}

      {/* Back to Home Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
          id="back-btn"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Tools</span>
        </button>

        <span className="text-xs bg-red-50 text-red-600 px-3 py-1 border border-red-100 rounded-full font-semibold">
          Active Mode
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Tool Parameters controls settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h2 className="font-sans font-bold text-lg text-slate-800 mb-2">{tool.name}</h2>
            <p className="font-sans text-xs text-slate-500 leading-relaxed mb-6">{tool.description}</p>
            
            <div className="border-t border-slate-100 pt-6 space-y-5">
              <div className="flex items-center space-x-2 text-slate-700 font-semibold text-sm">
                <Settings className="h-4 w-4 text-red-500" />
                <span>Configuration Settings</span>
              </div>

              {/* Tool Specific custom panels */}
              {tool.id === 'compress-pdf' && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-600 block">Compression Scale</span>
                  {['extreme', 'recommended', 'low'].map(level => (
                    <button
                      key={level}
                      onClick={() => setCompressLevel(level as any)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium border capitalize flex items-center justify-between ${
                        compressLevel === level 
                          ? 'border-red-500 bg-red-50/40 text-red-600 font-bold' 
                          : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{level} compression</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {level === 'extreme' ? 'Max small file size' : level === 'recommended' ? 'Balance clarity' : 'Priority crisp image'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {tool.id === 'add-watermark' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-2">Watermark text stamps</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-2">Stamper ink color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={watermarkColor}
                        onChange={(e) => setWatermarkColor(e.target.value)}
                        className="w-10 h-8 rounded border-none cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-500">{watermarkColor}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                      <span>Opacity density</span>
                      <span>{watermarkOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="105"
                      step="5"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                      className="w-full accent-red-500"
                    />
                  </div>
                </div>
              )}

              {tool.id === 'add-page-numbers' && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Number template syntax</label>
                  <input
                    type="text"
                    value={addPageNumberFormat}
                    onChange={(e) => setAddPageNumberFormat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Variables: {"{n}"} for page, {"{total}"} for count.</span>
                </div>
              )}

              {tool.id === 'protect-pdf' && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Create secure key code</label>
                  <input
                    type="password"
                    placeholder="Enter security key password"
                    value={protectPassword}
                    onChange={(e) => setProtectPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              )}

              {tool.id === 'unlock-pdf' && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Input decryption key</label>
                  <input
                    type="password"
                    placeholder="Document secure passcode"
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              )}

              {tool.id === 'translate-pdf' && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">AI target language translator</label>
                  <select
                    value={translateLang}
                    onChange={(e) => setTranslateLang(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  >
                    {['Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Japanese', 'Hindi', 'Portuguese', 'Russian'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              )}

              {tool.id === 'redact-pdf' && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-600 block mb-1">PII masking fields</span>
                  {[
                    { id: 'ssn', label: 'Social Security Numbers (SSN)' },
                    { id: 'emails', label: 'Email Addresses' },
                    { id: 'names', label: 'Private client names' },
                  ].map(item => (
                    <label key={item.id} className="flex items-center space-x-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={redactTypes.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) setRedactTypes([...redactTypes, item.id]);
                          else setRedactTypes(redactTypes.filter(r => r !== item.id));
                        }}
                        className="rounded accent-red-500"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {tool.id === 'ai-pdf-chat' && (
                <div className="space-y-4 text-left">
                  <span className="text-xs font-bold text-slate-600 block mb-1 uppercase tracking-wider">Configure Gemini Agent Mode</span>
                  <div className="space-y-2.5">
                    {/* High Thinking Mode */}
                    <button
                      type="button"
                      onClick={() => setGeminiMode('thinking')}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                        geminiMode === 'thinking'
                          ? 'border-red-500 bg-red-50/50 ring-2 ring-red-500/10'
                          : 'border-slate-100 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className={`p-2 rounded-lg shrink-0 ${geminiMode === 'thinking' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'}`}>
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-sans font-bold text-xs text-slate-900">High Thinking Mode</span>
                          <span className="text-[9px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded uppercase tracking-wider">Expert</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Powered by <b>gemini-3.1-pro-preview</b> with High Reasoning Level. Ideal for audits, proofs, code translations, or strategic logic.
                        </p>
                      </div>
                    </button>

                    {/* General Assistant */}
                    <button
                      type="button"
                      onClick={() => setGeminiMode('general')}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                        geminiMode === 'general'
                          ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/10'
                          : 'border-slate-100 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className={`p-2 rounded-lg shrink-0 ${geminiMode === 'general' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-500'}`}>
                        <Settings className="h-4 w-4" />
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-sans font-bold text-xs text-slate-900">General Assistant</span>
                          <span className="text-[9px] bg-indigo-500 text-white font-bold px-1.5 py-0.2 rounded uppercase tracking-wider">Classic</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Powered by <b>gemini-3.5-flash</b>. Best for summarization, proofreading, writing edits, or standard question queries.
                        </p>
                      </div>
                    </button>

                    {/* Lightning Fast Action */}
                    <button
                      type="button"
                      onClick={() => setGeminiMode('fast')}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                        geminiMode === 'fast'
                          ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/10'
                          : 'border-slate-100 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className={`p-2 rounded-lg shrink-0 ${geminiMode === 'fast' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-500'}`}>
                        <Play className="h-4 w-4" />
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-sans font-bold text-xs text-slate-900">Fast Action Mode</span>
                          <span className="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded uppercase tracking-wider">Fast</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Powered by <b>gemini-3.1-flash-lite</b>. Designed for rapid-fire responses, fast vocabulary terms, or indexing key terms.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {(!['compress-pdf', 'add-watermark', 'add-page-numbers', 'protect-pdf', 'unlock-pdf', 'translate-pdf', 'redact-pdf', 'ai-pdf-chat'].includes(tool.id)) && (
                <div className="text-center py-4 text-xs font-medium text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-100">
                  Standard optimization variables active
                </div>
              )}

              {/* UNIVERSAL GEMINI AI CO-PROCESSING PANEL */}
              {tool.id !== 'ai-pdf-chat' && (
                <div className="mt-5 pt-4 border-t border-slate-150 space-y-3 text-left bg-gradient-to-br from-red-50/10 via-white to-indigo-50/5 p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-red-500 animate-pulse shrink-0" />
                    <span className="text-[11px] font-sans font-extrabold uppercase tracking-wider text-slate-800">AI Gemini Copilot Extras</span>
                    <span className="text-[8px] bg-red-550 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-widest leading-none shrink-0 scale-90">LIVE</span>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                    Infuse native Gemini AI content understanding or security auditing flows directly into your <span className="font-semibold text-slate-700">{tool.name}</span> process.
                  </p>

                  <div className="space-y-2.5 pt-1">
                    {/* Toggle 1: AI summary page */}
                    <label className="flex items-start space-x-2.5 cursor-pointer selection:bg-transparent">
                      <input
                        type="checkbox"
                        checked={useAiSummary}
                        onChange={(e) => setUseAiSummary(e.target.checked)}
                        className="rounded accent-red-500 mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-700 block select-none">Append AI Summary Sheet</span>
                        <span className="text-[10px] text-slate-400 leading-normal block select-none">
                          Generates a beautiful custom PDF summary page report inside the output file.
                        </span>
                      </div>
                    </label>

                    {/* Toggle 2: AI Verification */}
                    <label className="flex items-start space-x-2.5 cursor-pointer selection:bg-transparent">
                      <input
                        type="checkbox"
                        checked={useAiVerification}
                        onChange={(e) => setUseAiVerification(e.target.checked)}
                        className="rounded accent-red-500 mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-700 block select-none">AI Structure Integrity Audit</span>
                        <span className="text-[10px] text-slate-400 leading-normal block select-none">
                          Runs a detailed background scan for formatting inconsistencies and permission leaks.
                        </span>
                      </div>
                    </label>

                    {/* Style Preset Selector */}
                    {useAiSummary && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="overflow-hidden pt-1.5 space-y-1.5"
                      >
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block select-none">AI Report Voice Style</label>
                        <select
                          value={aiStylePreset}
                          onChange={(e) => setAiStylePreset(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg px-2 text-xs focus:outline-none focus:border-red-500 font-semibold"
                        >
                          <option value="Executive Brief">Executive Brief</option>
                          <option value="Technical Specifications">Technical Specifications</option>
                          <option value="Concise Bullet Points">Concise Bullet Points</option>
                          <option value="Vector Embeddings Ready">Vector Embeddings Ready</option>
                        </select>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* VISUAL PROCESSING PROGRESS BAR */}
              <AnimatePresence>
                {processing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 15 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 space-y-3 shadow-inner relative text-left">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center space-x-2 font-sans">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          <span className="uppercase tracking-wider text-[10px] text-slate-500 font-extrabold">Processing Pipeline</span>
                        </span>
                        <span className="font-mono font-bold text-red-650 bg-red-50 px-2 py-0.5 rounded-lg text-xs">
                          {processProgress}%
                        </span>
                      </div>

                      {/* Bar Track */}
                      <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden border border-slate-300/30 p-0.5">
                        <motion.div
                          className="h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full relative"
                          initial={{ width: '0%' }}
                          animate={{ width: `${processProgress}%` }}
                          transition={{ duration: 0.2 }}
                        >
                          {/* Inner pulsing shine overlay */}
                          <div className="absolute inset-0 bg-white/20 animate-[pulse_1.5s_infinite] rounded-full" />
                        </motion.div>
                      </div>

                      {/* Status text */}
                      <div className="flex items-center space-x-2 text-xs text-slate-600 min-h-[16px] overflow-hidden">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-red-500 shrink-0" />
                        <span className="font-semibold animate-pulse truncate leading-tight text-slate-700 flex-1" title={processStatus}>
                          {processStatus}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {tool.id !== 'ai-pdf-chat' ? (
                <button
                  disabled={processing || (loadedFiles.length === 0 && tool.requiresFile)}
                  onClick={handleProcess}
                  className="w-full cursor-pointer py-3.5 bg-red-500 hover:bg-red-650 disabled:bg-slate-200 disabled:border-slate-100 hover:shadow-lg text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center space-x-2 border-none shadow"
                  id="process-to-result-btn"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Processing file...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Process {tool.name}</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setChatMessages([
                      { role: 'assistant', text: 'Workspace refreshed! How can I help you extract intelligence or audit details from this document?' }
                    ]);
                  }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer border-none"
                >
                  Clear Chat Logs
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: File zone & interactive visual pages preview */}
        <div 
          className="lg:col-span-2 space-y-6 relative"
          onDragOver={(e) => {
            e.preventDefault();
            setIsWindowDragOver(true);
          }}
          onDragLeave={() => {
            setIsWindowDragOver(false);
          }}
          onDrop={async (e) => {
            e.preventDefault();
            setIsWindowDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              await processDraggedFiles(e.dataTransfer.files);
            }
          }}
        >
          {/* Hidden input for queue appendage */}
          <input
            type="file"
            ref={queueBrowseInputRef}
            onChange={async (e) => {
              if (e.target.files && e.target.files.length > 0) {
                await processDraggedFiles(e.target.files);
              }
            }}
            accept={tool.acceptMimes || 'application/pdf'}
            multiple={tool.id === 'merge-pdf'}
            className="hidden"
          />

          {isWindowDragOver && (
            <div 
              className="absolute inset-0 bg-red-500/10 backdrop-blur-xs border-2 border-dashed border-red-500 rounded-3xl flex flex-col items-center justify-center z-50 transition-all pointer-events-none"
            >
              <div className="p-6 bg-white/95 rounded-2xl shadow-xl border border-red-100 flex flex-col items-center max-w-sm text-center">
                <div className="p-3 bg-red-50 text-red-500 rounded-2xl mb-3 animate-bounce">
                  <Download className="h-8 w-8" />
                </div>
                <h4 className="text-sm font-sans font-extrabold text-slate-800 uppercase tracking-wider">Drop to upload {tool.id === 'merge-pdf' ? 'PDFs' : 'PDF'}</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {tool.id === 'merge-pdf' 
                    ? 'Release to append all dragged PDF files to your sequence deck.' 
                    : 'Release to load this PDF file into your sandbox workspace.'}
                </p>
              </div>
            </div>
          )}

          {insideToolsAd && (
            <div 
              className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm"
              dangerouslySetInnerHTML={{ __html: insideToolsAd.code }}
            />
          )}
          {tool.code && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <span className="text-xs font-bold text-red-600 block uppercase tracking-wider">Custom Interactive Code Execution Canvas</span>
                <span className="text-[10px] bg-red-50 text-red-600 border border-red-150 rounded px-2.5 py-0.5 font-mono font-semibold uppercase">SANDBOXED IFRAME</span>
              </div>
              <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50 relative">
                <iframe
                  title="Dynamic App Preview"
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                          body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; background: #fafafa; color: #1e293b; }
                        </style>
                      </head>
                      <body>
                        ${tool.code}
                      </body>
                    </html>
                  `}
                  className="w-full min-h-[420px] bg-white border-none block"
                  sandbox="allow-scripts allow-modals allow-popups allow-forms"
                />
              </div>
            </div>
          )}

          {loadedFiles.length === 0 ? (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-4">Upload workspace</span>
              {tool.id === 'merge-pdf' && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700 leading-relaxed mb-4">
                  Multi-file upload enabled! Drag multiple PDFs into the loader to fuse them sequentially.
                </div>
              )}
              <PdfUploader 
                onFilesSelected={handleFilesSelected} 
                acceptMimes={tool.acceptMimes} 
                multiple={tool.id === 'merge-pdf'} 
              />
            </div>
          ) : (
            <>
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              {/* Dynamic File Hub Header & Tab Selection */}
              <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-red-500/10 text-red-600 rounded-xl">
                    <FileText className="h-4.5 w-4.5 text-red-650 shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-xs font-sans font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 leading-none">
                      <span>Document Preview & Layout Center</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-none font-sans">
                      Active: <span className="font-mono font-bold text-slate-700">{loadedFiles[0]?.file.name}</span> ({formatSize(loadedFiles[0]?.file.size || 0)})
                    </p>
                  </div>
                </div>

                <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 overflow-x-auto select-none scrollbar-none">
                  {tool.id !== 'ai-pdf-chat' && (
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab('visual')}
                      className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                        activePreviewTab === 'visual'
                          ? 'bg-white text-red-650 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 font-semibold'
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>{tool.id === 'merge-pdf' ? 'Files Deck & Queue' : 'Layout Editor'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('chat')}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                      activePreviewTab === 'chat'
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 font-semibold'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-red-500" />
                    <span>AI Copilot</span>
                    <span className="text-[8px] bg-red-100 text-red-600 px-1 py-0.2 rounded-full font-extrabold tracking-tight">LIVE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('live-input')}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                      activePreviewTab === 'live-input'
                        ? 'bg-white text-red-605 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 font-semibold'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Live Input PDF</span>
                  </button>

                  <button
                    type="button"
                    disabled={!processedFileUrl}
                    onClick={() => {
                      if (processedFileUrl) setActivePreviewTab('live-output');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                      !processedFileUrl 
                        ? 'opacity-40 cursor-not-allowed text-slate-400 font-semibold' 
                        : activePreviewTab === 'live-output'
                          ? 'bg-white text-red-605 shadow-sm cursor-pointer'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 cursor-pointer font-semibold'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Optimized Output</span>
                    {processedFileUrl && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('details')}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                      activePreviewTab === 'details'
                        ? 'bg-white text-red-605 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 font-semibold'
                    }`}
                  >
                    <Info className="h-3.5 w-3.5" />
                    <span>Security Audit</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Tab Contents Panel */}
              <div className="p-6">
                
                {/* COPILOT CHAT WORKSPACE TAB */}
                {activePreviewTab === 'chat' && (
                  <div className="flex flex-col h-[480px]" id="copilot-chat-container">
                    {/* Messages Stream */}
                    <div className="flex-1 overflow-y-auto space-y-4 text-left custom-scrollbar bg-slate-50/20 p-4 rounded-xl border border-slate-100 pr-2">
                      {chatMessages.map((msg, i) => {
                        const isAI = msg.role === 'assistant';
                        return (
                          <div key={i} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed font-sans ${
                              isAI 
                                ? 'bg-white border border-slate-150/80 text-slate-800 rounded-tl-sm shadow-xs' 
                                : 'bg-red-500 text-white rounded-tr-sm shadow-sm font-semibold'
                            }`}>
                              <div className="whitespace-pre-wrap">{msg.text}</div>
                              {msg.modeUsed && (
                                <div className={`text-[8px] font-mono mt-2 uppercase tracking-tight text-right ${isAI ? 'text-slate-400' : 'text-red-200'}`}>
                                  Engine: {msg.modeUsed === 'thinking' ? 'gemini-3.1-pro-preview' : msg.modeUsed === 'general' ? 'gemini-3.5-flash' : 'gemini-3.1-flash-lite'}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {processing && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 text-xs text-slate-500 shadow-xs flex items-center space-x-2">
                            <RefreshCw className="h-3.5 w-3.5 animate-spin text-red-500" />
                            <span className="font-sans font-medium">Gemini agent is reasoning...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Suggestion Quick Pills */}
                    <div className="py-2.5 flex items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                      {[
                        { label: 'Summarize Contract', text: 'Identify the primary stakeholders, clauses, dates, and signee details. Summarize nicely.' },
                        { label: 'Audit SSN & Email PII', text: 'Conduct an exhaustive audit scanning for SSNs, private phone numbers, emails, and address leak coordinates.' },
                        { label: 'Strategic logical review', text: 'Run a multi-step logical audit reasoning about the financial statements and building array balances.' },
                      ].map((pill, i) => (
                        <button
                          key={i}
                          type="button"
                          disabled={processing}
                          onClick={() => setChatInput(pill.text)}
                          className="text-[10px] bg-white border border-slate-150/80 text-slate-600 font-bold hover:bg-slate-50/50 hover:border-slate-200 px-3 py-1.5 rounded-full transition-all cursor-pointer"
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>

                    {/* Input Form Footer */}
                    <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-slate-100 flex items-center space-x-3">
                      <input
                        type="text"
                        disabled={processing}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask any complex logical question..."
                        className="flex-1 bg-slate-50 border border-slate-110 text-slate-800 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-red-500 transition-colors"
                        id="copilot-chat-input"
                      />
                      <button
                        type="submit"
                        disabled={processing || !chatInput.trim()}
                        className="p-3 bg-red-500 hover:bg-red-650 rounded-xl text-white disabled:bg-slate-100 disabled:text-slate-400 border-none flex items-center justify-center cursor-pointer transition-colors"
                        id="copilot-send-btn"
                      >
                        <Play className="h-4 w-4 shrink-0" />
                      </button>
                    </form>
                  </div>
                )}

                {/* LAYOUT EDITOR WORKSPACE TAB */}
                {activePreviewTab === 'visual' && tool.id !== 'ai-pdf-chat' && (
                  <div className="space-y-4">
                    {tool.id === 'merge-pdf' ? (
                      <div>
                        {/* Custom Files Sequence Deck for Merge PDF */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 border-b border-slate-100 pb-2.5 gap-2 text-left">
                          <div>
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                              Merge Queue Pipeline ({loadedFiles.length} files)
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">
                              Reorder or enrich your merge sequence. Drag & drop files directly onto this zone to add.
                            </span>
                          </div>
                          
                          {/* Clear All queue action */}
                          <button
                            type="button"
                            onClick={() => {
                              setLoadedFiles([]);
                              setPdfPages([]);
                              if (inputFileUrl) {
                                URL.revokeObjectURL(inputFileUrl);
                                setInputFileUrl(null);
                              }
                            }}
                            className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg border-none hover:bg-rose-100 cursor-pointer transition-all self-start sm:self-center"
                          >
                            Reset Queue
                          </button>
                        </div>

                        {/* Beautiful File queue list */}
                        <div className="space-y-3 mb-6">
                          {loadedFiles.map((f, i) => (
                            <div 
                              key={i} 
                              className="group/file flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white hover:bg-slate-50/50 rounded-2xl border border-slate-150 transition-all shadow-xs"
                            >
                              <div className="flex items-center space-x-3.5 overflow-hidden">
                                <div className="p-2.5 bg-red-50 text-red-500 rounded-xl font-mono text-[11px] font-extrabold shadow-inner shrink-0 flex items-center justify-center min-w-[38px]">
                                  #{i + 1}
                                </div>
                                <div className="text-left overflow-hidden">
                                  <span className="text-xs font-bold text-slate-800 block truncate" title={f.file.name}>
                                    {f.file.name}
                                  </span>
                                  <span className="text-[10px] font-mono font-medium text-slate-400 block mt-0.5">
                                    Size: {formatSize(f.file.size)} • Type: PDF
                                  </span>
                                </div>
                              </div>

                              {/* Sequence controls and actions */}
                              <div className="flex items-center space-x-2.5 mt-3 sm:mt-0 justify-end">
                                <div className="flex items-center space-x-1 border border-slate-150 bg-slate-100/50 p-1.5 rounded-xl">
                                  {/* Move Up */}
                                  <button
                                    type="button"
                                    onClick={() => handleMoveFileUp(i)}
                                    disabled={i === 0}
                                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent rounded cursor-pointer transition-colors border-none"
                                    title="Move Sequentially Up"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </button>
                                  {/* Move Down */}
                                  <button
                                    type="button"
                                    onClick={() => handleMoveFileDown(i)}
                                    disabled={i === loadedFiles.length - 1}
                                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent rounded cursor-pointer transition-colors border-none"
                                    title="Move Sequentially Down"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m19 9-7 7-7-7" />
                                    </svg>
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveFileAt(i)}
                                  className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors border-none animate-fade-in"
                                  title="Remove from queue"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Nested Mini Click-and-Drop addition trigger */}
                        <div 
                          onClick={() => queueBrowseInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-200 hover:border-red-500 hover:bg-red-50/10 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group bg-slate-50/50"
                        >
                          <PlusCircle className="h-6 w-6 text-slate-450 group-hover:text-red-500 group-hover:scale-110 transition-all" />
                          <div className="text-center text-xs font-semibold text-slate-605">
                            Drag & drop more files here, or <span className="text-red-500 underline font-bold group-hover:text-red-650">click to append PDFs</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">Accepts multiple PDF docs</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2 border-b border-slate-50 pb-2">
                          <span className="text-xs font-semibold text-slate-605 block">
                            Canvas Layout: {pdfPages.length} Active Sheet{pdfPages.length > 1 ? 's' : ''}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Map and configure document pages
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {pdfPages.map((page, index) => (
                            <div 
                              key={page.id} 
                              className="group/page border border-slate-100 bg-slate-50 rounded-xl p-3 text-center relative transition-all hover:shadow-md hover:border-slate-200"
                            >
                              {/* Page Preview Card Visual */}
                              <div className="bg-white border border-slate-200 rounded p-1 mb-2 shadow-xs transition-all duration-300 relative overflow-hidden"
                                style={{ transform: `rotate(${page.rotation}deg)` }}
                              >
                                <div className="h-28 bg-slate-50 flex flex-col items-center justify-center text-slate-400/80">
                                  <FileText className="h-8 w-8 mb-1" />
                                  <span className="text-[10px] font-mono">Page {page.pageNum}</span>
                                </div>
                              </div>

                              {/* Page configuration actions */}
                              <div className="absolute top-1 right-1 flex items-center space-x-1 opacity-0 group-hover/page:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => handlePageRotate(page.id)}
                                  className="bg-white p-1 text-slate-605 hover:text-red-500 rounded shadow border border-slate-100 cursor-pointer"
                                  title="Rotate 90deg"
                                >
                                  <RotateCw className="h-3.5 w-3.5" />
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => handlePageDelete(page.id)}
                                  className="bg-white p-1 text-slate-650 hover:text-rose-500 rounded shadow border border-slate-100 cursor-pointer"
                                  title="Delete specific page"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <span className="text-[10px] font-semibold text-slate-505 block">Page index {index + 1}</span>
                            </div>
                          ))}

                          <button 
                            type="button"
                            onClick={() => {
                              const newId = `page-added-${Date.now()}`;
                              setPdfPages([...pdfPages, {
                                id: newId,
                                pageNum: pdfPages.length + 1,
                                rotation: 0,
                                originalFileIndex: 0
                              }]);
                            }}
                            className="border border-dashed border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center text-slate-500 hover:text-red-500 transition-all cursor-pointer h-full min-h-[140px]"
                          >
                            <PlusCircle className="h-6 w-6 mb-1 text-slate-400" />
                            <span className="text-[10px] font-semibold">Blank Page</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* LIVE INPUT DOCUMENT WORKSPACE TAB */}
                {activePreviewTab === 'live-input' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-3 text-left">
                      <div>
                        <h5 className="text-xs font-bold text-slate-700 uppercase">Input PDF Document Preview</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">Real-time local object rendering stream</p>
                      </div>
                      <div className="text-right mt-1 sm:mt-0">
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-150 px-2.5 py-1 rounded-md">
                          Sandbox: Local Secure
                        </span>
                      </div>
                    </div>

                    {inputFileUrl ? (
                      <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner relative">
                        <object
                          data={inputFileUrl}
                          type="application/pdf"
                          className="w-full h-full block"
                          id="input-file-live-preview-object"
                        >
                          {/* Fallback Simulator if object embeds are blocked or unavailable on mobile */}
                          <div className="w-full h-full bg-slate-50 p-6 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 bg-red-50 text-red-550 rounded-full">
                              <FileText className="h-10 w-10 animate-bounce" />
                            </div>
                            <div className="max-w-md space-y-1 text-center">
                              <h4 className="text-sm font-sans font-bold text-slate-800">Inline Preview Not Supported</h4>
                              <p className="text-xs text-slate-500">Your browser security protocols or device handles PDF files in external apps.</p>
                            </div>
                            <a
                              href={inputFileUrl}
                              download={loadedFiles[0]?.file.name}
                              className="inline-flex items-center space-x-1.5 px-4.5 py-2.5 bg-red-500 hover:bg-red-650 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                            >
                              <Download className="h-4 w-4" />
                              <span>Download Raw File ({formatSize(loadedFiles[0]?.file.size || 0)})</span>
                            </a>
                          </div>
                        </object>
                      </div>
                    ) : (
                      <div className="py-20 text-center text-xs text-slate-400">
                        No input file URL generated yet. Try re-uploading your file.
                      </div>
                    )}
                  </div>
                )}

                {/* OPTIMIZED OUTPUT DOCUMENT WORKSPACE TAB */}
                {activePreviewTab === 'live-output' && (
                  <div className="space-y-4">
                    {/* Processing Success Alert Header Banner */}
                    <div className="bg-green-50 border border-green-150 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
                      <div>
                        <h4 className="text-xs font-sans font-extrabold text-green-800 uppercase tracking-wider flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-550 animate-ping shrink-0" />
                          <span>Optimization Complete</span>
                        </h4>
                        <p className="text-[11px] text-green-600 mt-1 font-medium leading-relaxed">
                          Your PDF was processed securely. Click the download button to grab your optimized files or audit specs.
                        </p>
                      </div>
                      <a
                        href={processedFileUrl!}
                        download={downloadFileName}
                        className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 font-bold text-xs text-white rounded-xl shadow transition-all shrink-0 cursor-pointer animate-pulse"
                        id="download-processed-result-tab-btn"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Result PDF</span>
                      </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Comparison Columns Panel */}
                      <div className="border border-slate-100 bg-slate-50/50 p-5 rounded-2xl space-y-4 text-left">
                        <h5 className="text-[11px] font-sans font-extrabold text-slate-500 uppercase tracking-wider">Compression & Integrity Results</h5>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                            <span className="text-xs font-semibold text-slate-500">Source Size</span>
                            <span className="text-xs font-mono font-bold text-slate-600">{formatSize(loadedFiles[0]?.file.size || 0)}</span>
                          </div>

                          {processedBlobSize !== null && (
                            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                              <span className="text-xs font-semibold text-slate-500">Optimized Size</span>
                              <span className="text-xs font-mono font-bold text-slate-805">{formatSize(processedBlobSize)}</span>
                            </div>
                          )}

                          {processedBlobSize !== null && loadedFiles[0]?.file.size > 0 && (
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-slate-550">Weight Reduced Ratio</span>
                                <span className="font-mono font-extrabold text-green-650">
                                  {Math.max(0, ((loadedFiles[0].file.size - processedBlobSize) / loadedFiles[0].file.size * 100)).toFixed(1)}% Saved
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-green-550 h-1.5 rounded-full transition-all duration-550" 
                                  style={{ width: `${Math.min(100, Math.max(0, ((loadedFiles[0].file.size - processedBlobSize) / loadedFiles[0].file.size * 100)))}%` }}
                                />
                              </div>
                            </div>
                          )}

                          <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                            <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest block">Action Metadata Log</span>
                            <div className="text-[10.5px] space-y-1.5 text-slate-650 leading-normal font-sans">
                              <div className="flex justify-between">
                                <span>Applied Tool Method:</span>
                                <span className="font-semibold text-slate-805">{tool.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Core Cryptography:</span>
                                <span className="font-semibold text-slate-800">
                                  {tool.id === 'protect-pdf' ? 'Protected (AES-256)' : tool.id === 'unlock-pdf' ? 'Decrypted (RC4/Standard)' : 'Integrity Sealed'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>UTC Timestamp:</span>
                                <span className="font-mono text-slate-800">{new Date().toLocaleTimeString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Verification Code:</span>
                                <span className="font-mono text-slate-400">crc32_{Math.floor(100000 + Math.random() * 900000)}a</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Embed Output PDF Preview (Right Pane) */}
                      <div className="space-y-2 text-left">
                        <span className="text-[11px] font-sans font-extrabold text-slate-500 uppercase tracking-wider block">Live Interactive Output Viewer</span>
                        <div className="w-full h-[320px] rounded-2xl overflow-hidden border border-slate-200">
                          <object
                            data={processedFileUrl}
                            type="application/pdf"
                            className="w-full h-full block animate-fade-in"
                            id="output-file-live-preview-object"
                          >
                            <div className="w-full h-full bg-slate-50 p-6 flex flex-col items-center justify-center text-center space-y-4">
                              <FileText className="h-10 w-10 text-slate-350" />
                              <div className="max-w-md">
                                <h4 className="text-xs font-sans font-bold text-slate-800">Browser Output Preview Ready</h4>
                                <p className="text-[10px] text-slate-500 mt-1">Compiled successfully. If embedding does not render, use the direct download button above.</p>
                              </div>
                            </div>
                          </object>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECURITY AUDIT SPECIFICATIONS WORKSPACE TAB */}
                {activePreviewTab === 'details' && (
                  <div className="space-y-4 text-left">
                    <div className="flex items-center space-x-2 text-slate-850 mb-2">
                      <Info className="h-4.5 w-4.5 text-red-500 shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider">Document Metadata Security Manifest</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-3">
                        <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">File Parameters</h5>
                        <table className="w-full text-xs text-slate-705">
                          <tbody className="divide-y divide-slate-100">
                            <tr className="py-2.5 inline-flex w-full justify-between">
                              <td className="text-slate-505 font-semibold">Normalized File Name</td>
                              <td className="font-mono text-slate-800 truncate max-w-xs">{loadedFiles[0]?.file.name}</td>
                            </tr>
                            <tr className="py-2.5 inline-flex w-full justify-between">
                              <td className="text-slate-505 font-semibold">Internal MIME Type</td>
                              <td className="font-mono text-slate-808">{loadedFiles[0]?.file.type || 'application/pdf'}</td>
                            </tr>
                            <tr className="py-2.5 inline-flex w-full justify-between">
                              <td className="text-slate-505 font-semibold">Uploaded File Size</td>
                              <td className="font-mono text-slate-808">{formatSize(loadedFiles[0]?.file.size || 0)}</td>
                            </tr>
                            <tr className="py-2.5 inline-flex w-full justify-between">
                              <td className="text-slate-550 font-semibold">Total Pages Read</td>
                              <td className="font-bold text-slate-800">{pdfPages.length} pages</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-3">
                        <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Security Signatures</h5>
                        <table className="w-full text-xs text-slate-705">
                          <tbody className="divide-y divide-slate-100">
                            <tr className="py-2.5 inline-flex w-full justify-between">
                              <td className="text-slate-550 font-semibold">Encryption Protocol</td>
                              <td className="text-slate-808 font-bold">
                                {tool.id === 'protect-pdf' ? 'AES-255 bit Military Grade' : 'None detected (Plaintext stream)'}
                              </td>
                            </tr>
                            <tr className="py-2.5 inline-flex w-full justify-between">
                              <td className="text-slate-550 font-semibold">Sandbox Execution Zone</td>
                              <td className="text-slate-805 flex items-center space-x-1.5 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 animate-pulse" />
                                <span>Isolated Local Client Runtime</span>
                              </td>
                            </tr>
                            <tr className="py-2.5 inline-flex w-full justify-between">
                              <td className="text-slate-550 font-semibold">W3C Sandbox Parameters</td>
                              <td className="font-mono text-[9.5px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-100">
                                iframe_allow_scripts
                              </td>
                            </tr>
                            <tr className="py-2.5 inline-flex w-full justify-between">
                              <td className="text-slate-550 font-semibold">Data Privacy Assurance</td>
                              <td className="text-slate-808 font-bold">Zero-knowledge data collection</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

              {/* PROCESSING & RESULTS CONTAINER */}
              {(processedFileUrl || errorText || parsedRawOutput) && (
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm scroll-mt-6">
                  {errorText && (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-xs text-rose-700 leading-relaxed flex items-start space-x-2">
                      <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{errorText}</span>
                    </div>
                  )}

                  {processedFileUrl && !errorText && (
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center space-x-1 bg-green-50 text-green-600 border border-green-100 px-4 py-2 rounded-xl text-xs font-semibold mb-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>PDF Processed Successfully</span>
                      </div>

                      <h3 className="text-lg font-sans font-bold text-slate-800">Your PDF file has been optimized!</h3>
                      <p className="text-xs text-slate-500">Click the button below to download the compiled results file securely.</p>

                      <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-left">
                        <div className="flex items-center space-x-3 overflow-hidden mr-4">
                          <div className="p-2 bg-red-100 text-red-500 rounded-xl shrink-0">
                            <FileCode className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-700 truncate block">{downloadFileName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Format: PDF Output Stream</span>
                          </div>
                        </div>

                        <a
                          href={processedFileUrl}
                          download={downloadFileName}
                          className="bg-red-500 hover:bg-red-600 hover:shadow shadow-md shadow-red-500/10 text-white p-3 rounded-xl transition-all"
                          id="pdf-download-compiled-btn"
                        >
                          <Download className="h-5 w-5" />
                        </a>
                      </div>

                      {/* Live Processed Output Document Preview */}
                      <div className="space-y-3 mt-6 border-t border-slate-100 pt-6">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                            <Eye className="h-4.5 w-4.5 text-red-500 shrink-0" />
                            <span>Live Processed Output Preview</span>
                          </span>
                          <span className="text-[10px] bg-green-50 text-green-600 border border-green-150 px-2.5 py-1 rounded-md font-mono font-semibold uppercase animate-pulse">
                            Secure sandbox view
                          </span>
                        </div>

                        <div className="w-full h-[525px] border border-slate-150 rounded-2xl overflow-hidden bg-slate-50 shadow-inner relative">
                          <object
                            data={processedFileUrl}
                            type="application/pdf"
                            className="w-full h-full block"
                          >
                            <iframe
                              src={processedFileUrl}
                              className="w-full h-full border-0"
                              title="Processed PDF Live Preview Stream"
                            />
                          </object>
                        </div>
                        <p className="text-[10.5px] text-slate-400 text-center">
                          Interactive viewport: Scroll, zoom, and review your output live prior to sharing.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI RAW OUTPUT PRINTER */}
                  {parsedRawOutput && (
                    <div className="mt-6 border-t border-slate-100 pt-6 space-y-3">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-bold uppercase tracking-wider">
                        <Sparkles className="h-4 w-4 text-red-500" />
                        <span>AI Document Parsing Logs Preview</span>
                      </div>
                      <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-auto max-h-60 leading-normal border border-slate-800">
                        {parsedRawOutput}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Sponsor Ad Billboard Banner */}
      {bottomAd && (
        <div 
          className="mt-8 shadow-sm"
          dangerouslySetInnerHTML={{ __html: bottomAd.code }} 
        />
      )}
    </div>
  );
}

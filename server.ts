import express from "express";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { INITIAL_TOOLS, INITIAL_BLOGS, INITIAL_ADS, INITIAL_SITE_SETTINGS, INITIAL_PAGES, INITIAL_HEADER_MENU, INITIAL_FOOTER_MENU, INITIAL_FAQS, INITIAL_CATEGORIES } from "./src/data";

const app = express();
const PORT = 3000;

// Enable JSON bodies up to 50MB for raw files / base64 payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Storage directory
const STORAGE_DIR = path.join(process.cwd(), "storage", "app", "public");
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Persisted File Store Paths
const DB_FILE = path.join(STORAGE_DIR, "system-store.json");

// Define state containers
let toolStates = [...INITIAL_TOOLS];
let categoryStates = [...INITIAL_CATEGORIES];
let blogStates = [...INITIAL_BLOGS];
let adStates = [...INITIAL_ADS];
let siteStates = { ...INITIAL_SITE_SETTINGS };
let pageStates = [...INITIAL_PAGES];
let headerMenuStates = [...INITIAL_HEADER_MENU];
let footerMenuStates = [...INITIAL_FOOTER_MENU];
let faqStates = [...INITIAL_FAQS];
let statStates: { [key: string]: { [date: string]: number } } = {};

// Load persisted data if exists
if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (data.tools) {
      toolStates = data.tools;
      // Merge any newly defined tools from INITIAL_TOOLS that aren't in the saved database
      INITIAL_TOOLS.forEach((initTool) => {
        if (!toolStates.some((t) => t.id === initTool.id)) {
          toolStates.push(initTool);
        }
      });
    }
    if (data.categories) {
      categoryStates = data.categories;
      INITIAL_CATEGORIES.forEach((initCat) => {
        if (!categoryStates.some((c: any) => c.id === initCat.id)) {
          categoryStates.push(initCat);
        }
      });
    } else {
      categoryStates = [...INITIAL_CATEGORIES];
    }
    if (data.blogs) blogStates = data.blogs;
    if (data.pages) {
      pageStates = data.pages;
      INITIAL_PAGES.forEach((initPage) => {
        if (!pageStates.some((p) => p.slug === initPage.slug || p.id === initPage.id)) {
          pageStates.push(initPage);
        }
      });
    } else {
      pageStates = [...INITIAL_PAGES];
    }
    if (data.headerMenu) {
      headerMenuStates = data.headerMenu;
      INITIAL_HEADER_MENU.forEach((initItem) => {
        if (!headerMenuStates.some((item) => (item.type === initItem.type && item.value === initItem.value) || item.label === initItem.label)) {
          let newItem = { ...initItem };
          if (headerMenuStates.some((item) => item.id === newItem.id)) {
            newItem.id = 'h_' + Math.random().toString(36).substr(2, 9);
          }
          headerMenuStates.push(newItem);
        }
      });
    } else {
      headerMenuStates = [...INITIAL_HEADER_MENU];
    }
    // De-duplicate header items and ensure absolute ID uniqueness
    const seenHeaderIds = new Set<string>();
    headerMenuStates = headerMenuStates.map((item) => {
      if (seenHeaderIds.has(item.id)) {
        return {
          ...item,
          id: 'h_' + Math.random().toString(36).substr(2, 9)
        };
      }
      seenHeaderIds.add(item.id);
      return item;
    });

    if (data.footerMenu) {
      footerMenuStates = data.footerMenu;
      INITIAL_FOOTER_MENU.forEach((initItem) => {
        if (!footerMenuStates.some((item) => (item.type === initItem.type && item.value === initItem.value) || item.label === initItem.label)) {
          let newItem = { ...initItem };
          if (footerMenuStates.some((item) => item.id === newItem.id)) {
            newItem.id = 'f_' + Math.random().toString(36).substr(2, 9);
          }
          footerMenuStates.push(newItem);
        }
      });
    } else {
      footerMenuStates = [...INITIAL_FOOTER_MENU];
    }
    // De-duplicate footer items and ensure absolute ID uniqueness
    const seenFooterIds = new Set<string>();
    footerMenuStates = footerMenuStates.map((item) => {
      if (seenFooterIds.has(item.id)) {
        return {
          ...item,
          id: 'f_' + Math.random().toString(36).substr(2, 9)
        };
      }
      seenFooterIds.add(item.id);
      return item;
    });
    if (data.faqs) faqStates = data.faqs;
    if (data.ads) {
      adStates = data.ads;
      // Merge any newly defined ads from INITIAL_ADS that aren't in the saved database
      INITIAL_ADS.forEach((initAd) => {
        if (!adStates.some((ad) => ad.id === initAd.id)) {
          adStates.push(initAd);
        }
      });
    }
    if (data.settings) siteStates = data.settings;
    if (data.stats) statStates = data.stats;
    saveDatabase();
  } catch (err) {
    console.error("Failed to parse database file, using defaults", err);
  }
}

// Helper to save state
function saveDatabase() {
  try {
    const payload = {
      tools: toolStates,
      categories: categoryStates,
      blogs: blogStates,
      pages: pageStates,
      headerMenu: headerMenuStates,
      footerMenu: footerMenuStates,
      ads: adStates,
      faqs: faqStates,
      settings: siteStates,
      stats: statStates,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write database file", err);
  }
}

// Get modern Gemini API client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Ensure first usage records in stats
function incrementUsage(toolId: string) {
  const today = new Date().toISOString().split("T")[0];
  if (!statStates[toolId]) {
    statStates[toolId] = {};
  }
  statStates[toolId][today] = (statStates[toolId][today] || 0) + 1;
  saveDatabase();
}

// ----------------------------------------
// API ENDPOINTS
// ----------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!geminiApiKey });
});

// Download Laravel CMS ZIP Script
app.get("/api/download-laravel-zip", (req, res) => {
  try {
    const zip = new AdmZip();
    const laravelDir = path.join(process.cwd(), "laravel");
    if (!fs.existsSync(laravelDir)) {
      return res.status(404).json({ error: "Laravel directory not found" });
    }
    
    // Add entire laravel project recursively
    zip.addLocalFolder(laravelDir);
    
    const buffer = zip.toBuffer();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=laravel-pdf-pro-cms.zip");
    res.send(buffer);
  } catch (error: any) {
    console.error("Error creating ZIP download:", error);
    res.status(500).json({ error: "Failed to compile ZIP archive: " + error.message });
  }
});

// Settings API
app.get("/api/settings", (req, res) => {
  res.json(siteStates);
});

app.post("/api/settings", (req, res) => {
  siteStates = { ...siteStates, ...req.body };
  saveDatabase();
  res.json({ success: true, settings: siteStates });
});

// Tools API
app.get("/api/tools", (req, res) => {
  res.json(toolStates);
});

app.post("/api/tools", (req, res) => {
  const updatedTool = req.body;
  const exists = toolStates.some((t) => t.id === updatedTool.id);
  if (exists) {
    toolStates = toolStates.map((t) => (t.id === updatedTool.id ? { ...t, ...updatedTool } : t));
  } else {
    toolStates.push(updatedTool);
  }
  saveDatabase();
  res.json({ success: true, tool: updatedTool });
});

// Categories API
app.get("/api/categories", (req, res) => {
  res.json(categoryStates);
});

app.post("/api/categories", (req, res) => {
  const cat = req.body;
  const exists = categoryStates.some((c) => c.id === cat.id);
  if (exists) {
    categoryStates = categoryStates.map((c) => (c.id === cat.id ? { ...c, ...cat } : c));
  } else {
    categoryStates.push(cat);
  }
  saveDatabase();
  res.json({ success: true, category: cat });
});

app.delete("/api/categories/:id", (req, res) => {
  const id = req.params.id;
  categoryStates = categoryStates.filter((c) => c.id !== id);
  saveDatabase();
  res.json({ success: true });
});

// Blogs API
app.get("/api/blogs", (req, res) => {
  res.json(blogStates);
});

app.post("/api/blogs", (req, res) => {
  const b = req.body;
  if (!b.id) {
    // Create new
    const newBlog = {
      id: Date.now().toString(),
      title: b.title,
      slug: b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      summary: b.summary || "",
      content: b.content || "",
      featured_image: b.featured_image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
      seo_title: b.seo_title,
      seo_description: b.seo_description,
      seo_keywords: b.seo_keywords,
      created_at: new Date().toISOString(),
    };
    blogStates.unshift(newBlog);
    saveDatabase();
    res.json({ success: true, blog: newBlog });
  } else {
    // Edit existing
    blogStates = blogStates.map((x) => (x.id === b.id ? { ...x, ...b } : x));
    saveDatabase();
    res.json({ success: true, blog: b });
  }
});

app.delete("/api/blogs/:id", (req, res) => {
  blogStates = blogStates.filter((b) => b.id !== req.params.id);
  saveDatabase();
  res.json({ success: true });
});

// Pages API
app.get("/api/pages", (req, res) => {
  res.json(pageStates);
});

app.post("/api/pages", (req, res) => {
  const p = req.body;
  if (!p.id) {
    // Create new
    const newPage = {
      id: Date.now().toString(),
      title: p.title,
      slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      content: p.content || "",
      isActive: p.isActive !== undefined ? p.isActive : true,
      seoTitle: p.seoTitle || `${p.title} | PDFProTools`,
      seoDescription: p.seoDescription || "",
      seoKeywords: p.seoKeywords || "",
      createdAt: new Date().toISOString()
    };
    pageStates.unshift(newPage);
    saveDatabase();
    res.json({ success: true, page: newPage });
  } else {
    // Edit existing
    pageStates = pageStates.map((x) => (x.id === p.id ? { ...x, ...p } : x));
    saveDatabase();
    res.json({ success: true, page: p });
  }
});

app.delete("/api/pages/:id", (req, res) => {
  pageStates = pageStates.filter((p) => p.id !== req.params.id);
  saveDatabase();
  res.json({ success: true });
});

// Menus API
app.get("/api/menus", (req, res) => {
  res.json({
    headerMenu: headerMenuStates,
    footerMenu: footerMenuStates
  });
});

app.post("/api/menus/header", (req, res) => {
  if (Array.isArray(req.body)) {
    headerMenuStates = req.body;
    saveDatabase();
    res.json({ success: true, headerMenu: headerMenuStates });
  } else {
    res.status(400).json({ error: "Invalid data format. Expected array of MenuItems." });
  }
});

app.post("/api/menus/footer", (req, res) => {
  if (Array.isArray(req.body)) {
    footerMenuStates = req.body;
    saveDatabase();
    res.json({ success: true, footerMenu: footerMenuStates });
  } else {
    res.status(400).json({ error: "Invalid data format. Expected array of MenuItems." });
  }
});

// Ads API
app.get("/api/ads", (req, res) => {
  res.json(adStates);
});

app.post("/api/ads", (req, res) => {
  const { ads } = req.body;
  if (Array.isArray(ads)) {
    adStates = ads;
    saveDatabase();
  }
  res.json({ success: true, ads: adStates });
});

// FAQs API
app.get("/api/faqs", (req, res) => {
  res.json(faqStates.sort((a, b) => a.order - b.order));
});

app.post("/api/faqs", (req, res) => {
  const f = req.body;
  if (!f.id) {
    const nextOrder = faqStates.length > 0 ? Math.max(...faqStates.map((x) => x.order)) + 1 : 1;
    const newFaq = {
      id: "faq_" + Date.now().toString(),
      question: f.question || "",
      answer: f.answer || "",
      order: nextOrder,
    };
    faqStates.push(newFaq);
    saveDatabase();
    res.json({ success: true, faq: newFaq });
  } else {
    faqStates = faqStates.map((x) => (x.id === f.id ? { ...x, question: f.question, answer: f.answer, order: f.order ?? x.order } : x));
    saveDatabase();
    res.json({ success: true, faq: f });
  }
});

app.delete("/api/faqs/:id", (req, res) => {
  faqStates = faqStates.filter((f) => f.id !== req.params.id);
  saveDatabase();
  res.json({ success: true });
});

app.post("/api/faqs/reorder", (req, res) => {
  const { reorderedFaqs } = req.body;
  if (Array.isArray(reorderedFaqs)) {
    faqStates = reorderedFaqs;
    saveDatabase();
    res.json({ success: true, faqs: faqStates });
  } else {
    res.status(400).json({ error: "Expected array of faqs in reorderedFaqs" });
  }
});

// Stats / Usage Analytics API
app.get("/api/stats", (req, res) => {
  const toolUsageList: any[] = [];
  toolStates.forEach((t) => {
    let total = 0;
    const history = statStates[t.id] || {};
    Object.values(history).forEach((val) => {
      total += val;
    });
    toolUsageList.push({
      toolId: t.id,
      toolName: t.name,
      totalCount: total,
      history,
    });
  });
  res.json(toolUsageList);
});

app.post("/api/stats/increment", (req, res) => {
  const { toolId } = req.body;
  if (toolId) {
    incrementUsage(toolId);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Missing toolId" });
  }
});

// --- Dynamic SEO Crawl Optimization Endpoints ---

// robots.txt for search visibility rules
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  const baseUrl = siteStates.siteUrl || "https://pdfprotools.com";
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /storage/temp/

Sitemap: ${baseUrl}/sitemap.xml
`);
});

// dynamic sitemap.xml generated based on current tool, category, page & blog database state
app.get("/sitemap.xml", (req, res) => {
  const baseUrl = siteStates.siteUrl || "https://pdfprotools.com";
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Primary Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  // Add individual active PDF tools
  toolStates.filter(t => t.isActive).forEach(t => {
    xml += `
  <url>
    <loc>${baseUrl}/?tool=${encodeURIComponent(t.id)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add active categorized grids
  categoryStates.filter(c => c.active).forEach(c => {
    xml += `
  <url>
    <loc>${baseUrl}/?category=${encodeURIComponent(c.id)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Add active compliance and informative pages (About Us, privacy-policy, terms-of-service, cookie-policy, etc.)
  pageStates.filter(p => p.isActive).forEach(p => {
    xml += `
  <url>
    <loc>${baseUrl}/?page=${encodeURIComponent(p.slug)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  // Add custom blog / guide articles
  blogStates.forEach(b => {
    xml += `
  <url>
    <loc>${baseUrl}/?blog=${encodeURIComponent(b.id)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(xml);
});

// Raw file storage endpoint (simulate file uploads)
app.post("/api/storage/upload", (req, res) => {
  const { name, dataUri } = req.body;
  if (!name || !dataUri) {
    return res.status(400).json({ error: "Invalid file specifications" });
  }

  try {
    const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid data URI standard" });
    }

    const mime = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const safeName = Date.now() + "_" + name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const filePath = path.join(STORAGE_DIR, safeName);

    fs.writeFileSync(filePath, buffer);

    res.json({
      success: true,
      name: safeName,
      mime,
      url: `/storage/${safeName}`,
    });

    // Simulated Cron Auto Delete (files deleted after 15 minutes of storage)
    setTimeout(() => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Auto deleted temporary file ${safeName}`);
        }
      } catch (err) {
        console.error("Auto delete error", err);
      }
    }, 15 * 60 * 1000);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------
// GEMINI INTELLIGENCE APIS (AI Tools)
// ----------------------------------------
app.post("/api/ai/translate", async (req, res) => {
  if (!ai) {
    return res.status(400).json({ error: "Gemini API key is not configured in Secrets panel yet." });
  }

  const { contentText, targetLanguage } = req.body;
  if (!contentText || !targetLanguage) {
    return res.status(400).json({ error: "Missing required translate data" });
  }

  try {
    const textPrompt = `You are a certified professional document translator. Translate the following document text into "${targetLanguage}". Ensure the tone, headers, lists, and formatting layouts remain intact. Translate strictly, write no explanation comments. Here is the text:\n\n${contentText}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: textPrompt,
    });

    res.json({ translatedText: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/ai/redact", async (req, res) => {
  if (!ai) {
    return res.status(400).json({ error: "Gemini API key is not configured in Secrets panel yet." });
  }

  const { contentText, redactTypes } = req.body; // e.g. ['ssn', 'emails', 'names', 'prices']
  if (!contentText) {
    return res.status(400).json({ error: "Missing text content to redact" });
  }

  try {
    const filterDesc = redactTypes && redactTypes.length > 0 ? redactTypes.join(", ") : "SSNs, Emails, Phone numbers, and private Names";
    const textPrompt = `You are a highly secure automated PII (Personally Identifiable Information) Redaction engine.
Analyze the following text and permanently mask the specified elements: [${filterDesc}].
Replace every redacted word or number with [REDACTED] or [████████] to preserve space length. Keep all other document text, layout, spacing, and numbers exactly the same.
Return ONLY the redacted text without any extra chat wrapper words.

Here is the document to redact:
${contentText}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: textPrompt,
    });

    res.json({ redactedText: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/ai/llam-parse", async (req, res) => {
  if (!ai) {
    return res.status(400).json({ error: "Gemini API key is not configured in Secrets panel yet." });
  }

  const { contentText } = req.body;
  if (!contentText) {
    return res.status(400).json({ error: "Missing text content" });
  }

  try {
    const textPrompt = `Parse the following PDF structural plaintext into a perfect JSON document ready for LlamaIndex indexing (PDF to LLAM standard).
Analyze the hierarchy, capture headings as metadata keys, split logically into chunks with text fields, and link references.
Return ONLY valid JSON block. No markdown markers like \`\`\`json. Here is the text:

${contentText}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: textPrompt,
    });

    // Strip markdown formatting if any remains
    let cleaned = response.text || "";
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

    res.json(JSON.parse(cleaned));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/ai/prepare-ai", async (req, res) => {
  if (!ai) {
    return res.status(400).json({ error: "Gemini API key is not configured in Secrets panel yet." });
  }

  const { contentText } = req.body;
  if (!contentText) {
    return res.status(400).json({ error: "Missing text content" });
  }

  try {
    const textPrompt = `Perform document tokenization pre-processing. Reformat this raw un-structured text into a beautiful clean semantic Markdown doc optimize for AI embedding vectors, RAG storage, and LLM reasoning. Remove repeated footers, headers, blank lines, index page lists, and noise. Keep all critical data. Return only beautiful markdown.

${contentText}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: textPrompt,
    });

    res.json({ preparedText: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  if (!ai) {
    return res.status(400).json({ error: "Gemini API key is not configured in Secrets panel yet." });
  }

  const { contentText, prompt, mode } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing user prompt" });
  }

  try {
    let response;
    
    if (mode === "thinking") {
      // High thinking mode using gemini-3.1-pro-preview
      const systemInstruction = "You are a professional, expert AI PDF Document Analyst and high-reasoning tutor. Analyze the document context and solve the user's inquiry with extensive, logical, step-by-step reasoning and deep breakdown. Be precise, highly analytical, and write directly corresponding mathematical, historical, or legal proofs where relevant.";
      const fullContents = `Document Context:\n---\n${contentText || "No document loaded yet."}\n---\nUser Complex Inquiry:\n${prompt}`;
      
      response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: fullContents,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          // Do not set maxOutputTokens
        }
      });
    } else if (mode === "fast") {
      // Speed mode using gemini-3.1-flash-lite
      const systemInstruction = "You are a lightning fast, helpful PDF assistant. Keep answers brief, clear, and focused. Execute search, extraction, or basic questions in 1-2 sentences max.";
      const csvKeywordsPrompt = `Document Context:\n${contentText || ""}\nQuestion: ${prompt}`;
      
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: csvKeywordsPrompt,
        config: {
          systemInstruction,
        }
      });
    } else {
      // General mode using gemini-3.5-flash
      const systemInstruction = "You are an intelligent PDF Copilot. Help the user summarize, proofread, query, or edit their document. Provide complete, polite, and well-designed responses and checklists.";
      const generalPrompt = `Document Context:\n${contentText || ""}\nInquiry: ${prompt}`;
      
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: generalPrompt,
        config: {
          systemInstruction,
        }
      });
    }

    res.json({ responseText: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/ai/tool-assist", async (req, res) => {
  if (!ai) {
    return res.status(400).json({ error: "Gemini API key is not configured in Secrets panel yet." });
  }

  const { toolName, fileName, customPrompt } = req.body;
  try {
    const systemInstruction = "You are an expert AI PDF Engineer. Generate a beautiful, structured analysis report summarizing the optimization page we are appending. Focus on the file's context, structure, potential vector inconsistencies, and action audit logs. Be concise and keep it professional.";
    const userPrompt = `Tool Name: ${toolName}\nFile Name: ${fileName}\nInstructions:\nCreate a beautiful, compact document report page content for the appended summary. The user is checking options: ${customPrompt || "AI Optimization Summary overview"}.\nInclude:\n1. A brief 2-3 sentence overview of this document under the current action "${toolName}".\n2. Exactly 3 brief bullet items detailing structural, layout, or security recommendations.\n3. A statement: "🔒 Verified: Undergone structural scan. Integrity Sealed."`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
      }
    });

    res.json({ resultText: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve storage folder directly in both environments
app.use("/storage", express.static(STORAGE_DIR));

// Helper to escape values for safe embedding in HTML attributes
function encodeHTML(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Dynamically generate proper SEO markup, Social schemas & Dynamic code blocks based on URL context
function getHtmlWithSEO(req: express.Request, htmlSource: string): string {
  let toolId = req.query.tool as string;
  let blogId = req.query.blog as string;
  let pageSlug = req.query.page as string;
  const categoryId = req.query.category as string;

  // Try extracting from pathname for clean URLs
  const reqPath = req.path;
  if (!blogId && reqPath.startsWith("/blog/")) {
    blogId = reqPath.substring(6);
  }
  if (!pageSlug && reqPath.startsWith("/page/")) {
    pageSlug = reqPath.substring(6);
  }
  if (!toolId && reqPath !== "/" && reqPath !== "" && reqPath !== "/admin" && reqPath !== "/install" && reqPath !== "/blog" && !reqPath.startsWith("/blog/") && !reqPath.startsWith("/page/")) {
    const possibleToolId = reqPath.substring(1);
    if (toolStates.some((t) => t.id === possibleToolId)) {
      toolId = possibleToolId;
    }
  }

  // Initialize defaults from live site states
  let title = siteStates.title || siteStates.siteName || "PDFProTools";
  let description = siteStates.description || "Free Online Web PDF Processing Suite";
  let keywords = siteStates.keywords || "pdf merger, compress pdf online, convert pdf, fill forms, lock pages";
  const baseUrl = siteStates.siteUrl || "https://pdfprotools.com";
  
  // Format current canonical address
  let urlParamsString = "";
  if (Object.keys(req.query).length > 0) {
    const sParams = new URLSearchParams();
    Object.entries(req.query).forEach(([k, v]) => {
      if (v) sParams.append(k, String(v));
    });
    const sStr = sParams.toString();
    if (sStr) urlParamsString = "?" + sStr;
  }
  const canonicalUrl = `${baseUrl}${req.path}${urlParamsString}`;
  let ogImage = "https://cdn-icons-png.flaticon.com/512/337/337946.png"; 

  // Specific query routers to load custom SEO tags
  if (req.path === "/admin") {
    title = `Admin Management Console | ${siteStates.siteName || "PDFProTools"}`;
    description = "Secure administrator panel for system settings, custom page publication, SEO tags, and blog content.";
  } else if (req.path === "/install") {
    title = `cPanel Script Setup Wizard | ${siteStates.siteName || "PDFProTools"}`;
    description = "Launch the automated CMS database script installer and environment variable setup for custom web hosting.";
  } else if (toolId) {
    const tool = toolStates.find((t) => t.id === toolId);
    if (tool) {
      title = `${tool.name} | Free Online Tool | ${siteStates.siteName || "PDFProTools"}`;
      description = `Use ${tool.name} for free: ${tool.description} Fast, secure in-browser execution with zero limits.`;
      keywords = `${tool.name.toLowerCase()}, online pdf utils, edit pdf, pdf tools, ${keywords}`;
    }
  } else if (blogId) {
    const blog = blogStates.find((b) => b.id === blogId);
    if (blog) {
      title = blog.seo_title || `${blog.title} | ${siteStates.siteName || "PDFProTools"} Learning Center`;
      description = blog.seo_description || blog.summary || blog.content.replace(/[#*`\n]+/g, " ").substring(0, 160).trim();
      keywords = blog.seo_keywords || "pdf guide, learning pdf, document optimization";
      if (blog.featured_image) ogImage = blog.featured_image;
    }
  } else if (pageSlug) {
    const p = pageStates.find((p) => p.slug === pageSlug);
    if (p) {
      title = `${p.seoTitle || p.title} | ${siteStates.siteName || "PDFProTools"}`;
      description = p.seoDescription || p.content.replace(/[#*`\n]+/g, " ").substring(0, 160).trim();
      keywords = p.seoKeywords || keywords;
    }
  } else if (categoryId) {
    const cat = categoryStates.find((c) => c.id === categoryId);
    if (cat) {
      title = `${cat.label} Suite of Utilities | ${siteStates.siteName || "PDFProTools"}`;
      description = cat.description || `Browse and execute free online tools grouped under ${cat.label} matrix. All runs are sandboxed and secure.`;
    }
  }

  // Structured WebApplication Schema JSON-LD and Search engine meta markup
  const seoHeaderTags = `
  <meta name="description" content="${encodeHTML(description)}" />
  <meta name="keywords" content="${encodeHTML(keywords)}" />
  <link rel="canonical" href="${encodeHTML(canonicalUrl)}" />

  <!-- Open Graph / Meta tags for Social Previews (FB, LinkedIn, Slack) -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${encodeHTML(title)}" />
  <meta property="og:description" content="${encodeHTML(description)}" />
  <meta property="og:url" content="${encodeHTML(canonicalUrl)}" />
  <meta property="og:image" content="${encodeHTML(ogImage)}" />

  <!-- Twitter Custom tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${encodeHTML(title)}" />
  <meta name="twitter:description" content="${encodeHTML(description)}" />
  <meta name="twitter:image" content="${encodeHTML(ogImage)}" />

  <!-- Schema.org software data for elite SEO snippets mapping -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "${encodeHTML(title)}",
    "url": "${encodeHTML(canonicalUrl)}",
    "description": "${encodeHTML(description)}",
    "applicationCategory": "BusinessApplication",
    "browserRequirements": "Requires stable HTML5 compatible browser with cookies and scripts active",
    "operatingSystem": "All, cross-platform PDF suite",
    "screenshot": "${encodeHTML(ogImage)}",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  }
  </script>
  `;

  // Custom administrative dynamic code injection properties
  const customHeader = siteStates.customCodeHeader || "";
  const customBody = siteStates.customCodeBody || "";
  const customFooter = siteStates.customCodeFooter || "";

  let result = htmlSource;

  // 1. Swap static index template title block with our loaded dynamic page SEO tags and Custom Admin Header
  if (result.match(/<title>.*?<\/title>/gi)) {
    result = result.replace(/<title>.*?<\/title>/gi, `<title>${encodeHTML(title)}</title>\n${seoHeaderTags}\n${customHeader}`);
  } else {
    // Fallback if head does not have title tag
    result = result.replace(/<\/head>/gi, `${seoHeaderTags}\n${customHeader}\n</head>`);
  }

  // 2. Inject body parameters right after <body> tag
  if (customBody) {
    result = result.replace(/<body([^>]*)>/gi, (match) => `${match}\n${customBody}`);
  }

  // 3. Inject footer integrations right above trailing body closure
  if (customFooter) {
    result = result.replace(/<\/body>/gi, `${customFooter}\n</body>`);
  }

  return result;
}

// Setup Express + Vite connection
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Mode configuration
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);

    // Custom Dev Middleware to intercept client HTML pages to inject headers and support SEO verification testing
    app.get("*", async (req, res, next) => {
      // Allow static assets, storage directories, and APIs to bypass
      if (req.path.startsWith("/api") || req.path.startsWith("api") || req.path.startsWith("/storage") || req.path.includes(".")) {
        return next();
      }
      try {
        const rawHtml = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");
        // Let Vite process template module dependencies (HMR, main scripts injection)
        const viteHtml = await vite.transformIndexHtml(req.originalUrl || req.url, rawHtml);
        const seoHtml = getHtmlWithSEO(req, viteHtml);
        res.status(200).set({ "Content-Type": "text/html" }).send(seoHtml);
      } catch (err) {
        next(err);
      }
    });
  } else {
    // Production Mode serving
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static directories BUT exclude default index.html serving to permit dynamic SEO injection on root routes
    app.use(express.static(distPath, { index: false }));
    
    app.get("*", (req, res) => {
      const indexFile = path.join(distPath, "index.html");
      fs.readFile(indexFile, "utf8", (err, data) => {
        if (err) {
          return res.status(500).send("Index template missing on production build.");
        }
        const seoHtml = getHtmlWithSEO(req, data);
        res.status(200).set({ "Content-Type": "text/html" }).send(seoHtml);
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully at port ${PORT}`);
  });
}

startServer();

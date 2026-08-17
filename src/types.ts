export type ToolCategory = string;

export interface CategoryItem {
  id: string;
  label: string;
  icon: string;
  active: boolean;
  description?: string;
}

export interface PdfTool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  isActive: boolean;
  requiresFile: boolean;
  acceptMimes?: string; // e.g. "application/pdf" or ".jpg,.png" or ".xlsx"
  code?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  created_at: string;
}

export interface AdSpot {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  timezone: string;
  logo: string;
  favicon: string;
  title: string;
  description: string;
  keywords: string;
  analyticsId: string;
  customCodeHeader: string;
  customCodeBody: string;
  customCodeFooter: string;
  footerAboutText?: string;
  footerPrivacyText?: string;
  footerCopyrightText?: string;
  homeBadge?: string;
  homeHeading?: string;
  homeSubheading?: string;
  adminUsername?: string;
  adminEmail?: string;
  adminPassword?: string;
}

export interface UsageMetric {
  id: string;
  toolId: string;
  toolName: string;
  count: number;
  date: string;
}

export interface ProcessedFile {
  name: string;
  size: number;
  url: string;
  downloadName: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  label: string;
  type: 'home' | 'blog' | 'page' | 'external';
  value: string;
  order: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}



import React from 'react';
import * as Icons from 'lucide-react';
import { PdfTool } from '../types';

interface ToolCardProps {
  tool: PdfTool;
  onSelect: (tool: PdfTool) => void;
  key?: any;
}

export default function ToolCard({ tool, onSelect }: ToolCardProps) {
  // Dynamically resolve lucide icons
  const IconComponent = (Icons as any)[tool.icon] || Icons.File;

  // Retrieve theme classes for Clean Minimalism
  const getThemeClasses = (toolId: string) => {
    switch (toolId) {
      case 'merge-pdf':
        return {
          hoverBorder: 'hover:border-red-400',
          iconBg: 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white',
          textHover: 'group-hover:text-red-500',
          arrowColor: 'text-red-600'
        };
      case 'split-pdf':
        return {
          hoverBorder: 'hover:border-blue-400',
          iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
          textHover: 'group-hover:text-blue-500',
          arrowColor: 'text-blue-600'
        };
      case 'compress-pdf':
        return {
          hoverBorder: 'hover:border-orange-400',
          iconBg: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white',
          textHover: 'group-hover:text-orange-500',
          arrowColor: 'text-orange-600'
        };
      case 'pdf-to-word':
      case 'pdf-to-llam':
        return {
          hoverBorder: 'hover:border-green-400',
          iconBg: 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white',
          textHover: 'group-hover:text-green-500',
          arrowColor: 'text-green-600'
        };
      case 'pdf-to-jpg':
        return {
          hoverBorder: 'hover:border-purple-400',
          iconBg: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
          textHover: 'group-hover:text-purple-500',
          arrowColor: 'text-purple-600'
        };
      case 'unlock-pdf':
      case 'protect-pdf':
        return {
          hoverBorder: 'hover:border-indigo-400',
          iconBg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
          textHover: 'group-hover:text-indigo-500',
          arrowColor: 'text-indigo-600'
        };
      case 'add-watermark':
      case 'redact-pdf':
        return {
          hoverBorder: 'hover:border-cyan-400',
          iconBg: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
          textHover: 'group-hover:text-cyan-500',
          arrowColor: 'text-cyan-600'
        };
      case 'rotate-pdf':
      case 'organize-pdf':
        return {
          hoverBorder: 'hover:border-yellow-400',
          iconBg: 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white',
          textHover: 'group-hover:text-yellow-500',
          arrowColor: 'text-yellow-600'
        };
      default:
        return {
          hoverBorder: 'hover:border-red-400',
          iconBg: 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white',
          textHover: 'group-hover:text-red-500',
          arrowColor: 'text-red-600'
        };
    }
  };

  const theme = getThemeClasses(tool.id);

  return (
    <div
      onClick={() => onSelect(tool)}
      id={`tool-${tool.id}`}
      className={`group relative flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-xl hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden ${theme.hoverBorder}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg transition-all duration-300 ${theme.iconBg}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#94a3b8] bg-[#f8fafc] px-2.5 py-1 rounded border border-slate-200">
            {tool.category.replace('-', ' ')}
          </span>
        </div>

        <h3 className={`font-sans font-bold text-[16px] text-slate-900 transition-colors mb-1.5 ${theme.textHover}`}>
          {tool.name}
        </h3>
        
        <p className="font-sans text-xs text-slate-400 leading-relaxed line-clamp-3">
          {tool.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
        <span className={`transition-colors ${theme.textHover}`}>Access Tool</span>
        <Icons.ArrowRight className={`h-4 w-4 transform group-hover:translate-x-1 transition-transform ${theme.arrowColor}`} />
      </div>
    </div>
  );
}

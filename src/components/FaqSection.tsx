import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FaqItem } from '../types';

interface FaqSectionProps {
  faqs: FaqItem[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-slate-50/50 border-t border-slate-100 py-16 px-6 sm:px-8 mt-4" id="faq-section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>F.A.Q. Helpdesk</span>
          </div>
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-3 max-w-xl mx-auto">
            Find answers to common questions about document privacy, security, processed files, and browser capabilities.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs transition-all duration-200"
                id={`faq-item-${faq.id}`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-5 py-4.5 sm:px-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="font-sans font-semibold text-sm sm:text-base text-slate-800 pr-4">
                    {faq.question}
                  </span>
                  <span className="text-slate-400 bg-slate-100 p-1.5 rounded-lg">
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-600 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-600 transition-transform duration-200" />
                    )}
                  </span>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[500px] border-t border-slate-50 bg-slate-50/20' : 'max-h-0'
                  }`}
                >
                  <p className="px-5 py-4.5 sm:px-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans font-normal">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

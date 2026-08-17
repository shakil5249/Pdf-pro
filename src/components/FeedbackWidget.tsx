import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, CheckCircle2, AlertCircle, Megaphone, HelpCircle } from 'lucide-react';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'issue' | 'feature' | 'other'>('issue');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide a message for your feedback.');
      return;
    }
    
    setSubmitting(true);
    setError(null);

    try {
      // Smooth visual simulation
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newFeedback = {
        id: Date.now().toString(),
        type: feedbackType,
        email: email.trim() || 'anonymous',
        message: message.trim(),
        createdAt: new Date().toISOString()
      };

      const existing = localStorage.getItem('site_feedbacks');
      const feedbacks = existing ? JSON.parse(existing) : [];
      feedbacks.push(newFeedback);
      localStorage.setItem('site_feedbacks', JSON.stringify(feedbacks));

      setSubmitted(true);
      setMessage('');
      setEmail('');
    } catch (err) {
      setError('Failed to send feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setError(null);
    }, 300);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="floating-feedback-fab"
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-sans font-bold text-xs sm:text-sm px-4.5 py-3 rounded-full shadow-lg shadow-red-500/20 active:scale-95 transition-shadow cursor-pointer border-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layoutId="feedback-fab-button"
        >
          <MessageSquare className="h-4.5 w-4.5 animate-pulse" />
          <span>Feedback</span>
        </motion.button>
      </div>

      {/* Modal Backdrop and Box */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              id="feedback-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              id="feedback-modal-content"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 text-left overflow-hidden z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-extrabold text-slate-900 text-sm sm:text-base leading-tight">Send Feedback</h3>
                    <p className="text-[11px] font-medium text-slate-500">Tell us how we can optimize your workflow</p>
                  </div>
                </div>
                <button
                  id="close-feedback-modal-btn"
                  onClick={handleClose}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submitted ? (
                /* Success Screen */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-6 flex flex-col items-center text-center space-y-4"
                >
                  <div className="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 scale-110 animate-bounce">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-1.5 px-2">
                    <h4 className="font-sans font-extrabold text-slate-900 text-lg">Thank You So Much!</h4>
                    <p className="text-xs sm:text-sm font-normal text-slate-600 leading-relaxed">
                      Your feedback has been logged successfully and routed to our compilation and tool optimizing queue.
                    </p>
                  </div>
                  <button
                    id="feedback-success-dismiss"
                    onClick={handleClose}
                    className="mt-2 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl cursor-pointer transition-colors border-none"
                  >
                    Close Dialog
                  </button>
                </motion.div>
              ) : (
                /* Form Screen */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center space-x-2 bg-rose-50/80 border border-rose-100 p-3 rounded-xl text-xs text-rose-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span className="font-semibold">{error}</span>
                    </div>
                  )}

                  {/* Feedback Type Tabs */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-700 font-sans block">Feedback Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFeedbackType('issue')}
                        className={`py-2 px-1 rounded-xl border text-[11px] font-semibold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                          feedbackType === 'issue'
                            ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                        <span>Report Issue</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFeedbackType('feature')}
                        className={`py-2 px-1 rounded-xl border text-[11px] font-semibold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                          feedbackType === 'feature'
                            ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Megaphone className="h-4 w-4 text-emerald-500" />
                        <span>Suggest Tool</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFeedbackType('other')}
                        className={`py-2 px-1 rounded-xl border text-[11px] font-semibold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                          feedbackType === 'other'
                            ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <HelpCircle className="h-4 w-4 text-blue-500" />
                        <span>General Feedback</span>
                      </button>
                    </div>
                  </div>

                  {/* Message input */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="feedback-message-textarea" className="text-xs font-bold text-slate-700 font-sans block">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="feedback-message-textarea"
                      placeholder={
                        feedbackType === 'issue'
                          ? "What went wrong? Please describe the issue or file you played with."
                          : feedbackType === 'feature'
                            ? "Describe the tool or feature you would like to see added to our PDF service stack."
                            : "Write your questions, ideas, or comments here..."
                      }
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none resize-none font-sans"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="feedback-email-input" className="text-xs font-bold text-slate-700 font-sans block">
                      Email address <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="feedback-email-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none font-sans"
                    />
                  </div>

                  {/* Submission Row */}
                  <div className="pt-1">
                    <button
                      id="submit-feedback-btn"
                      type="submit"
                      disabled={submitting}
                      className="w-full h-11 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-sans font-bold text-sm rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm active:scale-99 border-none"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Feedback</span>
                        </>
                      )}
                    </button>
                    <div className="text-center mt-3">
                      <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">🔒 Secured Local Sync Engine</span>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

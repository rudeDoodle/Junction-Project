import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface NewsProps {
  news: any[];
}

export default function News({ news }: NewsProps) {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'local' | 'youth'>('all');
  const [showExplain, setShowExplain] = useState(false);

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      taxes: 'bg-blue-100 text-blue-700',
      rent: 'bg-purple-100 text-purple-700',
      jobs: 'bg-green-100 text-green-700',
      loans: 'bg-orange-100 text-orange-700',
      housing: 'bg-pink-100 text-pink-700',
      subscriptions: 'bg-cyan-100 text-cyan-700',
      money: 'bg-amber-100 text-amber-700',
      education: 'bg-indigo-100 text-indigo-700'
    };
    return colors[tag] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-white to-slate-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white mb-2">News</h1>
            <p className="text-white/80">Finance news that matters to you</p>
          </div>
          <TrendingUp className="w-8 h-8 text-white/60" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'all'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('local')}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'local'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Local
          </button>
          <button
            onClick={() => setFilter('youth')}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'youth'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            For Youth
          </button>
        </div>
      </div>

      {/* News Feed */}
      <div className="px-6 mt-6 space-y-4">
        {news.map((article) => (
          <motion.button
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-blue-300 transition-colors text-left"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-slate-900 flex-1">{article.title}</h3>
              <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
            </div>

            <p className="text-slate-600 mb-3">{article.summary}</p>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 text-slate-500 text-sm">
                <Calendar className="w-4 h-4" />
                {getRelativeDate(article.date)}
              </div>
              {article.tags.map((tag: string) => (
                <span
                  key={tag}
                  className={`px-2 py-1 rounded-full text-xs ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
            onClick={() => {
              setSelectedArticle(null);
              setShowExplain(false);
            }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-slate-900 flex-1 pr-4">{selectedArticle.title}</h3>
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    setShowExplain(false);
                  }}
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Tags and Date */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedArticle.date).toLocaleDateString()}
                  </div>
                  {selectedArticle.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded-full text-xs ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* AI Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🤖</span>
                    <h4 className="text-blue-900">AI TL;DR</h4>
                  </div>
                  <p className="text-blue-800">{selectedArticle.detail}</p>
                </div>

                {/* What This Means for You */}
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 border-2 border-teal-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">💡</span>
                    <h4 className="text-teal-900">What this means for you</h4>
                  </div>
                  <p className="text-teal-800">{selectedArticle.youthImpact}</p>
                </div>

                {/* Explain Like I'm 16 Toggle */}
                <Button
                  onClick={() => setShowExplain(!showExplain)}
                  variant="outline"
                  className="w-full border-2 border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl"
                >
                  {showExplain ? 'Hide' : 'Show'} "Explain like I'm 16" version
                </Button>

                <AnimatePresence>
                  {showExplain && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🎓</span>
                        <h4 className="text-purple-900">Simple breakdown</h4>
                      </div>
                      <p className="text-purple-800">
                        Think of it this way: {selectedArticle.youthImpact.toLowerCase()} 
                        It's like when you're managing your weekly budget — small changes can add up to big differences over time. 
                        Keep an eye on this because it could affect your wallet!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

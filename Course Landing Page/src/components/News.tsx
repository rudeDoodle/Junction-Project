import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface NewsProps {
  news?: any[];
  userData?: any;
}

export default function News({ news: initialNews, userData }: NewsProps) {
  const [allNews, setAllNews] = useState<any[]>(initialNews || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'local' | 'youth'>('all');
  const [showExplain, setShowExplain] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [youthImpact, setYouthImpact] = useState<string>('');
  const [impactLoading, setImpactLoading] = useState(false);
  const [simpleExplanation, setSimpleExplanation] = useState<string>('');
  const [explainLoading, setExplainLoading] = useState(false);

  const genAI = new GoogleGenerativeAI((import.meta as any).env.VITE_GEMINI_API_KEY);

  // Function to get relevant articles using Gemini AI
  const getRelevantArticles = async (articles: any[], userData: any): Promise<any[]> => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const userContext = userData ? `
User Profile:
- Country: ${userData.country || 'Not provided'}
- Role: ${userData.role || 'Not provided'}
- Financial Experience: ${userData.experience || 'Not provided'}
- Age Group: ${userData.age || 'young adult'}
` : 'Young adult learning about finance';

      const articlesText = articles.slice(0, 20).map((article, index) => 
        `${index + 1}. Title: "${article.title}" | Summary: ${article.description || article.content?.substring(0, 100) || 'No summary available'}`
      ).join('\n');

      const prompt = `You are a financial news curator for a young person. Select the 4 most relevant articles for daily personal finance from the list below.

${userContext}

CRITERIA for relevance:
- Personal finance topics (budgeting, saving, investing, banking, taxes)
- Youth-focused financial issues (student loans, first jobs, starting to invest)
- Practical money management tips
- Consumer protection and financial scams
- Local economic news that affects daily life
- Avoid highly technical market analysis or corporate finance

IF THE ARTICLE IS IN A DIFFERENT LANGUAGE THAN ENGLISH, TRANSLATE IT.

ARTICLES:
${articlesText}

INSTRUCTIONS:
Return ONLY the numbers (1-20) of the 4 most relevant articles as a JSON array, in order of relevance.
Example: [3, 7, 1, 12]

Output:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      // Parse the JSON array from the response
      const relevantIndices = JSON.parse(text);
      
      // Get the actual articles based on the indices
      const relevantArticles = relevantIndices
        .map((index: number) => articles[index - 1]) // Convert 1-based to 0-based
        .filter((article: any) => article); // Remove any undefined articles

      return relevantArticles.length > 0 ? relevantArticles : articles.slice(0, 4);
    } catch (err) {
      console.error('Error selecting relevant articles:', err);
      // Fallback to first 4 articles if AI fails
      return articles.slice(0, 4);
    }
  };

  const generateAiSummary = async (article: any) => {
    setSummaryLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `Please provide a concise, easy-to-understand summary of the following news article for a young person learning about finance. Keep it exceptionally short, at most 40 words

Title: ${article.title}
Content: ${article.detail || article.summary}

Summary:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setAiSummary(text);
    } catch (err) {
      console.error('Error generating AI summary:', err);
      setAiSummary('Unable to generate summary at this time.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const generateYouthImpact = async (article: any) => {
    setImpactLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const userContext = userData ? `
User Profile:
- Name: ${userData.name || 'Not provided'}
- Country: ${userData.country || 'Not provided'}
- Role: ${userData.role || 'Not provided'}
- Gender: ${userData.gender || 'Not provided'}
- Financial Experience: ${userData.experience || 'Not provided'}
` : '';

      const prompt = `Based on the following news article and user profile, explain what this news means for the user's financial future and life. Keep it exceptionally short, at most 40 words

Article Title: ${article.title}
Article Summary: ${article.summary}
${userContext}

What this means for them:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setYouthImpact(text);
    } catch (err) {
      console.error('Error generating youth impact:', err);
      setYouthImpact('This news could affect your financial outlook. Stay informed!');
    } finally {
      setImpactLoading(false);
    }
  };

  const generateSimpleExplanation = async (article: any) => {
    setExplainLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `Explain the following financial news article in a way that a 16-year-old could easily understand. Use simple language, relatable examples, and avoid technical jargon. Keep it exceptionally short, at most 40 words.

Article Title: ${article.title}
Article Content: ${article.detail || article.summary}

Simple explanation for a 16-year-old:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setSimpleExplanation(text);
    } catch (err) {
      console.error('Error generating simple explanation:', err);
      setSimpleExplanation('This news is about something that could affect your money in the future. Ask a trusted adult if you want to learn more!');
    } finally {
      setExplainLoading(false);
    }
  };

  const countryDict: Record<string, string> = {
    Finland: "yle.fi",
    Sweden: "aftonbladet.se",
    Denmark: "politiken.dk",
    Norway: "aftenposten.no",
    Estonia: "ohtuleht.ee",
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        let url = 'https://newsapi.org/v2/everything?q=finance OR business OR economy&language=en&sortBy=popularity&apiKey=6a64401f803749cd83aeee11238e64f0';
        
        if (filter === 'local' && userData?.country) {
          url = `https://newsapi.org/v2/everything?q=finance OR business OR economy&domains=${countryDict[userData.country]}&apiKey=6a64401f803749cd83aeee11238e64f0`;
          console.log(userData.country);
        }

        console.log('Fetching news from URL:', url);
        const response = await fetch(url);
        const data = await response.json();
        console.log('News API Response:', data);
        
        if (data.articles) {
          // Get relevant articles using Gemini AI
          const relevantArticles = await getRelevantArticles(data.articles, userData);
          
          // Transform API data to match component expectations
          const transformedArticles = relevantArticles.map((article: any, index: number) => ({
            id: index,
            title: article.title,
            summary: article.description || article.content?.substring(0, 150) || '',
            date: article.publishedAt,
            tags: ['finance', 'business'],
            detail: article.content || article.description || '',
            youthImpact: `This news about ${article.source.name} could affect financial markets and your future opportunities.`,
            url: article.url,
            source: article.source.name || '',
          }));
          setAllNews(transformedArticles);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [filter, userData]);

  const getFilteredNews = (): any[] => {
    return allNews;
  };

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
            onClick={() => {
              console.log('Filter selected: all');
              setFilter('all');
            }}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'all'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              console.log('Filter selected: local - Country:', userData?.country);
              setFilter('local');
            }}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'local'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Local
          </button>
        </div>
      </div>

      {/* News Feed */}
      <div className="px-6 mt-6 space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading news...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : getFilteredNews().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No news available for {filter === 'local' ? 'your country' : 'this filter'}</p>
          </div>
        ) : (
          getFilteredNews().map((article) => (
          <motion.button
            key={article.id}
            onClick={() => {
              setSelectedArticle(article);
              generateAiSummary(article);
              generateYouthImpact(article);
              generateSimpleExplanation(article);
            }}
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
          ))
        )}
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
                  <p className="text-blue-800">
                    {summaryLoading ? 'Generating summary...' : aiSummary || 'Loading summary...'}
                  </p>
                </div>

                {/* What This Means for You */}
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 border-2 border-teal-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">💡</span>
                    <h4 className="text-teal-900">What this means for you</h4>
                  </div>
                  <p className="text-teal-800">
                    {impactLoading ? 'Personalizing for you...' : youthImpact || 'Loading impact analysis...'}
                  </p>
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
                        {explainLoading ? 'Simplifying the explanation...' : simpleExplanation || 'Loading simple explanation...'}
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
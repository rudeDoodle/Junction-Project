import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus, ArrowRightLeft, X, BarChart3, AlertCircle, CreditCard, Trash2, DollarSign, Layers } from 'lucide-react';
import { Button } from './ui/button';

interface Card {
  id: string;
  name: string;
  balance: number;
}

interface FinanceProps {
  finances: any[];
  transactions: any[];
  userData: any;
  onCrazyPayment: (amount: number, category: string) => void;
  crazyPaymentCount: number;
  cards: Card[];
  selectedCardId: string | 'all';
  onSelectCard: (cardId: string | 'all') => void;
  onAddCard: (cardType: string) => void;
  onRemoveCard: (cardId: string) => void;
  onAddCashPayment: (payment: { amount: number; category: string; merchant: string; date: string }) => void;
}

// Waste ratio logic - EXACT implementation
function calculateVisualScore(actualSpend: number, neededSpend: number): { score: number; color: string; colorClass: string } {
  const wasteRatio = (actualSpend - neededSpend) / neededSpend;
  
  console.log('[Finance] Waste calculation:', { actualSpend, neededSpend, wasteRatio });

  if (wasteRatio >= 0.50) {
    // 50% or more over need → 5 bars, red
    return { score: 5, color: 'red', colorClass: 'bg-red-500' };
  } else if (wasteRatio >= 0.15 && wasteRatio < 0.50) {
    // 15-49% over need → 4 bars, amber
    return { score: 4, color: 'amber', colorClass: 'bg-amber-500' };
  } else if (wasteRatio >= 0 && wasteRatio < 0.15) {
    // Up to 15% over → 3 bars, yellow/neutral
    return { score: 3, color: 'yellow', colorClass: 'bg-yellow-500' };
  } else if (wasteRatio < 0 && wasteRatio >= -0.30) {
    // 10-29% under → 2 bars, green
    return { score: 2, color: 'green', colorClass: 'bg-green-500' };
  } else {
    // 30%+ under → 1 bar, green
    return { score: 1, color: 'green', colorClass: 'bg-green-600' };
  }
}

export default function Finance({ finances, transactions, userData, onCrazyPayment, crazyPaymentCount, cards, selectedCardId, onSelectCard, onAddCard, onRemoveCard, onAddCashPayment }: FinanceProps) {
  const [showConnect, setShowConnect] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [showAddCash, setShowAddCash] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [cashPayment, setCashPayment] = useState({ amount: '', category: 'Groceries', merchant: '' });
  const [categoryTrends, setCategoryTrends] = useState<Record<string, number[]>>({});

  // Initialize category trends with fake historical data
  useEffect(() => {
    if (Object.keys(categoryTrends).length === 0) {
      const initialTrends: Record<string, number[]> = {};
      finances.forEach(item => {
        // Generate 4 months of fake historical data, 5th month is current
        const current = item.monthly;
        const variations = [0.85, 0.92, 0.88, 0.95]; // Multipliers for past months
        initialTrends[item.category] = [
          ...variations.map(v => current * v),
          current
        ];
      });
      setCategoryTrends(initialTrends);
    }
  }, [finances]);

  const totalSpending = finances.reduce((sum, item) => sum + item.monthly, 0);
  const hasCard = cards.length > 0;

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Groceries: '🛒',
      Subscriptions: '📱',
      Transport: '🚌',
      Rent: '🏠',
      Other: '💳'
    };
    return icons[category] || '💰';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Groceries: 'from-green-400 to-emerald-500',
      Subscriptions: 'from-purple-400 to-pink-500',
      Transport: 'from-blue-400 to-cyan-500',
      Rent: 'from-orange-400 to-red-500',
      Other: 'from-slate-400 to-slate-500'
    };
    return colors[category] || 'from-slate-400 to-slate-500';
  };

  // Baseline "needed" amounts per category
  const baselineData: Record<string, Record<string, number>> = {
    student: { Groceries: 200, Subscriptions: 30, Transport: 50, Rent: 400, Other: 100 },
    teen: { Groceries: 150, Subscriptions: 40, Transport: 30, Rent: 0, Other: 80 },
    adult: { Groceries: 300, Subscriptions: 60, Transport: 100, Rent: 800, Other: 200 }
  };

  const handleAddTransaction = (amount: number, category: string) => {
    const categoryData = finances.find(f => f.category === category);
    if (categoryData && amount > categoryData.monthly * 2) {
      onCrazyPayment(amount, category);
    }
  };

  const handleAddCashPayment = () => {
    const amount = parseFloat(cashPayment.amount);
    if (isNaN(amount) || amount <= 0 || !cashPayment.merchant.trim()) {
      return;
    }
    
    const payment = {
      amount,
      category: cashPayment.category,
      merchant: cashPayment.merchant,
      date: new Date().toISOString().split('T')[0]
    };
    
    // Update trend data - add to current month
    setCategoryTrends(prev => {
      const categoryTrend = prev[cashPayment.category] || [0, 0, 0, 0, 0];
      const newTrend = [...categoryTrend];
      newTrend[4] = newTrend[4] + amount; // Update current month (last position)
      return {
        ...prev,
        [cashPayment.category]: newTrend
      };
    });
    
    onAddCashPayment(payment);
    setCashPayment({ amount: '', category: 'Groceries', merchant: '' });
    setShowAddCash(false);
  };

  const handleCardSelect = (cardType: string) => {
    onAddCard(cardType);
    setShowConnect(false);
  };

  const getSelectedCardDisplay = () => {
    if (selectedCardId === 'all') {
      return { name: 'All Cards', balance: cards.reduce((sum, card) => sum + card.balance, 0) };
    }
    return cards.find(c => c.id === selectedCardId) || { name: '', balance: 0 };
  };

  // Calculate enriched data with visual scores
  const enrichedFinances = finances.map(item => {
    const neededSpend = baselineData[userData.role]?.[item.category] || item.monthly;
    const pctOfTotal = (item.monthly / totalSpending) * 100;
    const visual = calculateVisualScore(item.monthly, neededSpend);
    const trend = categoryTrends[item.category] || [item.monthly, item.monthly, item.monthly, item.monthly, item.monthly];
    
    return {
      ...item,
      pctOfTotal: pctOfTotal.toFixed(1),
      visualScore: visual.score,
      color: visual.color,
      colorClass: visual.colorClass,
      neededSpend,
      trend
    };
  });

  return (
    <div className="min-h-full bg-gradient-to-b from-white to-slate-50 pb-6">
      {/* If no card added yet, show add card screen */}
      {!hasCard ? (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl text-slate-900 text-center mb-3">Connect your card</h2>
            <p className="text-slate-600 text-center mb-8">
              Add your bank card to start tracking your finances automatically
            </p>
            
            <Button
              onClick={() => setShowConnect(true)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 text-lg rounded-xl shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Card
            </Button>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-white mb-2">Finance</h1>
                <p className="text-white/80">Your money, tracked</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConnect(true)}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowAddCash(true)}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Card Selector */}
            {cards.length > 0 && (
              <motion.button
                onClick={() => setShowCardSelector(true)}
                className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4 text-left hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      {selectedCardId === 'all' ? <Layers className="w-5 h-5 text-white" /> : <CreditCard className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Current view</p>
                      <p className="text-white font-medium">{getSelectedCardDisplay().name}</p>
                    </div>
                  </div>
                  <ArrowRightLeft className="w-4 h-4 text-white/70" />
                </div>
              </motion.button>
            )}

            {/* Total Overview */}
            <div className="bg-white rounded-xl p-5 shadow-md">
              <p className="text-slate-600 mb-2">
                {selectedCardId === 'all' ? 'Total balance' : 'Card balance'}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-slate-900">€{getSelectedCardDisplay().balance.toFixed(2)}</span>
              </div>
              <p className="text-slate-600 text-sm mb-4">Monthly spending: €{totalSpending.toFixed(2)}</p>
              {(() => {
                const baseline = Object.values(baselineData[userData.role] || {}).reduce((a: number, b: number) => a + b, 0);
                const diff = ((totalSpending - baseline) / baseline) * 100;
                const isLower = diff < 0;
                return (
                  <div className={`flex items-center gap-1 text-sm mb-4 ${isLower ? 'text-green-600' : 'text-red-600'}`}>
                    {isLower ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    <span>{Math.abs(diff).toFixed(0)}% vs average</span>
                  </div>
                );
              })()}
              <Button
                onClick={() => setShowCompare(true)}
                variant="outline"
                className="w-full border-2 border-teal-200 text-teal-700 hover:bg-teal-50 rounded-md"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Compare with average
              </Button>
            </div>
          </div>

          <div className="px-6 mt-6 space-y-6">
            {/* Crazy Payment Alert - Toast Style */}
            {crazyPaymentCount > 0 && (
              <motion.button
                onClick={() => setShowInsightModal(true)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-left">
                    <p className="text-sm">
                      Heads up — unusual payment detected. Review your spending to stay on track.
                    </p>
                    {crazyPaymentCount > 1 && (
                      <p className="text-xs mt-1 opacity-90">
                        {crazyPaymentCount} unusual payments this month
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            )}

            {/* Category Cards - WITH BAR RATING LOGIC */}
            <div>
              <h3 className="text-slate-900 mb-4">Spending by category</h3>
              <div className="space-y-3">
                {enrichedFinances.map((item) => {
                  const baseline = item.neededSpend;
                  const diff = ((item.monthly - baseline) / baseline) * 100;
                  const isLower = diff < 0;
                  
                  return (
                    <motion.button
                      key={item.category}
                      onClick={() => setSelectedCategory(item)}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:border-teal-300 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(item.category)} rounded-lg flex items-center justify-center text-2xl shadow-sm`}>
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-slate-900 mb-1">{item.category}</h4>
                          <p className="text-slate-600 text-sm">€{item.monthly.toFixed(2)}/month • {item.pctOfTotal}%</p>
                          
                          {/* Trend indicator - comparing to average */}
                          {diff !== 0 && (
                            <div className={`flex items-center gap-1 text-xs mt-1 ${
                              isLower ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isLower ? (
                                <>
                                  <TrendingDown className="w-3 h-3" />
                                  <span>{Math.abs(diff).toFixed(0)}% below average</span>
                                </>
                              ) : (
                                <>
                                  <TrendingUp className="w-3 h-3" />
                                  <span>{diff.toFixed(0)}% above average</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* BAR RATING - 1-5 bars based on waste ratio */}
                        <div className="flex items-end gap-1 h-8">
                          {[...Array(5)].map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 rounded-sm transition-all ${
                                index < item.visualScore
                                  ? item.colorClass
                                  : 'bg-slate-200'
                              }`}
                              style={{
                                height: index < item.visualScore 
                                  ? `${((index + 1) / 5) * 100}%` 
                                  : '20%'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Bar Legend */}
              <div className="mt-4 bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-slate-600 text-xs mb-2">Bar indicator:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-sm" />
                    <span className="text-slate-700">Under budget</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
                    <span className="text-slate-700">On track</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-sm" />
                    <span className="text-slate-700">A bit high</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-sm" />
                    <span className="text-slate-700">Too high</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <h3 className="text-slate-900 mb-4">Recent transactions</h3>
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 divide-y divide-slate-100">
                {transactions.map((transaction) => (
                  <button
                    key={transaction.id}
                    onClick={() => handleAddTransaction(transaction.amount, transaction.category)}
                    className="w-full p-4 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          {getCategoryIcon(transaction.category)}
                        </div>
                        <div>
                          <p className="text-slate-900">{transaction.merchant}</p>
                          <p className="text-slate-500 text-sm">{transaction.date}</p>
                        </div>
                      </div>
                      <p className="text-slate-900">€{transaction.amount.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Insight Modal - Crazy Payment */}
      <AnimatePresence>
        {showInsightModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowInsightModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">Unusual Spending Detected</h3>
                  <p className="text-gray-600 text-sm">
                    You've made {crazyPaymentCount === 1 ? 'a large payment' : `${crazyPaymentCount} large payments`} that's significantly higher than your usual spending pattern.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-amber-900 text-sm">
                  💡 Tip: Review your recent transactions and consider if these were planned expenses. If not, this might be a good time to revisit your budget.
                </p>
              </div>

              <Button
                onClick={() => setShowInsightModal(false)}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-md"
              >
                Got it
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Selector Modal */}
      <AnimatePresence>
        {showCardSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCardSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-900">Select card view</h3>
                <button
                  onClick={() => setShowCardSelector(false)}
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              <div className="space-y-3">
                {/* All Cards Option */}
                <button
                  onClick={() => {
                    onSelectCard('all');
                    setShowCardSelector(false);
                  }}
                  className={`w-full p-4 border-2 rounded-lg transition-colors text-left ${
                    selectedCardId === 'all' 
                      ? 'border-teal-400 bg-teal-50' 
                      : 'border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-slate-900 font-medium">All Cards</p>
                        <p className="text-slate-600 text-sm">Combined view</p>
                      </div>
                    </div>
                    <p className="text-slate-900 font-medium">
                      €{cards.reduce((sum, card) => sum + card.balance, 0).toFixed(2)}
                    </p>
                  </div>
                </button>

                {/* Individual Cards */}
                {cards.map((card) => (
                  <div key={card.id} className="w-full">
                    <button
                      onClick={() => {
                        onSelectCard(card.id);
                        setShowCardSelector(false);
                      }}
                      className={`w-full p-4 border-2 rounded-lg transition-colors text-left ${
                        selectedCardId === card.id 
                          ? 'border-teal-400 bg-teal-50' 
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-900 font-medium truncate">{card.name}</p>
                            <p className="text-slate-600 text-sm">Card #{card.id.slice(-4)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <p className="text-slate-900 font-medium">€{card.balance.toFixed(2)}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveCard(card.id);
                              if (cards.length === 1) {
                                setShowCardSelector(false);
                              }
                            }}
                            className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-md flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connect Bank Modal - Card Selection */}
      <AnimatePresence>
        {showConnect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowConnect(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-900">Select your bank</h3>
                <button
                  onClick={() => setShowConnect(false)}
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {['Nordea', 'OP', 'Danske Bank', 'S-Pankki'].map((bank) => (
                  <button
                    key={bank}
                    onClick={() => handleCardSelect(bank)}
                    className="w-full p-4 border-2 border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white">
                        🏦
                      </div>
                      <span className="text-slate-900">{bank}</span>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-slate-600 text-sm text-center">
                Demo connection only. Your data stays private and secure.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Cash Payment Modal */}
      <AnimatePresence>
        {showAddCash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddCash(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-slate-900">Add cash payment</h3>
                </div>
                <button
                  onClick={() => setShowAddCash(false)}
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-slate-700 text-sm mb-2 block">Amount (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={cashPayment.amount}
                    onChange={(e) => setCashPayment(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-slate-700 text-sm mb-2 block">Category</label>
                  <select
                    value={cashPayment.category}
                    onChange={(e) => setCashPayment(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-400 focus:outline-none transition-colors bg-white"
                  >
                    <option value="Groceries">🛒 Groceries</option>
                    <option value="Subscriptions">📱 Subscriptions</option>
                    <option value="Transport">🚌 Transport</option>
                    <option value="Rent">🏠 Rent</option>
                    <option value="Other">💳 Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 text-sm mb-2 block">Place name</label>
                  <input
                    type="text"
                    placeholder="e.g., Local market"
                    value={cashPayment.merchant}
                    onChange={(e) => setCashPayment(prev => ({ ...prev, merchant: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <Button
                onClick={handleAddCashPayment}
                disabled={!cashPayment.amount || !cashPayment.merchant.trim()}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Payment
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCompare(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-900">Spending comparison</h3>
                <button
                  onClick={() => setShowCompare(false)}
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-4 border-2 border-teal-200 mb-6">
                <p className="text-teal-800 text-sm">
                  Comparing your spending to the average Finnish {userData.role}
                </p>
              </div>

              <div className="space-y-4">
                {enrichedFinances.map((item) => {
                  const baseline = item.neededSpend;
                  const difference = ((item.monthly - baseline) / baseline) * 100;
                  const isHigher = difference > 0;

                  return (
                    <div key={item.category} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getCategoryIcon(item.category)}</span>
                          <span className="text-slate-900">{item.category}</span>
                        </div>
                        <span className={`text-sm ${isHigher ? 'text-orange-600' : 'text-green-600'}`}>
                          {isHigher ? '+' : ''}{difference.toFixed(0)}%
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">You</span>
                          <span className="text-slate-900">€{item.monthly.toFixed(2)}</span>
                        </div>
                        <div className="h-2 bg-white rounded-sm overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
                            style={{ width: `${(item.monthly / (item.monthly + baseline)) * 100}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Average</span>
                          <span className="text-slate-900">€{baseline.toFixed(2)}</span>
                        </div>
                        <div className="h-2 bg-white rounded-sm overflow-hidden">
                          <div
                            className="h-full bg-slate-400"
                            style={{ width: `${(baseline / (item.monthly + baseline)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <p className="text-purple-800 text-sm">
                  You spend {((totalSpending / Object.values(baselineData[userData.role] || {}).reduce((a, b) => a + b, 0)) * 100 - 100).toFixed(0)}% 
                  {' '}{totalSpending > Object.values(baselineData[userData.role] || {}).reduce((a, b) => a + b, 0) ? 'more' : 'less'} than an average Finnish {userData.role}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Detail Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(selectedCategory.category)} rounded-lg flex items-center justify-center text-2xl`}>
                    {getCategoryIcon(selectedCategory.category)}
                  </div>
                  <h3 className="text-slate-900">{selectedCategory.category}</h3>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <p className="text-slate-600 text-sm mb-1">Monthly spending</p>
                <p className="text-slate-900">€{selectedCategory.monthly.toFixed(2)}</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-600 text-sm">Spending level</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-6 rounded-sm ${
                          index < selectedCategory.visualScore
                            ? selectedCategory.colorClass
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 text-xs">
                  {selectedCategory.visualScore === 5 && "You're spending a lot more than needed"}
                  {selectedCategory.visualScore === 4 && "You're spending a bit more than typical"}
                  {selectedCategory.visualScore === 3 && "You're on track with spending"}
                  {selectedCategory.visualScore === 2 && "You're spending less than typical"}
                  {selectedCategory.visualScore === 1 && "You're spending well under budget"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-600 text-sm mb-3">5-month trend</p>
                <div className="flex items-end justify-between gap-2 h-32">
                  {selectedCategory.trend.map((value: number, index: number) => {
                    const maxValue = Math.max(...selectedCategory.trend);
                    const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                          <div 
                            className="w-full bg-teal-400 rounded-t transition-all duration-300" 
                            style={{ height: `${heightPercent}%` }} 
                          />
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-slate-500 block">M{index + 1}</span>
                          <p className="text-xs text-slate-700">€{value.toFixed(0)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!ticker.trim()) {
      setError('Please enter a stock ticker');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: ticker.toUpperCase() }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      setError('Failed to analyze stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            📈 Stock Analyzer Pro
          </h1>
          <p className="text-slate-300 mt-2">AI-Powered Stock Analysis & Insights</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Box */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Analyze Any Stock
          </h2>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Enter stock ticker (e.g., AAPL, TSLA, NVDA)"
              className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-xl border border-purple-500/30 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg"
              disabled={loading}
            />
            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Quick Stats Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-900/50 rounded-xl p-6 border border-purple-500/20">
              <p className="text-slate-400 text-sm mb-2">Analysis Type</p>
              <p className="text-white text-xl font-semibold">Comprehensive</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-6 border border-purple-500/20">
              <p className="text-slate-400 text-sm mb-2">Time Horizon</p>
              <p className="text-white text-xl font-semibold">Long-term</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-6 border border-purple-500/20">
              <p className="text-slate-400 text-sm mb-2">Risk Level</p>
              <p className="text-white text-xl font-semibold">Moderate</p>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-8 bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-purple-500/20">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Analysis Results for {ticker.toUpperCase()}
            </h2>
            <div className="prose prose-invert max-w-none">
              <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10 hover:border-purple-500/30 transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">Technical Analysis</h3>
            <p className="text-slate-400">Advanced charts, indicators, and pattern recognition</p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10 hover:border-purple-500/30 transition-all">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-white mb-2">Fundamental Analysis</h3>
            <p className="text-slate-400">Deep dive into financials, metrics, and company health</p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10 hover:border-purple-500/30 transition-all">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-white mb-2">Macro Analysis</h3>
            <p className="text-slate-400">Market trends, economic indicators, and global context</p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10 hover:border-purple-500/30 transition-all">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-white mb-2">Valuation Models</h3>
            <p className="text-slate-400">DCF, multiples, and scenario-based pricing</p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10 hover:border-purple-500/30 transition-all">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Risk Assessment</h3>
            <p className="text-slate-400">Comprehensive risk analysis and mitigation strategies</p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10 hover:border-purple-500/30 transition-all">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Trade Recommendations</h3>
            <p className="text-slate-400">Actionable insights with entry/exit strategies</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-purple-500/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-slate-400">
            Built with Next.js, TypeScript, Tailwind CSS, and Claude AI
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Not financial advice. Always do your own research.
          </p>
        </div>
      </footer>
    </div>
  );
}
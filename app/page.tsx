'use client';

import { useState } from 'react';

export default function Home() {
  const [ticker, setTicker] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: ticker.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze stock');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-4">
            Stock Analyzer
          </h1>
          <p className="text-slate-300 text-xl">
            AI-Powered Comprehensive Stock Analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Enter stock ticker (e.g., AAPL, TSLA)"
              className="flex-1 px-6 py-4 bg-slate-800/50 backdrop-blur-md border border-purple-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !ticker.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg"
            >
              {loading ? (
  <>
    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Analyzing...
  </>
) : 'Analyze'}
            </button>
          </div>
        </form>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {analysis && (
          <div className="mt-8 bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-purple-500/20">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-purple-500/30">
              <div className="text-5xl">📊</div>
              <div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Analysis Results
                </h2>
                <p className="text-slate-400 text-lg mt-1">{ticker.toUpperCase()}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {analysis.split('\n').map((line: string, index: number) => {
                // Main header (single #)
                if (line.trim().startsWith('# ') && !line.trim().startsWith('## ')) {
                  return (
                    <div key={index} className="mb-4">
                      <h2 className="text-2xl font-bold text-white">
                        {line.replace(/^#\s*/, '')}
                      </h2>
                    </div>
                  );
                }
                
                // Section headers (##)
                if (line.trim().startsWith('## ')) {
                  const headerText = line.replace(/^##\s*/, '');
                  const headerNumber = headerText.match(/^(\d+)\./)?.[1];
                  
                  // Colors and icons for each section
                  const sections: { [key: string]: { color: string; icon: string; bg: string } } = {
                    '1': { color: 'from-blue-400 to-cyan-400', icon: '📋', bg: 'bg-blue-500/10 border-blue-500/30' },
                    '2': { color: 'from-green-400 to-emerald-400', icon: '🌍', bg: 'bg-green-500/10 border-green-500/30' },
                    '3': { color: 'from-purple-400 to-violet-400', icon: '💼', bg: 'bg-purple-500/10 border-purple-500/30' },
                    '4': { color: 'from-yellow-400 to-orange-400', icon: '💰', bg: 'bg-yellow-500/10 border-yellow-500/30' },
                    '5': { color: 'from-red-400 to-rose-400', icon: '⚠️', bg: 'bg-red-500/10 border-red-500/30' },
                    '6': { color: 'from-pink-400 to-fuchsia-400', icon: '🎯', bg: 'bg-pink-500/10 border-pink-500/30' },
                  };
                  
                  const section = sections[headerNumber || '1'] || sections['1'];
                  
                  return (
                    <div key={index} className={`${section.bg} rounded-xl p-6 border mt-8`}>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{section.icon}</span>
                        <h3 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${section.color}`}>
                          {headerText}
                        </h3>
                      </div>
                    </div>
                  );
                }
                
                // Bold text (**text**)
                if (line.includes('**')) {
                  const parts = line.split(/(\*\*.*?\*\*)/g);
                  return (
                    <div key={index} className="text-slate-300 leading-relaxed mb-3">
                      {parts.map((part: string, i: number) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <span key={i} className="font-bold text-white">
                              {part.replace(/\*\*/g, '')}
                            </span>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </div>
                  );
                }
                
                // Bullet points
                if (line.trim().startsWith('- ')) {
                  return (
                    <div key={index} className="flex gap-3 mb-2 ml-4">
                      <span className="text-purple-400 mt-1">•</span>
                      <span className="text-slate-300 flex-1">{line.replace(/^-\s*/, '')}</span>
                    </div>
                  );
                }
                
                // Regular text
                if (line.trim()) {
                  return (
                    <p key={index} className="text-slate-300 leading-relaxed mb-3">
                      {line}
                    </p>
                  );
                }
                
                // Empty lines (spacing)
                return <div key={index} className="h-2"></div>;
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

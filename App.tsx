
import React, { useState, useEffect, useCallback } from 'react';
import { PromptConfig, PromptFramework, GeneratedPrompt } from './types';
import { engineerPrompt } from './services/geminiService';
import { Button } from './components/Button';
import { HistoryItem } from './components/HistoryItem';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedPrompt[]>([]);
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState<PromptConfig>({
    framework: PromptFramework.COSTAR,
    tone: 'Professional',
    includeFlow: true,
  });

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('prompt_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('prompt_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const engineered = await engineerPrompt(query, config);
      setResult(engineered);
      
      const newPrompt: GeneratedPrompt = {
        id: crypto.randomUUID(),
        originalQuery: query,
        engineeredPrompt: engineered,
        timestamp: Date.now(),
        tags: [config.framework, config.tone]
      };
      
      setHistory(prev => [newPrompt, ...prev].slice(0, 50));
    } catch (err) {
      alert("Something went wrong. Please check your connection or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const selectHistoryItem = (item: GeneratedPrompt) => {
    setQuery(item.originalQuery);
    setResult(item.engineeredPrompt);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col lg:flex-row text-slate-100">
      {/* Sidebar - History */}
      <aside className="w-full lg:w-80 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Arka's Improved Prompts</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Recent Architectural Plans</h2>
          {history.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-slate-500 text-sm">No history yet. Start by building your first prompt!</p>
            </div>
          ) : (
            history.map(item => (
              <HistoryItem 
                key={item.id} 
                item={item} 
                onSelect={selectHistoryItem} 
                onDelete={deleteHistoryItem} 
              />
            ))
          )}
        </div>

        <div className="p-4 border-top border-slate-800 text-center">
          <p className="text-xs text-slate-600">Enterprise Grade AI Engine</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-slate-400">Model: Gemini 3 Pro</span>
             <span className="w-1 h-1 rounded-full bg-slate-700"></span>
             <span className="text-sm font-medium text-slate-400">Strategy: Chain of Thought</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setResult(null); }}>
              Clear Workspace
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Input Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-200">User Requirement</h3>
                <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Architectural Input</span>
              </div>
              <div className="relative group">
                <textarea 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe the task or query you want to engineer... (e.g., 'Help me write a creative email to my boss about a project delay')"
                  className="w-full h-40 bg-slate-800/30 border-2 border-slate-700 rounded-2xl p-6 text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all resize-none shadow-inner"
                />
                <div className="absolute bottom-4 right-4 flex gap-3">
                   <Button 
                    isLoading={isGenerating} 
                    onClick={handleGenerate} 
                    disabled={!query.trim()}
                    className="min-w-[140px]"
                   >
                    Build Prompt
                   </Button>
                </div>
              </div>

              {/* Advanced Config */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Framework</label>
                  <select 
                    value={config.framework}
                    onChange={(e) => setConfig({...config, framework: e.target.value as PromptFramework})}
                    className="w-full bg-transparent text-sm focus:outline-none"
                  >
                    {Object.values(PromptFramework).map(f => (
                      <option key={f} value={f} className="bg-slate-900">{f}</option>
                    ))}
                  </select>
                </div>
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Architectural Tone</label>
                  <select 
                    value={config.tone}
                    onChange={(e) => setConfig({...config, tone: e.target.value as any})}
                    className="w-full bg-transparent text-sm focus:outline-none"
                  >
                    <option value="Professional" className="bg-slate-900">Professional</option>
                    <option value="Technical" className="bg-slate-900">Technical</option>
                    <option value="Creative" className="bg-slate-900">Creative</option>
                    <option value="Concise" className="bg-slate-900">Concise</option>
                  </select>
                </div>
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase">Operational Flow</label>
                    <p className="text-[10px] text-slate-600">Include step-by-step logic</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={config.includeFlow}
                    onChange={(e) => setConfig({...config, includeFlow: e.target.checked})}
                    className="w-5 h-5 accent-blue-600 rounded"
                  />
                </div>
              </div>
            </section>

            {/* Output Section */}
            {result && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    Engineered Solution
                  </h3>
                  <Button variant="secondary" size="sm" onClick={handleCopy} className="text-xs">
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </Button>
                </div>
                <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 shadow-2xl overflow-x-auto">
                  <div className="prose prose-invert prose-blue max-w-none">
                    <div className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed">
                      {result}
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-start gap-4">
                   <div className="bg-blue-500/20 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-blue-200">How to use this prompt</p>
                     <p className="text-xs text-blue-300/80 mt-1">Copy the engineered text above and paste it into any LLM (ChatGPT, Claude, Gemini) for superior results. If there are clarification questions at the end, answer them to refine the output further.</p>
                   </div>
                </div>
              </section>
            )}

            {!result && !isGenerating && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600 space-y-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                 <p className="text-sm">Enter a query to generate an engineered architectural plan.</p>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-indigo-500/20 border-b-indigo-500 rounded-full animate-spin-slow"></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-slate-200">Architecting Prompt...</p>
                  <p className="text-sm text-slate-500">Applying frameworks & optimizing parameters</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;

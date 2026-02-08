
import React from 'react';
import { JTubeInput, JTubeOutput } from './types';
import { generateSEOContent } from './services/geminiService';
import InputSection from './components/InputSection';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<JTubeOutput | null>(null);

  const handleGenerate = async (data: JTubeInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const output = await generateSEOContent(data);
      setResult(output);
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate content. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30">
            <i className="fas fa-play text-white text-3xl"></i>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight leading-none">JTube</h1>
            <p className="text-gray-400 mt-1 text-sm md:text-base">The Ultimate AI YouTube SEO Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="https://saweria.co/DragonFroze" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#faad14] hover:bg-[#e69b00] text-gray-900 font-bold px-6 py-3 rounded-xl flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-yellow-600/20 active:scale-95"
          >
            <div className="bg-white/30 rounded-lg w-7 h-7 flex items-center justify-center">
              <i className="fas fa-heart text-red-600"></i>
            </div>
            <span className="whitespace-nowrap">Support via Saweria</span>
          </a>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar - Input */}
        <aside className="lg:col-span-5 sticky top-8">
          <InputSection onGenerate={handleGenerate} isLoading={isLoading} />
          
          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="mt-8 bg-gray-800/50 p-6 rounded-xl border border-dashed border-gray-700 text-gray-400 text-sm">
            <h4 className="font-bold text-gray-300 mb-2 flex items-center gap-2">
              <i className="fas fa-lightbulb text-yellow-500"></i> Pro Tip
            </h4>
            <p>
              Use specific game titles and distinct content types like "Speedrun" or "No Commentary" 
              to get the most accurate trend-aligned results.
            </p>
          </div>
        </aside>

        {/* Right Area - Results */}
        <section id="results-section" className="lg:col-span-7 space-y-6">
          {!result && !isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-gray-500 bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-800">
              <i className="fas fa-magic text-6xl mb-4 opacity-20"></i>
              <p className="text-lg">Ready to optimize your next viral hit?</p>
              <p className="text-sm">Fill out the form to generate SEO content.</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
                <i className="fas fa-chart-line absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-xl"></i>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold animate-pulse text-gray-200">Analyzing Global Gaming Trends...</p>
                <p className="text-sm text-gray-500">Checking keywords, search volume, and competitor data</p>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ResultCard 
                title="AI-Generated High-CTR Titles" 
                content={result.titles} 
                type="list" 
                icon="fas fa-heading"
              />
              
              <ResultCard 
                title="SEO Description (Emoji-Enhanced)" 
                content={result.description} 
                type="text" 
                icon="fas fa-align-left"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResultCard 
                  title="SEO Tags & Keywords" 
                  content={result.tags} 
                  type="tags" 
                  icon="fas fa-tags"
                />

                {result.groundingSources.length > 0 && (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-sm text-gray-400">
                      <i className="fas fa-search text-blue-500"></i> Trend Sources Used
                    </h3>
                    <ul className="space-y-2">
                      {result.groundingSources.slice(0, 5).map((source, idx) => (
                        <li key={idx}>
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:underline flex items-center gap-2 truncate"
                          >
                            <i className="fas fa-link text-[10px]"></i>
                            {source.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-gray-800 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-6 mb-4">
          <a href="https://saweria.co/DragonFroze" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#faad14] transition-colors text-sm flex items-center gap-2">
            <i className="fas fa-coffee"></i> Buy the developer a coffee
          </a>
        </div>
        <div className="text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} JTube AI Engine. Optimized for YouTube Creators.</p>
          <p className="mt-1">Powered by Gemini 3 Flash Intelligence & Google Search Grounding.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

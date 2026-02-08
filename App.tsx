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
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isLackingFunds = error?.includes("Currently lacking funds");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30">
            <i className="fas fa-play text-white text-3xl"></i>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight leading-none text-white">JTube</h1>
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
        <aside className="lg:col-span-5 sticky top-8">
          <InputSection onGenerate={handleGenerate} isLoading={isLoading} />
          
          {error && (
            <div className={`mt-4 p-5 rounded-xl border text-sm space-y-4 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-300 ${
              isLackingFunds 
                ? 'bg-amber-900/40 border-amber-500/50 text-amber-100 shadow-amber-900/20' 
                : 'bg-red-900/30 border-red-500/50 text-red-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isLackingFunds ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                  <i className={`fas ${isLackingFunds ? 'fa-hand-holding-heart' : 'fa-exclamation-triangle'} text-lg`}></i>
                </div>
                <div className="space-y-2 flex-1">
                  <p className="font-bold text-base">{isLackingFunds ? "Support Needed" : "Engine Error"}</p>
                  <p className="opacity-90 leading-relaxed italic">
                    {error}
                  </p>
                </div>
              </div>
              
              {isLackingFunds && (
                <div className="pt-2 flex flex-col gap-3">
                  <a 
                    href="https://saweria.co/DragonFroze" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-amber-500 text-gray-900 py-2.5 rounded-lg font-black text-center hover:bg-amber-400 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    Donate to Saweria
                  </a>
                  <p className="text-[10px] text-amber-300/60 text-center uppercase tracking-widest font-bold">Help keep JTube alive</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 bg-gray-800/50 p-6 rounded-xl border border-dashed border-gray-700 text-gray-400 text-sm">
            <h4 className="font-bold text-gray-300 mb-2 flex items-center gap-2">
              <i className="fas fa-lightbulb text-yellow-500"></i> Pro Tip
            </h4>
            <p>
              Detailed descriptions and correct genres help the AI find the best trending keywords for your specific gaming niche.
            </p>
          </div>
        </aside>

        <section id="results-section" className="lg:col-span-7 space-y-6">
          {!result && !isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-gray-500 bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-800 group hover:border-red-500/30 transition-colors">
              <i className="fas fa-magic text-6xl mb-4 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500"></i>
              <p className="text-lg font-medium">Ready to optimize your next viral hit?</p>
              <p className="text-sm opacity-60">Fill out the form to generate SEO content.</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-red-600/10 border-t-red-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-microchip text-red-500 text-2xl animate-pulse"></i>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 animate-pulse">
                  Querying Gaming Hubs...
                </p>
                <p className="text-gray-500 font-medium">Matching content types with current search volume</p>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
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
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 shadow-xl">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-gray-400 uppercase tracking-widest">
                      <i className="fas fa-globe text-blue-500"></i> SEO Intelligence Base
                    </h3>
                    <ul className="space-y-3">
                      {result.groundingSources.slice(0, 5).map((source, idx) => (
                        <li key={idx}>
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-3 bg-blue-500/5 p-2 rounded-lg border border-blue-500/10 transition-all hover:bg-blue-500/10"
                          >
                            <i className="fas fa-external-link-square-alt text-[10px]"></i>
                            <span className="truncate">{source.title}</span>
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

      <footer className="mt-20 py-12 border-t border-gray-800 flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-8">
          <a href="https://saweria.co/DragonFroze" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#faad14] transition-all transform hover:scale-110 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
              <i className="fas fa-coffee"></i>
            </div>
            <span className="text-xs font-bold">Donate</span>
          </a>
          <div className="h-8 w-px bg-gray-800"></div>
          <div className="flex flex-col items-center gap-2">
             <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 text-red-500">
              <i className="fas fa-robot"></i>
            </div>
            <span className="text-xs font-bold text-gray-400">Gemini 3 Flash</span>
          </div>
        </div>
        <div className="text-gray-600 text-xs max-w-md leading-relaxed">
          <p className="font-bold mb-1">&copy; {new Date().getFullYear()} JTube AI SEO Engine</p>
          <p>Built for gaming creators to dominate the algorithm. Use responsibly to enhance reach, not spam.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;


import React from 'react';

interface ResultCardProps {
  title: string;
  content: string | string[];
  type: 'list' | 'text' | 'tags';
  icon: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, content, type, icon }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    let textToCopy = '';
    if (type === 'list' && Array.isArray(content)) {
      textToCopy = content.join('\n');
    } else if (typeof content === 'string') {
      textToCopy = content;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
      <div className="bg-gray-750 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <h3 className="font-bold flex items-center gap-2">
          <i className={`${icon} text-red-500`}></i> {title}
        </h3>
        <button
          onClick={handleCopy}
          className="text-xs font-semibold px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors flex items-center gap-1"
        >
          {copied ? <i className="fas fa-check text-green-500"></i> : <i className="fas fa-copy"></i>}
          {copied ? 'Copied' : 'Copy All'}
        </button>
      </div>
      
      <div className="p-4 flex-grow overflow-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-600">
        {type === 'list' && Array.isArray(content) && (
          <ul className="space-y-3">
            {content.map((item, idx) => (
              <li key={idx} className="flex gap-3 group">
                <span className="text-red-500 font-mono text-sm mt-1">{idx + 1}.</span>
                <span className="text-gray-200 leading-relaxed group-hover:text-white transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {type === 'text' && typeof content === 'string' && (
          <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed text-sm">
            {content}
          </pre>
        )}

        {type === 'tags' && typeof content === 'string' && (
          <div className="flex flex-wrap gap-2">
            {content.split(',').map((tag, idx) => (
              <span key={idx} className="bg-gray-900 text-gray-400 text-xs px-2 py-1 rounded-full border border-gray-700">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;


import React, { useState } from 'react';
// Changed ArticleContent to DanmeiContent as it is the valid export from types.ts
import { DanmeiContent } from '../types';
import { Check, Copy, Layout, FileText, Info, Sparkles } from 'lucide-react';

interface Props {
  content: DanmeiContent;
}

const ArticleResult: React.FC<Props> = ({ content }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const SectionHeader = ({ title, icon: Icon, onCopy }: { title: string, icon: any, onCopy?: () => void }) => (
    <div className="flex items-center justify-between mb-4 border-b pb-2">
      <div className="flex items-center gap-2 text-gray-800">
        <Icon size={20} className="text-purple-600" />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      {onCopy && (
        <button
          onClick={onCopy}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 transition-colors"
        >
          {copiedSection === title ? <Check size={16} /> : <Copy size={16} />}
          <span>{copiedSection === title ? '已复制' : '复制全部'}</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title Section - Using content.title */}
      {content.title && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <SectionHeader title="作品标题" icon={FileText} />
          <div className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors">
            <p className="text-gray-700 font-medium">{content.title}</p>
            <button 
              onClick={() => handleCopy(content.title!, '作品标题')}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-purple-600 transition-all"
            >
              {copiedSection === '作品标题' ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* Body Section - Using content.body */}
      {content.body && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <SectionHeader title="唯美试读" icon={Layout} onCopy={() => handleCopy(content.body!, '唯美试读')} />
          <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
            {content.body}
          </div>
        </div>
      )}

      {/* Plot Hooks Section - Using content.plotHooks instead of imageSuggestions */}
      {content.plotHooks && content.plotHooks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <SectionHeader title="剧情钩子" icon={Sparkles} onCopy={() => handleCopy(content.plotHooks!.join('\n'), '剧情钩子')} />
          <ul className="space-y-4">
            {content.plotHooks.map((hook, idx) => (
              <li key={idx} className="flex gap-4 items-start p-3 bg-purple-50 rounded-lg border border-purple-100">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <p className="text-purple-800 text-sm">{hook}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Info Section - Using pairings and traits for metadata/guide info */}
      {(content.pairings || (content.traits && content.traits.length > 0)) && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-purple-400">
          <SectionHeader title="设定概览" icon={Info} />
          <div className="space-y-4">
            {content.pairings && (
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <span className="font-bold text-purple-600">CP设定：</span> {content.pairings}
              </div>
            )}
            {content.traits && content.traits.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.traits.map(trait => (
                  <span key={trait} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-md font-medium">#{trait}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleResult;

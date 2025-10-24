import { useState } from 'react';
import { JournalPage } from '../data/dummyData';
import { BookOpen } from 'lucide-react';

interface PageDescriptionProps {
  page: JournalPage | null;
  onJumpTo?: (pageNumber: number) => void;
  totalPages?: number;
}

export default function PageDescription({ page, onJumpTo, totalPages }: PageDescriptionProps) {
  if (!page) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <div className="text-center text-slate-600">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-2xl font-serif text-slate-800 mb-2">
            Echo Journal
          </h3>
          <p className="text-slate-600 leading-relaxed">
            A beautifully crafted journal designed to guide you through your emotional intelligence journey.
            Open the journal to explore its pages.
          </p>
        </div>
      </div>
    );
  }

  // Always show 'Introduction' label per request
  const getCategoryIcon = () => <BookOpen className="w-5 h-5" />;
  const getCategoryColor = () => 'bg-slate-100 text-slate-700';

  const [jumpValue, setJumpValue] = useState('');
  const handleJump = () => {
    const n = Number(jumpValue);
    if (!onJumpTo) return;
    if (!Number.isFinite(n)) return;
    const maxIndex = (totalPages || 1) - 1;
    const clampedIndex = Math.max(0, Math.min(maxIndex, Math.floor(n)));
    const targetPage = clampedIndex + 1; // app uses 1-based page numbers
    onJumpTo(targetPage);
    setJumpValue('');
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 justify-between">
        <div className="flex items-center gap-3">
          <span className={`${getCategoryColor()} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}>
            {getCategoryIcon()}
            Introduction
          </span>
          <span className="text-sm text-slate-500 ml-1">Page {page.page_number}</span>
        </div>
        {onJumpTo && (
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <input
              type="number"
              min={0}
              max={totalPages ? totalPages - 1 : undefined}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleJump(); }}
              placeholder={`0 - ${totalPages ? totalPages - 1 : 'N'}`}
              className="w-20 sm:w-20 px-2 py-1 border rounded text-sm"
            />
            <button onClick={handleJump} className="px-3 py-1 bg-amber-500 text-white rounded text-sm whitespace-nowrap">Go</button>
          </div>
        )}
      </div>

      <h2 className="text-3xl font-serif text-slate-800 mb-4">
        {page.title}
      </h2>

      <p className="text-slate-700 leading-relaxed text-lg mb-6">
        {page.description}
      </p>

      <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-50/50 rounded-r">
        <p className="text-slate-600 italic">
          "{page.content.substring(0, 150)}..."
        </p>
      </div>
    </div>
  );
}

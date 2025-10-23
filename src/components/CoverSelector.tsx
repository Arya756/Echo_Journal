import { JournalCover } from '../data/dummyData';
import { Check } from 'lucide-react';

interface CoverSelectorProps {
  covers: JournalCover[];
  selectedCoverId: string;
  onSelectCover: (cover: JournalCover) => void;
}

export default function CoverSelector({
  covers,
  selectedCoverId,
  onSelectCover
}: CoverSelectorProps) {
  const getTextureLabel = (texture: string) => {
    return texture.charAt(0).toUpperCase() + texture.slice(1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">
        Choose Your Cover
      </h3>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 justify-center">
        {covers.map((cover) => (
          <button
            key={cover.id}
            onClick={() => onSelectCover(cover)}
            className={`relative group transition-all transform hover:scale-105 w-full ${
              selectedCoverId === cover.id ? 'scale-105' : ''
            }`}
          >
            <div
              className="w-full aspect-[3/4] rounded-lg shadow-lg transition-shadow group-hover:shadow-xl relative overflow-hidden"
              style={{ backgroundColor: cover.color }}
            >
              {cover.image_url && (
                // image covers the card area
                <img
                  src={cover.image_url}
                  alt={cover.title || `Cover ${cover.id}`}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              {selectedCoverId === cover.id && (
                <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium text-slate-700">{cover.title}</p>
              <p className="text-xs text-slate-500">{getTextureLabel(cover.texture)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

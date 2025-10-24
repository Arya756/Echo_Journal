import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Journal3DProps {
  coverColor: string;
  texture: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageContent?: {
    title: string;
    content: string;
    description?: string;
  };
  coverImage?: string | null;
  pageImage?: string | null;
  prevPageImage?: string | null;
}

export default function Journal3D({
  coverColor,
  texture,
  currentPage,
  totalPages,
  onPageChange,
  pageContent
  , coverImage,
  pageImage
  , prevPageImage
}: Journal3DProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [rotation, setRotation] = useState({ x: -15, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [bookWidth, setBookWidth] = useState<number>(400);
  const [bookHeight, setBookHeight] = useState<number>(550);

  // (touch detection not needed directly — touch handlers are wired below)

  useEffect(() => {
    const computeSize = () => {
      if (typeof window === 'undefined') return;
      const vw = Math.max(320, Math.min(window.innerWidth, 1200));
      // use up to 85% of viewport width on small screens, cap at 400
      const w = Math.min(400, Math.floor(vw * 0.85));
      const h = Math.round(w * 1.375); // maintain original aspect ratio (550/400)
      setBookWidth(w);
      setBookHeight(h);
    };

    computeSize();
    window.addEventListener('resize', computeSize);
    return () => window.removeEventListener('resize', computeSize);
  }, []);

  // proportional depth values to avoid fixed pixel translateZ that cause expansion on small screens
  const zDepth = Math.max(12, Math.round(bookWidth * 0.075));
  const spineOffset = Math.max(8, Math.round(bookWidth * 0.03));
  const spineWidth = Math.max(18, Math.round(bookWidth * 0.07));

  const handleMouseDown = (e: React.MouseEvent) => {
    // prevent image selection when starting a drag
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // prevent page from scrolling while dragging
    e.preventDefault();
    const t = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: t.clientX, y: t.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setRotation(prev => ({
      x: Math.max(-30, Math.min(30, prev.x - deltaY * 0.3)),
      y: Math.max(-45, Math.min(45, prev.y + deltaX * 0.3))
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const t = e.touches[0];
    const deltaX = t.clientX - dragStart.x;
    const deltaY = t.clientY - dragStart.y;

    // reduce sensitivity for touch
    const mul = 0.16;
    setRotation(prev => ({
      x: Math.max(-30, Math.min(30, prev.x - deltaY * mul)),
      y: Math.max(-45, Math.min(45, prev.y + deltaX * mul))
    }));

    setDragStart({ x: t.clientX, y: t.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const flipPage = (direction: 'next' | 'prev') => {
    if (isFlipping) return;

    setIsFlipping(true);

    if (direction === 'next' && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      onPageChange(currentPage - 1);
    }

    setTimeout(() => setIsFlipping(false), 800);
  };

  const getTextureStyle = (texture: string) => {
    switch (texture) {
      case 'leather':
        return 'bg-gradient-to-br from-amber-900/20 to-transparent';
      case 'fabric':
        return 'bg-gradient-to-br from-slate-900/20 to-transparent';
      case 'paper':
        return 'bg-gradient-to-br from-amber-50/20 to-transparent';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      <div
        className="relative cursor-grab active:cursor-grabbing"
        style={{
          width: `${bookWidth}px`,
          height: `${bookHeight}px`,
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          touchAction: 'none' // prevent default browser touch handling while interacting
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Journal Book */}
        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
          {/* Back Cover (behind) */}
          <div
            className={`absolute rounded-r-lg shadow-2xl ${getTextureStyle(texture)} overflow-hidden`}
            style={{
              width: `${bookWidth}px`,
              height: `${bookHeight}px`,
              transform: `translateZ(-${zDepth}px)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {coverImage && (
              <img src={coverImage} alt="back cover" className="absolute inset-0 w-full h-full object-cover select-none" draggable={false} onDragStart={(e) => e.preventDefault()} style={{ touchAction: 'none' }} />
            )}
          </div>

          {/* Pages Stack */}
          <div
            className="absolute bg-gradient-to-r from-amber-50 to-white shadow-inner"
            style={{
              width: `${bookWidth}px`,
              height: `${bookHeight}px`,
              transform: `translateZ(-${Math.max(1, zDepth - 1)}px) translateX(2px)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Page lines effect */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute right-0 w-[2px] h-full bg-amber-100/50"
                style={{ right: `${i * 2}px` }}
              />
            ))}
          </div>

          {/* Current Page (Right side when open) */}
          {currentPage > 0 && (
            <div
              className={`absolute bg-gradient-to-br from-amber-50 to-white shadow-xl rounded-r-lg overflow-hidden ${
                  isFlipping ? 'animate-page-flip' : ''
                }`}
              style={{
                width: `${bookWidth}px`,
                height: `${bookHeight}px`,
                transform: 'translateZ(0px)',
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-amber-50/30 to-transparent" />
              {/* Full-bleed index image when opened (no padding/gaps) */}
              {currentPage === 1 ? (
                <>
                      <img
                        src="/index_page.jpg"
                        alt="Index Page"
                        className="absolute inset-0 w-full h-full object-cover select-none"
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        style={{ touchAction: 'none' }}
                      />
                </>
              ) : pageImage ? (
                <div className="relative w-full h-full flex">
                  <div className="w-1/2 h-full overflow-hidden border-r border-amber-100/30">
                    {prevPageImage ? (
                      <img src={prevPageImage} alt="Previous page" className="absolute inset-0 w-full h-full object-cover select-none" draggable={false} onDragStart={(e) => e.preventDefault()} style={{ touchAction: 'none' }} />
                    ) : (
                      <div className="w-full h-full bg-amber-50/40" />
                    )}
                  </div>
                  <div className="w-1/2 h-full overflow-hidden">
                    <img src={pageImage} alt="Current page" className="absolute inset-0 w-full h-full object-cover select-none" draggable={false} onDragStart={(e) => e.preventDefault()} style={{ touchAction: 'none' }} />
                  </div>
                </div>
              ) : (
                <div className="p-12 h-full flex flex-col" style={{ width: `${bookWidth}px`, height: `${bookHeight}px` }}>
                  {pageContent && (
                    <>
                      <h2 className="text-2xl font-serif text-slate-800 mb-6">{pageContent.title}</h2>
                      <p className="text-slate-700 leading-relaxed font-serif whitespace-pre-line flex-1">{pageContent.content}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Front Cover */}
          <div
            className={`relative rounded-lg shadow-2xl overflow-hidden ${getTextureStyle(texture)}`}
            style={{
              width: `${bookWidth}px`,
              height: `${bookHeight}px`,
              backgroundColor: coverImage ? 'transparent' : coverColor,
              transform: currentPage === 0 ? 'translateZ(1px)' : `translateZ(-${zDepth}px) rotateY(-180deg)`,
              transformStyle: 'preserve-3d',
              transformOrigin: 'right center',
              transition: 'transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
          >
            {coverImage ? (
              <img src={coverImage} alt="cover" className="absolute inset-0 w-full h-full object-cover select-none" draggable={false} onDragStart={(e) => e.preventDefault()} />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative h-full flex flex-col items-center justify-center p-12">
                  <div className="text-center">
                    <div className="text-6xl font-serif text-white/90 mb-4 tracking-wider">
                      Echo
                    </div>
                    <div className="text-2xl font-light text-white/80 tracking-[0.3em] mb-8">
                      JOURNAL
                    </div>
                    <div className="w-32 h-[1px] bg-white/40 mx-auto mb-8" />
                    <div className="text-sm text-white/70 font-serif italic">
                      A Journey Through
                      <br />
                      Emotional Intelligence
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Spine */}
          <div
            className="absolute left-0 top-0 shadow-xl"
            style={{
              width: `${spineWidth}px`,
              height: `${bookHeight}px`,
              backgroundColor: coverColor,
              transform: `translateX(-${spineOffset}px) translateZ(-${Math.round(zDepth / 2)}px) rotateY(90deg)`,
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          </div>
        </div>

        {/* Navigation Buttons */}
        {currentPage > 0 && (
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-4">
            <button
              onClick={() => flipPage('prev')}
              disabled={currentPage === 0 || isFlipping}
              className="bg-white/90 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>
            <button
              onClick={() => flipPage('next')}
              disabled={currentPage === totalPages || isFlipping}
              className="bg-white/90 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        )}
      </div>

      {/* Open Journal Button (when closed) */}
      {currentPage === 0 && (
        <button
          onClick={() => flipPage('next')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 hover:bg-white px-8 py-3 rounded-full shadow-xl transition-all transform hover:scale-105 text-slate-700 font-medium"
        >
          Open Journal
        </button>
      )}
    </div>
  );
}

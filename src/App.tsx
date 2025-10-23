import { useState, useEffect } from 'react';
import { dummyCovers, JournalCover, JournalPage } from './data/dummyData';
import Journal3D from './components/Journal3D';
import CoverSelector from './components/CoverSelector';
import PageDescription from './components/PageDescription';
import { usePdf } from './lib/usePdf';

function App() {
  const [covers] = useState<JournalCover[]>(dummyCovers);
  const [pages, setPages] = useState<JournalPage[]>([]);
  const [selectedCover, setSelectedCover] = useState<JournalCover>(
    dummyCovers.find(c => c.is_default) || dummyCovers[0]
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [pageImage, setPageImage] = useState<string | null>(null);

  const { loadPdf, renderPageToDataUrl, extractPageText, extractPageFullText } = usePdf();

  // load PDF from public and build pages metadata (index page first)
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const doc = await loadPdf('/my-journal.pdf');
        const num = doc.numPages || 0;
        const built: JournalPage[] = [];
        // Common description for all pages (append page number per page)
        const commonDescription = `In a world that teaches us to think fast but rarely to feel slow, The Echo Journal is your space to pause, reflect, and reconnect with yourself.\n\nRooted in the principles of Emotional Intelligence and the RULER framework — Recognizing, Understanding, Labeling, Expressing, and Regulating emotions — this journal is designed to turn emotional awareness into a daily habit.`;

        // Page 1: index image (use existing public/index_page.jpg)
        const firstFull = await (extractPageFullText ? extractPageFullText(1).catch(() => '') : Promise.resolve(''));
        built.push({
          id: '1',
          page_number: 1,
          title: 'Index',
          description: commonDescription,
          content: firstFull || '',
          category: 'introduction',
          image_url: '/index_page.jpg'
        });

        // PDF pages -> map to page_number 2..num+1
        for (let i = 1; i <= num; i++) {
          const full = await (extractPageFullText ? extractPageFullText(i).catch(() => '') : Promise.resolve(''));
          built.push({
            id: String(i + 1),
            page_number: i + 1,
            title: `Page ${i + 1}`,
            description: commonDescription,
            content: full || '',
            category: i % 4 === 0 ? 'prompts' : i % 4 === 1 ? 'exercises' : i % 4 === 2 ? 'reflections' : 'introductions',
            image_url: null
          });
        }

        if (mounted) setPages(built);
      } catch (err) {
        console.error('Failed to load PDF', err);
      }
    }

    init();
    return () => { mounted = false; };
  }, [loadPdf, extractPageText]);

  // Render current page image (for pdf pages). PDF page mapping: currentPage-1
  useEffect(() => {
    let mounted = true;
    async function render() {
      if (currentPage <= 1) {
        setPageImage(null);
        return;
      }
      try {
        const pdfPageNumber = currentPage - 1;
        const dataUrl = await renderPageToDataUrl(pdfPageNumber, 1.5);
        if (mounted) setPageImage(dataUrl);
      } catch (err) {
        console.error('render page error', err);
        setPageImage(null);
      }
    }
    render();
    return () => { mounted = false; };
  }, [currentPage, renderPageToDataUrl]);

  const getCurrentPageData = () => {
    if (currentPage === 0) return null;
    return pages.find(p => p.page_number === currentPage) || null;
  };

  const currentPageData = getCurrentPageData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-blue-50">
      {/* Header */}
      <header className="pt-8 pb-4 text-center">
        <h1 className="text-5xl font-serif text-slate-800 mb-2">Echo Journal</h1>
        <p className="text-slate-600 text-lg">Explore Emotional Intelligence Through Interactive Pages</p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Cover Selector */}
        {currentPage === 0 && (
          <div className="mb-12">
            <CoverSelector
              // show only covers that have an image file in the public folder
              covers={covers.filter(c => c.image_url)}
              selectedCoverId={selectedCover.id}
              onSelectCover={setSelectedCover}
            />
          </div>
        )}

        {/* 3D Journal Display */}
        <div className="mb-12 h-[700px]">
          <Journal3D
            coverColor={selectedCover.color}
            texture={selectedCover.texture}
            currentPage={currentPage}
            totalPages={pages.length}
            onPageChange={setCurrentPage}
            coverImage={selectedCover.image_url}
            pageContent={currentPageData ? {
              title: currentPageData.title,
              content: currentPageData.content,
              description: currentPageData.description
            } : undefined}
            pageImage={pageImage}
          />
        </div>

        {/* Page Description */}
        <div className="mb-12">
          <PageDescription page={currentPageData} onJumpTo={setCurrentPage} totalPages={pages.length} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm">
        <p>Echo Journal - A companion for your emotional intelligence journey</p>
      </footer>
    </div>
  );
}

export default App;

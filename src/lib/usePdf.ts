import { useRef, useState, useCallback } from 'react';

export function usePdf() {
  const pdfRef = useRef<any | null>(null);
  const pdfLibRef = useRef<any | null>(null);
  const renderCache = useRef<Map<number, string>>(new Map());
  const textCache = useRef<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);

  const loadPdf = useCallback(async (url: string) => {
    setLoading(true);
    let pdfjsLib: any;
    try {
      pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
    } catch (err) {
      pdfjsLib = await import('pdfjs-dist/build/pdf');
    }
    pdfLibRef.current = pdfjsLib;
    try {
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${(pdfjsLib as any).version}/build/pdf.worker.min.js`;
    } catch (e) {
      // ignore
    }
    const loadingTask = (pdfjsLib as any).getDocument(url);
    pdfRef.current = await loadingTask.promise;
    setLoading(false);
    return pdfRef.current;
  }, []);

  const renderPageToDataUrl = useCallback(
    async (pageNumber: number, scale = 1.5) => {
      const cached = renderCache.current.get(pageNumber);
      if (cached) return cached;
      if (!pdfRef.current) throw new Error('PDF not loaded');

      const page = await pdfRef.current.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext('2d')!;
      const renderTask = page.render({ canvasContext: ctx, viewport });
      await renderTask.promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      renderCache.current.set(pageNumber, dataUrl);
      return dataUrl;
    },
    []
  );

  const extractPageText = useCallback(async (pageNumber: number) => {
    const cached = textCache.current.get(pageNumber);
    if (cached) return cached;
    if (!pdfRef.current) throw new Error('PDF not loaded');

    const page = await pdfRef.current.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const strings = textContent.items.map((s: any) => (s.str || '').trim()).filter(Boolean);
    const text = strings.join(' ');
    // get first 3 sentences as description
    const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    const desc = sentences.slice(0, 3).join(' ').trim();
    textCache.current.set(pageNumber, desc || (text.slice(0, 160) + (text.length > 160 ? '...' : '')));
    return textCache.current.get(pageNumber)!;
  }, []);

  const extractPageFullText = useCallback(async (pageNumber: number) => {
    if (!pdfRef.current) throw new Error('PDF not loaded');
    const page = await pdfRef.current.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const strings = textContent.items.map((s: any) => (s.str || '').trim()).filter(Boolean);
    const text = strings.join(' ');
    return text;
  }, []);

  const clearCache = useCallback(() => {
    renderCache.current.clear();
    textCache.current.clear();
  }, []);

  return {
    loadPdf,
    renderPageToDataUrl,
  extractPageText,
  extractPageFullText,
    clearCache,
    loading,
    get numPages() {
      return pdfRef.current ? pdfRef.current.numPages : 0;
    }
  };
}

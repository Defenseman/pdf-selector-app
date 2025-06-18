import { useEffect, useRef, useState } from 'react';
import { PDFPageProxy, PageViewport } from 'pdfjs-dist/types/src/display/api';
import { useCreateFragment } from './hooks/useCreateFragment';

interface Props {
  page: PDFPageProxy;
}

export const PdfPage = ({ page }: Props) => {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [viewport, setViewport] = useState<PageViewport | null>(null);

  const {
    rect, handleMouseDown, handleMouseMove, handleMouseUp, handleApply
  } = useCreateFragment({pdfCanvasRef,overlayCanvasRef});

  useEffect(() => {
    const render = async () => {
      const vp = page.getViewport({ scale: 1.5 });
      setViewport(vp);

      const canvas = pdfCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      canvas.width = vp.width;
      canvas.height = vp.height;

      if (ctx) {
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
      }

      const overlay = overlayCanvasRef.current;
      if (overlay) {
        overlay.width = vp.width;
        overlay.height = vp.height;
      }
    };

    render();
  }, [page]);

  return (
    <div style={{ position: 'relative', marginBottom: '1rem' }}>
      <canvas ref={pdfCanvasRef} style={{ display: 'block' }} />
      <canvas
      ref={overlayCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: 'crosshair',
          zIndex: 2,
        }}
        width={viewport?.width}
        height={viewport?.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        {rect && <button onClick={handleApply}>Применить</button>}
      </div>
    </div>
  );
};

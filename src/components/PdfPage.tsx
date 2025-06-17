import { useEffect, useRef, useState } from 'react';

interface Props {
  page: any;
  pageNum: number;
  onApplyFragment: (base64: string) => void;
}

export const PdfPage = ({ page, pageNum, onApplyFragment }: Props) => {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [viewport, setViewport] = useState<any>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

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

  const drawOverlay = (rect: { x: number; y: number; w: number; h: number }) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const bounds = overlayCanvasRef.current!.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    setStart({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !start) return;

    const bounds = overlayCanvasRef.current!.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const w = x - start.x;
    const h = y - start.y;
    const currentRect = { x: start.x, y: start.y, w, h };
    setRect(currentRect);
    drawOverlay(currentRect);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleApply = () => {
    if (!rect || !pdfCanvasRef.current) return;

    const src = pdfCanvasRef.current;
    const temp = document.createElement('canvas');
    const ctx = temp.getContext('2d')!;
    const w = Math.abs(rect.w);
    const h = Math.abs(rect.h);

    temp.width = w;
    temp.height = h;

    const x = rect.w < 0 ? rect.x + rect.w : rect.x;
    const y = rect.h < 0 ? rect.y + rect.h : rect.y;

    ctx.drawImage(src, x, y, w, h, 0, 0, w, h);

    const base64 = temp.toDataURL();
    onApplyFragment(base64);

    setRect(null);
    drawOverlay({ x: 0, y: 0, w: 0, h: 0 }); // clear
  };

  return (
    <div style={{ position: 'relative', marginBottom: '1rem' }}>
      <p>Страница {pageNum}</p>
      <canvas ref={pdfCanvasRef} style={{ display: 'block' }} />
      <canvas
        ref={overlayCanvasRef}
        style={{
          position: 'absolute',
          top: 20, // учти высоту <p> выше
          left: 0,
          pointerEvents: 'none',
        }}
      />
      <canvas
        style={{
          position: 'absolute',
          top: 20,
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
      {rect && <button onClick={handleApply}>Применить</button>}
    </div>
  );
};

import { useEffect, useRef } from "react";

type Props = {
  page: any;
  pageNum: number;
}

export const PdfPage = ({ page, pageNum }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const renderPage = async () => {
      const viewport = page.getViewport({ scale: 1.5 });
  
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (context) {
        await page.render({ canvasContext: context, viewport}).promise
      }
    }
    renderPage();
  }, [page])
  return (
    <div>
      <canvas ref={canvasRef} />
      <p style={{textAlign: 'end'}}>Page № {pageNum}</p>
    </div>
  )
}

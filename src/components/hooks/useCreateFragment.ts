import { useState, type RefObject } from "react";
import { addFragment } from "../../store/slices/fragmentSlice";
import { v4 } from "uuid";
import { useDispatch } from "react-redux";


type Rect = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };

type Props = {
    pdfCanvasRef: RefObject<HTMLCanvasElement | null>;
    overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
}

export const useCreateFragment = ({ pdfCanvasRef, overlayCanvasRef }:Props) => {
    const dispatch = useDispatch()

    const [isDrawing, setIsDrawing] = useState(false);
    const [start, setStart] = useState<Point | null>(null);
    const [rect, setRect] = useState<Rect | null>(null);

    const drawOverlay = ({ x, y, w, h }: Rect) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
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

    dispatch(addFragment({id: v4(), base64}))

    setRect(null);
    drawOverlay({ x: 0, y: 0, w: 0, h: 0 });
  };

    return {
        rect,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleApply
    }
}

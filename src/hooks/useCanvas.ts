import { useRef, useEffect, useState } from "react";
import { Transform } from "../types";
import { clamp } from "../utils/math";
import { INITIAL_TRANSFORM } from "../constants";

export function useCanvas() {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [tf, setTf] = useState<Transform>(INITIAL_TRANSFORM);

  // Wheel zoom + pointer drag pan
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    let panning = false;
    let sx = 0, sy = 0;
    let bx = 0, by = 0;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.08 : 0.92;

      setTf((prev) => {
        const ns = clamp(prev.s * factor, 0.2, 3);
        const wx = (mx - prev.x) / prev.s;
        const wy = (my - prev.y) / prev.s;
        const nx = mx - wx * ns;
        const ny = my - wy * ns;
        return { x: nx, y: ny, s: ns };
      });
    }

    function onDown(e: PointerEvent) {
      panning = true;
      sx = e.clientX;
      sy = e.clientY;
      bx = tf.x;
      by = tf.y;
      (el as any).setPointerCapture?.(e.pointerId);
    }
    
    function onMove(e: PointerEvent) {
      if (!panning) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      setTf((prev) => ({ ...prev, x: bx + dx, y: by + dy }));
    }
    
    function onUp(e: PointerEvent) {
      panning = false;
      try { (el as any).releasePointerCapture?.(e.pointerId); } catch {}
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);

    return () => {
      el.removeEventListener("wheel", onWheel as any);
      el.removeEventListener("pointerdown", onDown as any);
      el.removeEventListener("pointermove", onMove as any);
      el.removeEventListener("pointerup", onUp as any);
    };
  }, [tf.x, tf.y, tf.s]);

  const resetView = () => setTf(INITIAL_TRANSFORM);
  const zoomIn = () => setTf((prev) => ({ ...prev, s: Math.min(3, prev.s * 1.2) }));
  const zoomOut = () => setTf((prev) => ({ ...prev, s: Math.max(0.2, prev.s * 0.8) }));

  return {
    boardRef,
    transform: tf,
    resetView,
    zoomIn,
    zoomOut,
  };
}

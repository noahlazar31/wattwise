"use client";
import { useEffect, useRef, useState } from "react";

export function useCountUp(
  target: number,
  duration = 1400,
  decimals = 2,
  delay = 0
): number {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    setCurrent(0);
    startRef.current = 0;

    const timeout = setTimeout(() => {
      const animate = (ts: number) => {
        if (!startRef.current) startRef.current = ts;
        const elapsed = ts - startRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
        setCurrent(Number((eased * target).toFixed(decimals)));
        if (progress < 1) frameRef.current = requestAnimationFrame(animate);
      };
      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, decimals, delay]);

  return current;
}

"use client";

import { useEffect, useRef, useState } from "react";

export function useSectionObserver(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export function useCountUp(
  target: number,
  isActive: boolean,
  duration = 1500
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, isActive, duration]);

  return value;
}

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionIds.length) return;

    const visibility = new Map<string, number>();
    const observers: IntersectionObserver[] = [];

    const pickActive = () => {
      let bestId: string | null = null;
      let bestRatio = 0;

      for (const id of sectionIds) {
        const ratio = visibility.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }

      setActiveId(bestRatio > 0 ? bestId : null);
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibility.set(id, entry.intersectionRatio);
          } else {
            visibility.delete(id);
          }
          pickActive();
        },
        { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.15, 0.35, 0.55] }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return activeId;
}

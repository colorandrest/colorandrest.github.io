"use client";

import { useEffect, useRef, type ReactNode } from "react";

type SnapControllerProps = {
  children: ReactNode;
  className?: string;
  onActiveMonthChange?: (month: string | null) => void;
};

export default function SnapController({
  children,
  className = "",
  onActiveMonthChange,
}: SnapControllerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onActiveMonthChangeRef = useRef(onActiveMonthChange);

  useEffect(() => {
    onActiveMonthChangeRef.current = onActiveMonthChange;
  }, [onActiveMonthChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let locked = false;
    let touchStartY = 0;
    let touchLastY = 0;
    let unlockTimer: ReturnType<typeof setTimeout> | undefined;
    let scrollFrame: number | undefined;
    let activeMonth: string | null | undefined;

    const panels = () => Array.from(el.querySelectorAll<HTMLElement>("[data-snap-panel]"));

    const currentIndex = () => {
      const items = panels();
      if (!items.length) return 0;
      const center = el.scrollTop + el.clientHeight / 2;
      let nearest = 0;
      let distance = Number.POSITIVE_INFINITY;
      items.forEach((panel, index) => {
        const panelCenter = panel.offsetTop + panel.offsetHeight / 2;
        const nextDistance = Math.abs(center - panelCenter);
        if (nextDistance < distance) {
          distance = nextDistance;
          nearest = index;
        }
      });
      return nearest;
    };

    const updateActiveMonth = () => {
      const panel = panels()[currentIndex()];
      const nextMonth = panel?.dataset.month ?? null;
      if (nextMonth === activeMonth) return;
      activeMonth = nextMonth;
      onActiveMonthChangeRef.current?.(nextMonth);
    };

    const onScroll = () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(updateActiveMonth);
    };

    const move = (direction: -1 | 1) => {
      const items = panels();
      if (!items.length || locked) return;
      const target = Math.min(
        items.length - 1,
        Math.max(0, currentIndex() + direction),
      );
      locked = true;
      el.scrollTo({ top: items[target].offsetTop, behavior: "smooth" });
      if (unlockTimer) clearTimeout(unlockTimer);
      unlockTimer = setTimeout(() => {
        locked = false;
      }, 680);
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 7) return;
      event.preventDefault();
      event.stopPropagation();
      move(event.deltaY > 0 ? 1 : -1);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
      touchLastY = touchStartY;
    };

    const onTouchMove = (event: TouchEvent) => {
      touchLastY = event.touches[0]?.clientY ?? touchLastY;
      if (Math.abs(touchStartY - touchLastY) > 6) event.preventDefault();
    };

    const onTouchEnd = () => {
      const delta = touchStartY - touchLastY;
      if (Math.abs(delta) > 38) move(delta > 0 ? 1 : -1);
      touchStartY = 0;
      touchLastY = 0;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        move(1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        move(-1);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false, capture: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });
    requestAnimationFrame(updateActiveMonth);

    return () => {
      if (unlockTimer) clearTimeout(unlockTimer);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      el.removeEventListener("wheel", onWheel, { capture: true });
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, []);

  return (
    <div ref={ref} className={`snap-stage ${className}`} tabIndex={0}>
      {children}
    </div>
  );
}

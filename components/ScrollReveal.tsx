"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  duration?: number;
  /** initial translate in px (vertical offset before reveal) */
  offset?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  as,
  delay = 0,
  duration = 700,
  offset = 24,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const Tag = (as ?? "div") as ElementType;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${offset}px)`,
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
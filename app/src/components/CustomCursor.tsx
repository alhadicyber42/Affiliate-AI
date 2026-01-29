import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if touch device
    const checkTouch = () => {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);

    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
      });
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.02,
        ease: 'none',
      });
    };

    const handleMouseEnter = () => {
      gsap.to([cursor, cursorDot], { opacity: 1, duration: 0.2 });
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, cursorDot], { opacity: 0, duration: 0.2 });
    };

    // Hover effects for interactive elements
    const handleElementHover = () => {
      gsap.to(cursor, {
        scale: 1.5,
        borderColor: '#22D3EE',
        duration: 0.2,
      });
    };

    const handleElementLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        borderColor: '#7F56D9',
        duration: 0.2,
      });
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleElementHover);
      el.addEventListener('mouseleave', handleElementLeave);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleElementHover);
        el.removeEventListener('mouseleave', handleElementLeave);
      });
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-purple pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ opacity: 0 }}
      />
      {/* Inner dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1 h-1 rounded-full bg-cyan pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: 0 }}
      />
    </>
  );
}

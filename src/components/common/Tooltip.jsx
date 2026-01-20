/**
 * Componente Tooltip Mejorado
 * Vértice Gastronómico
 *
 * Tooltips informativos para mejorar la usabilidad
 */

import React, { useState, useRef, useEffect } from 'react';

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 200,
  disabled = false
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const gap = 8;

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = trigger.left + (trigger.width - tooltip.width) / 2;
        y = trigger.top - tooltip.height - gap;
        break;
      case 'bottom':
        x = trigger.left + (trigger.width - tooltip.width) / 2;
        y = trigger.bottom + gap;
        break;
      case 'left':
        x = trigger.left - tooltip.width - gap;
        y = trigger.top + (trigger.height - tooltip.height) / 2;
        break;
      case 'right':
        x = trigger.right + gap;
        y = trigger.top + (trigger.height - tooltip.height) / 2;
        break;
    }

    // Keep tooltip in viewport
    x = Math.max(8, Math.min(x, window.innerWidth - tooltip.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - tooltip.height - 8));

    setCoords({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible]);

  const handleMouseEnter = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const arrowClasses = {
    top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-700',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-700',
    left: 'right-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-700',
    right: 'left-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-700',
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="inline-flex"
      >
        {children}
      </span>

      {isVisible && content && (
        <div
          ref={tooltipRef}
          className="fixed z-[150] pointer-events-none"
          style={{ left: coords.x, top: coords.y }}
        >
          <div className="relative px-3 py-2 text-sm text-white bg-gray-700 rounded-lg shadow-lg animate-in fade-in zoom-in-95 duration-150">
            {content}
            <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
          </div>
        </div>
      )}
    </>
  );
}

// Componente de ayuda contextual
export function HelpTooltip({ content }) {
  return (
    <Tooltip content={content} position="top">
      <span className="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
    </Tooltip>
  );
}

export default Tooltip;

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImg?: string;
  afterImg?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImg,
  afterImg,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER',
}) => {
  const [position, setPosition] = useState<number>(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(clamped);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      updatePosition(e.touches[0].clientX);
    };

    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, updatePosition]);

  if (!beforeImg && !afterImg) return null;

  // If only one image exists
  if (!beforeImg || !afterImg) {
    const single = afterImg || beforeImg;
    const label = afterImg ? afterLabel : beforeLabel;
    return (
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-200/80">
        <img
          src={single}
          alt={label}
          className="h-full w-full object-contain"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2.5 left-2.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-xs">
          {label}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="group relative aspect-4/3 w-full select-none overflow-hidden rounded-xl bg-slate-950 border border-slate-200/80 shadow-inner"
      style={{ touchAction: 'none' }}
    >
      {/* AFTER (Base full image) */}
      <img
        src={afterImg}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-contain"
        referrerPolicy="no-referrer"
      />

      {/* BEFORE (Clipped top image) */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <img
          src={beforeImg}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute top-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-xs">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-2.5 right-2.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-xs">
        {afterLabel}
      </span>

      {/* Divider Line */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.6)]"
        style={{ left: `${position}%` }}
      />

      {/* Draggable Knob */}
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 cursor-ew-resize items-center justify-center rounded-full bg-white text-slate-900 shadow-lg ring-2 ring-cyan-400 active:scale-105 transition-transform"
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-label="비포 애프터 비교 슬라이더"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPosition((p) => Math.max(0, p - 5));
          if (e.key === 'ArrowRight') setPosition((p) => Math.min(100, p + 5));
        }}
      >
        <span className="text-xs font-black select-none tracking-tighter">↔</span>
      </div>

      {/* Native Range Slider for accessibility */}
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        aria-label="비포 애프터 슬라이더 조절"
      />
    </div>
  );
};

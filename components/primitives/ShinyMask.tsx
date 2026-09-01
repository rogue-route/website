'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'motion/react';

/**
 * ShinyMask — logo/image sibling to ShinyText.
 *
 * ShinyText applies its shine via `background-clip: text`, which only works
 * on real glyphs. This component reuses the exact same progress/animation
 * math (same meaning for spread/speed/delay/direction/pauseOnHover) but
 * drives a `mask-image` overlay instead, so it works on an arbitrary SVG.
 * The underlying <img> is rendered with its native colors intact — the
 * shine is a separate highlight layer clipped to the image's silhouette.
 */

interface ShinyMaskProps {
  src: string;
  alt: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  delay?: number;
  style?: React.CSSProperties;
}

const ShinyMask: React.FC<ShinyMaskProps> = ({
  src,
  alt,
  disabled = false,
  speed = 2,
  className = '',
  shineColor = '#ffffff',
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0,
  style,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const directionRef = useRef(direction === 'left' ? 1 : -1);

  const animationDuration = speed * 1000;
  const delayDuration = delay * 1000;

  useAnimationFrame(time => {
    if (disabled || isPaused) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    elapsedRef.current += deltaTime;

    // Animation goes from 0 to 100 — mirrors ShinyText exactly.
    if (yoyo) {
      const cycleDuration = animationDuration + delayDuration;
      const fullCycle = cycleDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;

      if (cycleTime < animationDuration) {
        const p = (cycleTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? p : 100 - p);
      } else if (cycleTime < cycleDuration) {
        progress.set(directionRef.current === 1 ? 100 : 0);
      } else if (cycleTime < cycleDuration + animationDuration) {
        const reverseTime = cycleTime - cycleDuration;
        const p = 100 - (reverseTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? p : 100 - p);
      } else {
        progress.set(directionRef.current === 1 ? 0 : 100);
      }
    } else {
      const cycleDuration = animationDuration + delayDuration;
      const cycleTime = elapsedRef.current % cycleDuration;

      if (cycleTime < animationDuration) {
        const p = (cycleTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? p : 100 - p);
      } else {
        // Delay phase - hold at end (shine off-screen)
        progress.set(directionRef.current === 1 ? 100 : 0);
      }
    }
  });

  useEffect(() => {
    directionRef.current = direction === 'left' ? 1 : -1;
    elapsedRef.current = 0;
    progress.set(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  // p=0 -> 150% (shine off right), p=100 -> -50% (shine off left) — same as ShinyText.
  const backgroundPosition = useTransform(progress, p => `${150 - p * 2}% center`);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  // Same 5-stop gradient as ShinyText, but transparent instead of `color`
  // on the base stops — this is a highlight layered over the real image,
  // not a full recolor.
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    backgroundImage: `linear-gradient(${spread}deg, transparent 0%, transparent 35%, ${shineColor} 50%, transparent 65%, transparent 100%)`,
    backgroundSize: '200% auto',
  };

  return (
    <span
      className={`relative inline-block ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base layer — real SVG colors, untouched */}
      <img
        src={src}
        alt={alt}
        className="block h-full w-full"
        style={{ objectFit: 'contain' }}
      />
      {/* Shine layer — masked to the logo's silhouette */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ ...maskStyle, backgroundPosition }}
      />
    </span>
  );
};

export default ShinyMask;
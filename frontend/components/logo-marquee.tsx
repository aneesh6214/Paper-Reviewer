"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

interface LogoMarqueeProps {
  className?: string;
}

// Order with NeurIPS before ICRA and ICML swapped to end
const logos = [
  { src: "/conference-logos/aaai.png", alt: "AAAI" },
  { src: "/conference-logos/aiico.png", alt: "AIICO" },
  { src: "/conference-logos/iclr.png", alt: "ICLR" },
  { src: "/conference-logos/neurips.png", alt: "NeurIPS" },
  { src: "/conference-logos/icra.png", alt: "ICRA" },
  { src: "/conference-logos/icml.png", alt: "ICML" },
];

export default function LogoMarquee({ className = "" }: LogoMarqueeProps) {
  // Duplicate list to create a seamless loop
  const loop = [...logos, ...logos];

  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<number>(0);
  const [halfWidth, setHalfWidth] = useState<number>(0);

  const measure = () => {
    const el = trackRef.current;
    if (!el) return;
    setHalfWidth(el.scrollWidth / 2);
  };

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useAnimationFrame((time) => {
    if (!halfWidth) return;
    const last = lastTimeRef.current || time;
    const delta = (time - last) / 1000; // seconds
    lastTimeRef.current = time;
    const SPEED = 40; // px per second
    let next = x.get() - SPEED * delta;
    if (next <= -halfWidth) {
      next += halfWidth; // wrap seamlessly
    }
    x.set(next);
  });

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div
        className="relative w-full"
        style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        <motion.div
          ref={trackRef}
          className="flex items-center gap-16 whitespace-nowrap"
          style={{ x, willChange: 'transform' }}
        >
          {loop.map((logo, idx) => (
            <img
              key={`${logo.alt}-${idx}`}
              src={logo.src}
              alt={logo.alt}
              className="h-8 opacity-70"
              style={{ filter: 'grayscale(100%)', objectFit: 'contain' }}
              onLoad={measure}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}



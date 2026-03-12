"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useStore } from "@/lib/stores/shopStore";

interface ProductActionsProps {
  dress: {
    id: string;
    designer: string;
    name: string;
    price: number;
    img: string;
  };
}

export default function ProductActions({ dress }: ProductActionsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const addToFittingRoom = useStore((state) => state.addToFittingRoom);
  const isCommerceEnabled = useStore((state) => state.isCommerceEnabled);

  // Hydration-safe: defer interactive rendering until client mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // FIXED: Full dependency array prevents stale closures
  const handleAction = useCallback(() => {
    if (!isHydrated) return;

    if (isCommerceEnabled) {
      window.location.href = `/checkout/${dress.id}`;
    } else {
      addToFittingRoom(dress);
      setIsAdded(true);

      // Hardware haptic feedback for supported mobile devices
      if (window?.navigator?.vibrate) {
        window.navigator.vibrate(50);
      }

      setTimeout(() => setIsAdded(false), 2000);
    }
  }, [isHydrated, isCommerceEnabled, dress, addToFittingRoom]);

  // Render inert skeleton until hydration completes
  if (!isHydrated) {
    return (
      <div
        className="mt-10 min-h-[104px] bg-white/5 animate-pulse rounded-3xl"
        aria-hidden="true"
      />
    );
  }

  // Adaptive spring config: respects prefers-reduced-motion
  const springConfig = shouldReduceMotion
    ? { duration: 0.2 }
    : { type: "spring" as const, stiffness: 400, damping: 25, mass: 0.8 };

  return (
    <div className="mt-10 flex flex-col gap-4">
      {/* Price Display */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-4">
        <span className="text-platinum uppercase tracking-widest text-sm font-medium">
          Investment
        </span>
        <span className="text-2xl text-ivory font-light">
          ${dress.price.toLocaleString()}
        </span>
      </div>

      {/* ARIA Live Region for screen reader announcements */}
      <div aria-live="polite" className="sr-only">
        {isAdded ? `${dress.name} added to fitting room` : ""}
      </div>

      <AnimatePresence mode="wait">
        <motion.button
          key={isAdded ? "added" : "default"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.015 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
          transition={springConfig}
          onClick={handleAction}
          disabled={isAdded}
          aria-disabled={isAdded}
          className={`w-full py-5 rounded-full uppercase tracking-[0.2em] text-sm font-bold transition-colors duration-500 ${
            isAdded
              ? "bg-transparent border border-gold text-gold"
              : "bg-gold text-onyx hover:bg-ivory"
          }`}
        >
          {isCommerceEnabled
            ? "Purchase Now"
            : isAdded
              ? "Added to Fitting Room ✓"
              : "Add to Fitting Room"}
        </motion.button>
      </AnimatePresence>
    </div>
  );
}

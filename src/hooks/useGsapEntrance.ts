'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface EntranceOptions {
  /** Selector within the container whose children will stagger in */
  staggerSelector?: string;
  stagger?: number;
  y?: number;
  duration?: number;
  delay?: number;
  ease?: string;
}

/**
 * Animates the container (and optionally its children) into view with GSAP
 * when the component mounts. Returns a ref to attach to the container div.
 */
export function useGsapEntrance<T extends HTMLElement = HTMLDivElement>(
  opts: EntranceOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    staggerSelector,
    stagger = 0.08,
    y = 30,
    duration = 0.6,
    delay = 0,
    ease = 'power3.out',
  } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = staggerSelector ? el.querySelectorAll(staggerSelector) : [el];

    gsap.fromTo(
      targets,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration, delay, stagger, ease, clearProps: 'all' },
    );
  }, [staggerSelector, stagger, y, duration, delay, ease]);

  return ref;
}

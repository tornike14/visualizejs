"use client";

import { useRef, useState, useEffect } from "react";

/**
 * Detects which data channels changed between visualization steps and returns
 * a record of active flash flags. Each flag stays `true` for ~850ms after
 * its channel's data changes, allowing components to conditionally apply
 * `.viz-change-flash` or `.viz-change-flash-pill` CSS classes.
 *
 * The first real step (from -1 to 0) does NOT flash, since everything is new
 * and there is no meaningful "previous state" to compare against.
 *
 * @param channels - Record of named data slices from the current step.
 *   Each key is a "channel" (e.g. "description", "heap", "code").
 *   Values can be any serializable data; they are compared via JSON.stringify.
 * @param stepIndex - The current step index from useStepPlayback.
 *   Used as the effect trigger. When it goes to -1, flash state is cleared.
 * @returns Record with the same keys as `channels`, each `true` if that
 *   channel changed on the most recent step transition (for ~850ms).
 */

const FLASH_DURATION_MS = 850;

export function useChangeFlash<K extends string>(
  channels: Record<K, unknown>,
  stepIndex: number,
): Record<K, boolean> {
  const channelKeys = Object.keys(channels) as K[];

  const prevRef = useRef<Record<K, string> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [flashes, setFlashes] = useState<Record<K, boolean>>(() => {
    const initial = {} as Record<K, boolean>;
    for (const key of channelKeys) initial[key] = false;
    return initial;
  });

  useEffect(() => {
    const currentSerialized = {} as Record<K, string>;
    for (const key of channelKeys) {
      currentSerialized[key] = JSON.stringify(channels[key]);
    }

    const prev = prevRef.current;

    // Reset (step goes back to -1): clear all flash state
    if (stepIndex < 0) {
      prevRef.current = null;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      setFlashes(() => {
        const cleared = {} as Record<K, boolean>;
        for (const key of channelKeys) cleared[key] = false;
        return cleared;
      });
      return;
    }

    // First real step (prev is null): store state but do not flash
    if (prev === null) {
      prevRef.current = currentSerialized;
      return;
    }

    // Compare each channel against its previous value
    const next = {} as Record<K, boolean>;
    let hasChange = false;
    for (const key of channelKeys) {
      const changed = currentSerialized[key] !== prev[key];
      next[key] = changed;
      if (changed) hasChange = true;
    }

    prevRef.current = currentSerialized;
    if (!hasChange) return;

    // Activate flashes for changed channels
    setFlashes(next);

    // Clear any previous timer, then schedule a single reset
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFlashes(() => {
        const cleared = {} as Record<K, boolean>;
        for (const key of channelKeys) cleared[key] = false;
        return cleared;
      });
      timerRef.current = null;
    }, FLASH_DURATION_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return flashes;
}

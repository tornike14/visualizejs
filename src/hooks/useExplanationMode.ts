"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getServerExplanationMode,
  readExplanationMode,
  subscribeExplanationMode,
  writeExplanationMode,
  type ExplanationMode,
} from "@/lib/explanationMode";

/** The reader's Simple / Detailed preference, shared across every topic. */
export const useExplanationMode = () => {
  const mode = useSyncExternalStore(
    subscribeExplanationMode,
    readExplanationMode,
    getServerExplanationMode,
  );
  const setMode = useCallback((next: ExplanationMode) => {
    writeExplanationMode(next);
  }, []);
  return { mode, setMode };
};

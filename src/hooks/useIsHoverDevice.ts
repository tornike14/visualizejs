"use client";

import { useSyncExternalStore } from "react";

const HOVER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";

let hoverMediaQueryList: MediaQueryList | null = null;
const subscribers = new Set<() => void>();
let detachMediaQueryListener: (() => void) | null = null;

const notifySubscribers = () => {
  subscribers.forEach((subscriber) => subscriber());
};

const ensureMediaQuery = () => {
  if (typeof window === "undefined" || hoverMediaQueryList) return;

  hoverMediaQueryList = window.matchMedia(HOVER_MEDIA_QUERY);

  if (typeof hoverMediaQueryList.addEventListener === "function") {
    hoverMediaQueryList.addEventListener("change", notifySubscribers);
    detachMediaQueryListener = () => {
      hoverMediaQueryList?.removeEventListener("change", notifySubscribers);
    };
    return;
  }

  hoverMediaQueryList.addListener(notifySubscribers);
  detachMediaQueryListener = () => {
    hoverMediaQueryList?.removeListener(notifySubscribers);
  };
};

const getSnapshot = (): boolean => {
  if (typeof window === "undefined") return false;
  ensureMediaQuery();
  return hoverMediaQueryList?.matches ?? false;
};

const getServerSnapshot = (): boolean => false;

const subscribe = (callback: () => void): (() => void) => {
  subscribers.add(callback);
  ensureMediaQuery();

  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0) {
      detachMediaQueryListener?.();
      detachMediaQueryListener = null;
      hoverMediaQueryList = null;
    }
  };
};

export const useIsHoverDevice = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

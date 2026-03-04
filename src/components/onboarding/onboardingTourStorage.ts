import { STORAGE_KEYS } from "@/content/static/storageKeys";

export const ONBOARDING_TOUR_DELAY_MS = 2500;

export const hasSeenOnboardingTour = (): boolean => {
  if (typeof window === "undefined") return true;

  try {
    return window.localStorage.getItem(STORAGE_KEYS.onboardingSeen) !== null;
  } catch {
    return true;
  }
};

export const markOnboardingTourSeen = (): void => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      STORAGE_KEYS.onboardingSeen,
      new Date().toISOString(),
    );
  } catch {
    // Ignore storage errors.
  }
};

const JAVASCRIPT_VISUALIZATION_PATH_PATTERN = /^\/javascript\/[^/]+\/?$/;

export const isOnboardingTourPathEligible = (pathname: string): boolean =>
  JAVASCRIPT_VISUALIZATION_PATH_PATTERN.test(pathname);

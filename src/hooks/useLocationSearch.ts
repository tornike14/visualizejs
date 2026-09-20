import { useCallback, useSyncExternalStore } from "react";

const CHANGE_EVENT = "visualizejs:locationchange";

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
};

const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

/**
 * The current query string, kept in sync with the URL. The server and the
 * first client render see an empty string so static pages hydrate cleanly;
 * the real value is applied right after. `replace` rewrites the query without
 * adding a history entry and without touching the path or hash.
 */
export const useLocationSearch = () => {
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const replace = useCallback((nextSearch: string) => {
    const { pathname, hash } = window.location;
    window.history.replaceState(
      window.history.state,
      "",
      `${pathname}${nextSearch}${hash}`,
    );
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { search, replace };
};

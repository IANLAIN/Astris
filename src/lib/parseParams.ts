import { PublicView } from "@/types";

/** Parse screen and publicView from URL search params */
export function parseParams(): { screen: string; publicView: PublicView } {
  const params = new URLSearchParams(window.location.search);
  const screen = params.get("screen") || "home";
  const pv = (params.get("view") || "landing") as PublicView;
  return { screen, publicView: pv };
}

/** Set a search param and navigate */
export function setParam(
  navigate: (to: string, opts?: { replace?: boolean }) => void,
  key: string,
  value: string,
  replace = false,
) {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  navigate(`?${params.toString()}`, { replace });
}

/** Navigate to a screen */
export function setScreenParam(
  navigate: (to: string, opts?: { replace?: boolean }) => void,
  screen: string,
) {
  setParam(navigate, "screen", screen);
}

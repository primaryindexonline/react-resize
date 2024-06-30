import { useContext, createContext } from "react";
import { Resize } from "../resize";

const ResizeContext = createContext<Resize | undefined>(undefined);
export const ResizeProvider = ResizeContext.Provider;

export function useResize() {
  const res = useContext(ResizeContext);
  if (res === undefined) {
    throw Error(
      "It looks like you are using useTableStylesAPI outside of a DataExplorerTableStyleContext.Provider"
    );
  }
  return res;
}

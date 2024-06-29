import { useContext, createContext } from "react";
import { Reresize } from "./../reresize";

const ReresizeContext = createContext<Reresize | undefined>(undefined);
export const ReresizeProvider = ReresizeContext.Provider;

export function useReresize() {
  const res = useContext(ReresizeContext);
  if (res === undefined) {
    throw Error(
      "It looks like you are using useTableStylesAPI outside of a DataExplorerTableStyleContext.Provider"
    );
  }
  return res;
}

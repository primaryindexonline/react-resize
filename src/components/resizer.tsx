import { useEffect, useState, useCallback } from "react";

import { useReresize } from "../lib/hooks/useReresize";
import { DEFAULT_WIDTH } from "./const";

export default function Reresizer({ id }: { id: string }) {
  const reresize = useReresize();
  const [boxRef, setBoxRef] = useState<HTMLDivElement>();
  const [moverRef, setMoverRef] = useState<HTMLDivElement>();

  useEffect(() => {
    if (boxRef && moverRef) {
      const reresizeInstance = reresize.init(id, {
        handlerElement: moverRef,
        movingElement: boxRef,
      });

      reresizeInstance.addListener((newWidth) => {
        boxRef.style.width = `${newWidth}px`;
      });

      return () => {
        reresizeInstance.removeListeners();
      };
    }
  }, [boxRef, moverRef]);

  const setBoxRefCallback = useCallback((node: HTMLDivElement) => {
    setBoxRef(node);
  }, []);

  const setMoverRefCallback = useCallback((node: HTMLDivElement) => {
    setMoverRef(node);
  }, []);

  return (
    <div
      ref={setBoxRefCallback}
      style={{
        width: DEFAULT_WIDTH,
        height: 200,
        background: "#eee",
        position: "relative",
      }}
    >
      <div
        ref={setMoverRefCallback}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          cursor: "col-resize",
        }}
      >
        resize
      </div>
      Here goes the content
    </div>
  );
}

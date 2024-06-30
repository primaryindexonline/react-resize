import { useEffect, useState, useCallback } from "react";

import { useResize } from "../lib/hooks/useResize";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "./const";

export default function Reresizer({ id }: { id: string }) {
  const resizeInstance = useResize();
  const [boxRef, setBoxRef] = useState<HTMLDivElement>();
  const [moverRef, setMoverRef] = useState<HTMLDivElement>();

  useEffect(() => {
    if (boxRef && moverRef) {
      const mainConsumer = resizeInstance.create(id, {
        handlerElement: moverRef,
        movingElement: boxRef,
      });

      mainConsumer.addListener((newWidth, newHeight) => {
        boxRef.style.width = `${newWidth}px`;
        boxRef.style.height = `${newHeight}px`;
      });

      return () => {
        mainConsumer.removeListeners();
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
        height: DEFAULT_HEIGHT,
        background: "#eee",
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 5,
      }}
    >
      Here goes the content
      <div
        ref={setMoverRefCallback}
        style={{
          cursor: "col-resize",
          background: "pink",
        }}
      >
        <b>DRAG ME</b>
      </div>
    </div>
  );
}

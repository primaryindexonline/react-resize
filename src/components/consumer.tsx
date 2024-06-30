import { useEffect, useState, useCallback } from "react";

import { useResize } from "../lib/hooks/useResize";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "./const";

export default function Consumer({ index, id }: { index: number; id: string }) {
  const randomColor = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
  const resizeInstance = useResize();
  const [ref, setRef] = useState<HTMLDivElement>();

  const setRefCallback = useCallback((node: HTMLDivElement) => {
    setRef(node);
  }, []);

  useEffect(() => {
    if (ref) {
      resizeInstance.addListener(id, (newWidth, newHeight) => {
        ref.style.width = `${newWidth}px`;
        ref.style.height = `${newHeight}px`;
      });
    }
  }, [ref, id]);

  return (
    <div
      ref={setRefCallback}
      style={{
        background: randomColor,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
      }}
    >
      Consumer {index}
    </div>
  );
}

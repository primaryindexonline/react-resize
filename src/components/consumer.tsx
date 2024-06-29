import { useEffect, useState, useCallback } from "react";

import { useReresize } from "../lib/hooks/useReresize";
import { DEFAULT_WIDTH } from "./const";

export default function Consumer({ index, id }: { index: number; id: string }) {
  const randomColor = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
  const reresize = useReresize();
  const [ref, setRef] = useState<HTMLDivElement>();

  const setRefCallback = useCallback((node: HTMLDivElement) => {
    setRef(node);
  }, []);

  useEffect(() => {
    if (ref) {
      reresize.addListener(id, (newWidth) => {
        ref.style.width = `${newWidth}px`;
      });
    }
  }, [ref, id]);

  return (
    <div
      ref={setRefCallback}
      style={{ background: randomColor, width: DEFAULT_WIDTH }}
    >
      Consumer {index}
    </div>
  );
}

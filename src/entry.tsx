import { useMemo } from "react";
import { Resize, ResizeProvider } from "./lib";

import Resizer from "./components/resizer";
import Consumer from "./components/consumer";

const NUMBER_OF_CONSUMERS_PER_RESIZER = 10;
const resizerList = ["uno", "dos", "tres"];

export default function Entry() {
  const resizeInstance = useMemo(() => new Resize(), []);

  return (
    <ResizeProvider value={resizeInstance}>
      {resizerList.map((resizerId, index) => {
        return (
          <div key={index} style={{ marginBottom: 30 }}>
            <Resizer id={resizerId} />
            {Array.from(Array(NUMBER_OF_CONSUMERS_PER_RESIZER).keys()).map(
              (v, i) => {
                return <Consumer key={i} index={i} id={resizerId} />;
              }
            )}
          </div>
        );
      })}
    </ResizeProvider>
  );
}

import { useMemo } from "react";
import { Reresize, ReresizeProvider } from "./lib";

import Resizer from "./components/resizer";
import Consumer from "./components/consumer";

const NUMBER_OF_CONSUMERS_PER_RESIZER = 10;
const resizerList = ["uno", "dos", "tres"];

export default function Entry() {
  const reresize = useMemo(() => new Reresize(), []);

  return (
    <ReresizeProvider value={reresize}>
      {resizerList.map((resizerId) => {
        return (
          <>
            <Resizer id={resizerId} />
            {Array.from(Array(NUMBER_OF_CONSUMERS_PER_RESIZER).keys()).map(
              (v, i) => {
                return <Consumer key={i} index={i} id={resizerId} />;
              }
            )}
          </>
        );
      })}
    </ReresizeProvider>
  );
}

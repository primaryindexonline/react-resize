# Reresize

Change the width of the "moving" element('s) by holding and dragging the "hanger" element.

Library allows to:
1. create multiple resizing elements. Each `reresize` should be initialised with the unique `id`;
2. apply multiple listeners to each `reresize` so other parts of your app can subsribe to changes and reflect correspondingly. You would need to specify the `id` of the `reresize` object you want to add listener to.

When using with `React`, working with references, you don't need to have `state` to update your elements with the new `width`. This allows to have tons of consumers without worrying about performance issues.

https://github.com/primaryindexonline/reresize/assets/8969094/797df5e2-9e72-4a96-9b92-400c146ca3ed

### API

```
npm i @primaryindexonline/reresize
```

```ts
import { Reresize, ReresizeProvider, useReresize } from "@primaryindexonline/reresize";
```

1. `Reresize` — class where all the logic lives;
2. `ReresizeProvider` — wrapper for `React` if you want to apply multiple subsribers;
3. `useReresize` — hook to access `Reresize` instance once your app is wrapped with `ReresizeProvider`.

___

### Basic usage

```ts
import { Reresize } from "@primaryindexonline/reresize";

const reresizeInstance = new Reresize();

const movingElement = document.getElementById("movingElement");
const handlerElement = document.getElementById("hangerElement");

const reresizeDummy = reresizeInstance.init("dummy", {
  handlerElement,
  movingElement
});

reresizeDummy.addListener((newWidth) => {
  movingElement.style.width = `${newWidth}px`;
});
```

### Multiple subscribers

```ts
const reresizeInstance = new Reresize();

...

const reresizeDummy = reresizeInstance.init("dummy", {
  handlerElement,
  movingElement
});

// Anywhere else

reresizeInstance.addListener("dummy", (newWidth) => {
 // apply "newWidth"
})
```

### React (with multiple subscribers)

_You don't want to have state and rerenders when updating styles, otherwise you would risk to face perfornce issues rerendering DOM on every change.
you don't need to have state!_

`./app.tsx`
```ts
import { useMemo } from "react";
import { Reresize, ReresizeProvider } from "@primaryindexonline/reresize";

import MainConsumer from "./components/mainConsumer";
import OtherConsumer from "./components/otherConsumer";

export default function Entry() {
  const reresize = useMemo(() => new Reresize(), []);

  return (
    <ReresizeProvider value={reresize}>
      <MainConsumer />
      <OtherConsumer />
    </ReresizeProvider>
  );
}
```

`./components/mainConsumer.tsx`
```ts
import { useEffect, useState, useCallback } from "react";
import { useReresize } from "@primaryindexonline/reresize";

export default function MainConsumer() {
  const reresize = useReresize();

  const [handlerElement, setHandlerElement] = useState<HTMLDivElement>();
  const [movingElement, setMovingElement] = useState<HTMLDivElement>();

  useEffect(() => {
    if (handlerElement && movingElement) {
      const reresizeDummy = reresize.init("dummy", {
        handlerElement,
        movingElement
      });

      reresizeDummy.addListener((newWidth) => {
        movingElement.style.width = `${newWidth}px`;
      });

      return () => {
        reresizeDummy.removeListeners();
      };
    }
  }, [handlerElement, movingElement]);

  const setHandlerElementCallback = useCallback((node: HTMLDivElement) => {
    setHandlerElement(node);
  }, []);

  const setMovingElementCallback = useCallback((node: HTMLDivElement) => {
    setMovingElement(node);
  }, []);

  return (
    <div
      ref={setMovingElementCallback}
      style={{
        width: 200,
        height: 200,
        background: "#eee",
        position: "relative",
      }}
    >
      <div
        ref={setHandlerElementCallback}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          cursor: "col-resize",
        }}
      >
        resize
      </div>
    </div>
  );
}

```

`./components/otherConsumer.tsx`
```ts
import { useEffect, useState, useCallback } from "react";

import { useReresize } from "@primaryindexonline/reresize";

export default function OtherConsumer() {
  const reresize = useReresize();

  const [movingElement, setMovingElement] = useState<HTMLDivElement>();

  const setMovingElementCallback = useCallback((node: HTMLDivElement) => {
    setMovingElement(node);
  }, []);

  useEffect(() => {
    if (movingElement) {
      reresize.addListener("dummy", (newWidth) => {
        movingElement.style.width = `${newWidth}px`;
      });
    }
  }, [movingElement]);

  return (
    <div
      ref={setMovingElementCallback}
      style={{ background: "red", width: 200 }}
    >
      Other Consumer
    </div>
  );
}
```

## Example

Either check `src/entry.tsx` and `src/components` folder or:
1. clone the repo;
2. `npm i`;
3. `npm run dev` to start local server with example.

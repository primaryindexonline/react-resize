# react-resize

Change the width and height of the "moving" element('s) by holding and dragging the "hanger" element.

Library allows to:

1. create multiple resizing elements. Each `resize` should be created with the unique `id`;
2. apply multiple listeners to each `resize` so other parts of your app can subsribe to changes and reflect correspondingly. You would need to specify the `id` of the `resize` object you want to add listener to.

When using with `React`, working with references, you don't need to have `state` to update your elements with the new `width` or `height`. This allows to have tons of consumers without worrying about performance issues.

https://github.com/primaryindexonline/resize/assets/8969094/797df5e2-9e72-4a96-9b92-400c146ca3ed

### API

```
npm i @primaryindexonline/react-resize
```

```ts
import {
  Resize,
  ResizeProvider,
  useResize,
} from "@primaryindexonline/react-resize";
```

1. `Resize` — class where all the logic lives;
2. `ResizeProvider` — wrapper for `React` if you want to apply multiple subsribers;
3. `useResize` — hook to access `Resize` instance once your app is wrapped with `ResizeProvider`.

---

### Basic usage

```ts
import { Resize } from "@primaryindexonline/react-resize";

const resizeInstance = new Resize();

const movingElement = document.getElementById("movingElement");
const handlerElement = document.getElementById("hangerElement");

const resizeDummy = resizeInstance.create("dummy", {
  handlerElement,
  movingElement,
});

resizeDummy.addListener((newWidth) => {
  movingElement.style.width = `${newWidth}px`;
});
```

### Multiple subscribers

```ts
const resizeInstance = new Resize();

...

const resizeDummy = resizeInstance.create("dummy", {
  handlerElement,
  movingElement
});

// Anywhere else

resizeInstance.addListener("dummy", (newWidth) => {
 // apply "newWidth"
})
```

### React (with multiple subscribers)

_You don't want to have state and rerenders when updating styles, otherwise you would risk to face perfornce issues rerendering DOM on every change.
you don't need to have state!_

`./app.tsx`

```ts
import { useMemo } from "react";
import { Resize, ResizeProvider } from "@primaryindexonline/react-resize";

import MainConsumer from "./components/mainConsumer";
import OtherConsumer from "./components/otherConsumer";

export default function Entry() {
  const resize = useMemo(() => new Resize(), []);

  return (
    <ResizeProvider value={resize}>
      <MainConsumer />
      <OtherConsumer />
    </ResizeProvider>
  );
}
```

`./components/mainConsumer.tsx`

```ts
import { useEffect, useState, useCallback } from "react";
import { useResize } from "@primaryindexonline/react-resize";

export default function MainConsumer() {
  const resize = useResize();

  const [handlerElement, setHandlerElement] = useState<HTMLDivElement>();
  const [movingElement, setMovingElement] = useState<HTMLDivElement>();

  useEffect(() => {
    if (handlerElement && movingElement) {
      const resizeDummy = resize.create("dummy", {
        handlerElement,
        movingElement
      });

      resizeDummy.addListener((newWidth) => {
        movingElement.style.width = `${newWidth}px`;
      });

      return () => {
        resizeDummy.removeListeners();
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

import { useResize } from "@primaryindexonline/react-resize";

export default function OtherConsumer() {
  const resize = useResize();

  const [movingElement, setMovingElement] = useState<HTMLDivElement>();

  const setMovingElementCallback = useCallback((node: HTMLDivElement) => {
    setMovingElement(node);
  }, []);

  useEffect(() => {
    if (movingElement) {
      resize.addListener("dummy", (newWidth) => {
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

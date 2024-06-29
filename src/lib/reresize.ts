type ListenerCallback = (newWidth: number) => unknown;

type Options = {
  movingElement: HTMLElement;
  handlerElement: HTMLElement;
};

export class Reresize {
  listeners: Record<string, Array<ListenerCallback>> = {};

  private getListeners = (id: string) => {
    return this.listeners[id] || [];
  };

  addListener = (id: string, callback: ListenerCallback) => {
    const existingListeners = this.getListeners(id);

    this.listeners = {
      ...this.listeners,
      [id]: [...existingListeners, callback],
    };
  };

  private removeListeners = (id: string) => {
    delete this.listeners[id];
  };

  init = (id: string, { movingElement, handlerElement }: Options) => {
    let startingMovingPosition: number;
    let startingBoxWidth: number;
    let existingListeners: (typeof this.listeners)[string] = [];

    const onMouseDown = (mousedownEvent: MouseEvent) => {
      existingListeners = this.getListeners(id);

      if (existingListeners.length === 0) {
        throw new Error(`No listeners have been defined for "${id}" resizer`);
      }

      startingMovingPosition = mousedownEvent.pageX;
      startingBoxWidth = movingElement.getBoundingClientRect().width;

      mousedownEvent.preventDefault();

      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResize, { once: true });
    };

    const resize = (mousemoveEvent: MouseEvent) => {
      const offsetX = mousemoveEvent.pageX - startingMovingPosition;
      const newWidth = startingBoxWidth + offsetX;

      existingListeners.forEach((listenerCallback) => {
        listenerCallback(newWidth);
      });
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mousedown", onMouseDown);
    };

    handlerElement.addEventListener("mousedown", onMouseDown);

    return {
      addListener: (callback: ListenerCallback) =>
        this.addListener(id, callback),
      removeListeners: () => this.removeListeners(id),
    };
  };
}

type ListenerCallback = (newWidth: number, newHeight: number) => unknown;

type Options = {
  movingElement: HTMLElement;
  handlerElement: HTMLElement;
};

export class Resize {
  private listeners: Record<string, Array<ListenerCallback>> = {};

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

  create = (id: string, { movingElement, handlerElement }: Options) => {
    let startingMovingPositionX: number;
    let startingMovingPositionY: number;
    let startingBoxWidth: number;
    let startingBoxHeight: number;
    let existingListeners: (typeof this.listeners)[string] = [];

    const onMouseDown = (mousedownEvent: MouseEvent) => {
      existingListeners = this.getListeners(id);

      if (existingListeners.length === 0) {
        console.error(`No listeners have been defined for "${id}" resizer`);
      }

      startingMovingPositionX = mousedownEvent.pageX;
      startingBoxWidth = movingElement.getBoundingClientRect().width;

      startingMovingPositionY = mousedownEvent.pageY;
      startingBoxHeight = movingElement.getBoundingClientRect().height;

      mousedownEvent.preventDefault();

      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResize, { once: true });
    };

    const resize = (mousemoveEvent: MouseEvent) => {
      const offsetX = mousemoveEvent.pageX - startingMovingPositionX;
      const newWidth = startingBoxWidth + offsetX;

      const offsetY = mousemoveEvent.pageY - startingMovingPositionY;
      const newHeight = startingBoxHeight + offsetY;

      existingListeners.forEach((listenerCallback) => {
        listenerCallback(newWidth, newHeight);
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

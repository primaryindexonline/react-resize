/**
 * @jest-environment jsdom
 */

import { Resize } from "./resize";

describe("Reressize", () => {
  it("changes the width of the movingElement", () => {
    const resize = new Resize();
    console.error = jest.fn();

    const movingElement = document.createElement("div");
    jest
      .spyOn(movingElement, "getBoundingClientRect")
      .mockImplementation(() => {
        return { width: 200 } as DOMRect;
      });

    const handlerElement = document.createElement("div");

    const dummyReresize = resize.create("dummy", {
      movingElement,
      handlerElement,
    });

    dummyReresize.addListener((newWidth) => {
      movingElement.style.width = `${newWidth}px`;
    });

    const mouseDownEvent = new Event("mousedown") as MouseEvent as {
      pageX: number;
    };
    mouseDownEvent.pageX = 0;

    handlerElement.dispatchEvent(mouseDownEvent as MouseEvent);

    const mouseMoveEvent = new Event("mousemove") as MouseEvent as {
      pageX: number;
    };
    mouseMoveEvent.pageX = 1;

    window.dispatchEvent(mouseMoveEvent as MouseEvent);

    expect(movingElement.style.width).toBe("201px");
  });

  it("prints error message in the console", () => {
    const resize = new Resize();
    console.error = jest.fn();

    const movingElement = document.createElement("div");
    const handlerElement = document.createElement("div");

    resize.create("dummy", {
      movingElement,
      handlerElement,
    });

    const mouseDownEvent = new Event("mousedown");

    handlerElement.dispatchEvent(mouseDownEvent);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'No listeners have been defined for "dummy" resizer'
    );
  });
});

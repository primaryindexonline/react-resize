import React from "react";
import { createRoot } from "react-dom/client";
import Entry from "./src/entry";

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<Entry />);

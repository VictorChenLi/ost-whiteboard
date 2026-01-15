import React from "react";
import ReactDOM from "react-dom/client";
import OSTWhiteboardApp from "./OSTWhiteboardApp";
import { setupDebugExport } from "./utils/debug";
import "./index.css";

// Setup debug logging utilities
setupDebugExport();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OSTWhiteboardApp />
  </React.StrictMode>
);

import {createRoot} from "react-dom/client";
import React from "react";
import BoardGame from "./components/BoardGame";
import "./App.css";
import "./BoardGame.css";
import {MetadataContextProvider} from "@skedwards88/shared-components/src/components/MetadataContextProvider";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <MetadataContextProvider>
      <BoardGame />
    </MetadataContextProvider>
  </React.StrictMode>,
);

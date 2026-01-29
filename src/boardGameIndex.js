import {createRoot} from "react-dom/client";
import React from "react";
import BoardGame from "./components/BoardGame";
import "./App.css";
import "./BoardGame.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<BoardGame />);

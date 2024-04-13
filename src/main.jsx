import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { GameProvider } from "./context/gameContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ContextProvider } from "./context/Context-api";
import { SocketProvider  } from "./context/Socket"
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <SocketProvider>
      <App />
      </SocketProvider>
    </ContextProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import Router from "@/routes/router";
import "@/css/index.css";
import "@/css/app.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);

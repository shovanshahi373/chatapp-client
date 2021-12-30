import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App/App";
import AuthContext from "./contexts/auth";

ReactDOM.render(
  <React.StrictMode>
    <AuthContext>
      <App />
    </AuthContext>
  </React.StrictMode>,
  document.getElementById("root")
);

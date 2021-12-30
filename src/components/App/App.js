import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../Home";
import Login from "../Login";
import AuthRoute from "../Auth";
import React from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<Login />} />
        {/* <Route path={"/home"} element={<Home />} /> */}
        <Route
          path={"/home"}
          element={
            <AuthRoute>
              <Home />
            </AuthRoute>
          }
        />
        <Route path={"*"} element={<p>404 not found...</p>} />
      </Routes>
    </Router>
  );
}

export default App;

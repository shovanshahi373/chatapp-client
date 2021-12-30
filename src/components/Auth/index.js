import React from "react";
import { GetContext } from "../../contexts/auth";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const { auth } = GetContext();
  return auth.loading === true
    ? null
    : !auth.user || !auth.user.name
    ? // <Navigate to={"/"} />
      null
    : children;
};

export default AuthRoute;

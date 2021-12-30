import React from "react";

import { GetContext } from "../contexts/auth";

const withAuth = (Component) => (props) => {
  const context = GetContext();
  return <Component {...props} {...context} />;
};

export default withAuth;

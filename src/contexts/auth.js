import React, { createContext, useContext, useState, useEffect } from "react";

import useStorage from "../hooks/useStorage";
import service from "../services/user";
import { isExpired, decodeToken } from "react-jwt";

const AuthContext = createContext();

const Auth = ({ children }) => {
  const [token, setToken, destroyToken] = useStorage("EX_TOKEN", null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const login = async (data, onsuccess = () => null, onerror = () => null) => {
    const { username, password } = data;
    console.log({ username, password, onsuccess, onerror });
    try {
      setLoading(true);
      const { token } = await service.login(username, password);
      if (token) {
        setToken(token);
      } else {
        throw new Error("something went wrong!");
      }
      onsuccess();
    } catch (err) {
      onerror(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    destroyToken();
    window.location.href = "/";
  };

  useEffect(() => {
    console.log({ token });
    if (token) {
      setLoading(true);
      const decodedToken = decodeToken(token);
      const isMyTokenExpired = isExpired(token);
      if (decodedToken && !isMyTokenExpired) {
        const { name } = decodedToken;
        setUser({ name, token });
        if (window.location.pathname === "/") {
          window.location.href = "/home";
        }
      } else {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        auth: {
          user,
          loading,
          login,
          logout,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const GetContext = () => useContext(AuthContext);

export default Auth;

import { createContext, useEffect, useState, useMemo } from "react";
// import { io } from "socket.io-client";

export const ThemeContext = createContext();

export const ContextProvider = (props) => {
  const storedUser = useMemo(() => {
    return JSON.parse(localStorage.getItem("user"));
  }, []);

  const [user, setuser] = useState(
    storedUser || {
      Name: "",
      FullName: "",
      Email: "",
      Token: "",
      id: "",
    }
  );

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const getInitialMode = () => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode) return savedMode;
    const systemPreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return systemPreference ? "dark" : "light";
  };

  const [mode, setMode] = useState({
    modetheme: getInitialMode(),
    lcolor: "#1ac472",
    dcolor: "#1ac4a2",
    ltext: "#0c0c0d",
    dtext: "#ebebf0",
  });

  useEffect(() => {
    localStorage.setItem("mode", mode.modetheme);
  }, [mode.modetheme]);

  // const socket = useMemo(() => io('http://localhost:9000'), []);

  // useEffect(() => {
  //   return () => {
  //     socket.disconnect(); // Cleanup socket connection on unmount
  //   };
  // }, [socket]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        user,
        setuser,
        // socket,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

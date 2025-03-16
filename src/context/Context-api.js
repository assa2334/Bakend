import { createContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";

export const ThemeContext = createContext();

export const ContextProvider = (props) => {
 

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
    lcolor: "#273ea8",
    dcolor: "#27a849",
    ltext: "#27a849",
    dtext: "#ffffff",
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
        // socket,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

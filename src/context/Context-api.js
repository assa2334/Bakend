import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useMemo } from "react";

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

  function storedUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user; 
  }
 
  


  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

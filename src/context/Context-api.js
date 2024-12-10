import { createContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";

// Create Theme Context
export const ThemeContext = createContext();

export const ContextProvider = (props) => {
  const [user, setuser] = useState({
    Name: "",
    FullName: "",
    Email: "",
    Password: "",
    Token: "",
  });
  console.log(user);
  
  // theme code
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
    lcolor: "#33da65",
    dcolor: "#33da65",
    ltext: "#0c0c0d",
    dtext: "#ebebf0",
  });

  useEffect(() => {
    localStorage.setItem("mode", mode.modetheme);
  }, [mode.modetheme]);

  //socket io
  //   const socket = useRef();
  //   useEffect(()=>{
  //     socket.current = io('http://localhost:3000')
  //   },[])

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        user,
        setuser,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

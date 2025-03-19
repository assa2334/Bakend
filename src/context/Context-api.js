import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useMemo } from "react";
import Peer from "peerjs";
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
  
  const socket = useMemo(() => io('http://192.168.0.102:9000', {
    query: { userId: storedUser().id } // Pass userId when connecting
  }), []);

  useEffect(() => {
    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
      socket.emit('userDisconnected', { userId:storedUser().id });
    });
    return () => {
      socket.disconnect(); 
    };
  }, [socket]);
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState("");

  useEffect(() => {
    const newPeer = new Peer(); // Create a new Peer instance
    newPeer.on("open", (id) => {
      setPeerId(id);
      socket.emit("peerId", { userId: storedUser().id, peerId: id }); // Send peer ID to backend
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy(); // Cleanup peer instance on unmount
    };
  }, []);


  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        socket, peer, peerId
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

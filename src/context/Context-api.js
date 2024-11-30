import { createContext, useEffect, useState } from 'react';

// Create Theme Context
export const ThemeContext = createContext();

export const ContextProvider = (props) => {
 const getInitialMode = () => {
  const savedMode = localStorage.getItem('mode');
  if (savedMode) return savedMode;
  const systemPreference = window.matchMedia(
   '(prefers-color-scheme: dark)',
  ).matches;
  return systemPreference ? 'dark' : 'light';
 };
 const [mode, setMode] = useState({
  modetheme: getInitialMode(),
  lcolor: '#33da65',
  dcolor: '#33da65',
  ltext: '#0c0c0d',
  dtext: '#ebebf0',
 });

 useEffect(() => {
  localStorage.setItem('mode', mode.modetheme);
 }, [mode.modetheme]);

 return (
  <ThemeContext.Provider value={{ mode, setMode }}>
   {props.children}
  </ThemeContext.Provider>
 );
};

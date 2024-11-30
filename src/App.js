import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './assets/light-theme';
import { useContext } from 'react';
import { ThemeContext } from './context/Context-api';
import Mian from './layout/main';

function App() {
 const { mode } = useContext(ThemeContext); // Retrieve mode object from ThemeContext
 const theme = getTheme(mode); // Pass mode directly to getTheme

 console.log(mode.modetheme); // Log the current theme mode ('light' or 'dark')

 return (
  <ThemeProvider theme={theme}>
   <CssBaseline />
   {/* <Rightbar /> */}
   <Mian />
  </ThemeProvider>
 );
}

export default App;

import { createTheme } from '@mui/material';

// Create the MUI theme
export const getTheme = (value) =>
 createTheme({
  palette: {
   mode: value.modetheme, // Use value.modetheme for dynamic theme mode
   primary: {
    main: value.modetheme === 'light' ? value.lcolor : value.dcolor,
    light: value.modetheme === 'light' ? value.lcolor : value.dcolor,
    dark: value.modetheme === 'dark' ? value.dcolor : value.lcolor,
   },
   secondary : {
    main: value.modetheme === 'light' ? value.dcolor : value.lcolor,
    light: value.modetheme === 'light' ? value.dcolor : value.lcolor,
    dark: value.modetheme === 'dark' ? value.lcolor : value.dcolor,
   },

   background: {
    default: value.modetheme === 'dark' ? '#121212' : '#f5f5f5', // Use value.modetheme
    paper: value.modetheme === 'dark' ? '#1e1e1e' : '#ffffff', // Use value.modetheme
   },
   text: {
    primary: value.modetheme === 'dark' ? value.dtext : value.ltext, // Use value.modetheme
   },
  },
 });

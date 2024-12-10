import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./assets/light-theme";
import { useContext } from "react";
import { ThemeContext } from "./context/Context-api";
// import SingUp from "./accountpage/singup";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Login from "./accountpage/login";
// import Mian from "./layout/main";

function App() {
  const { mode } = useContext(ThemeContext); 
  const theme = getTheme(mode); 

  console.log(mode.modetheme); 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <Rightbar /> */}
      {/* <Mian /> */}
    <GoogleOAuthProvider clientId="680459185774-ti8r4brbplofhgfv000s3oup3ecccrc9.apps.googleusercontent.com" >
      {/* <SingUp /> */}
      <Login/>
    </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;

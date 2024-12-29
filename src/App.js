import React from "react";
//mui imports
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./assets/light-theme";
//context imports
import { useContext } from "react";
import { ThemeContext } from "./context/Context-api";
//components imports
import SingUp from "./accountpage/singup";
import Login from "./accountpage/login";
import Mian from "./layout/main";
//react-oauth imports
import { GoogleOAuthProvider } from '@react-oauth/google';
//react-router imports
import { RouterProvider, createBrowserRouter } from "react-router-dom";

function App() {
  const { mode } = useContext(ThemeContext); 
  const theme = getTheme(mode); 

  console.log(mode.modetheme); 

  // Correctly define the routes as an array
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Mian />,
    },
    {
      path: "/singup",
      element: <SingUp/>,
    },
    {
      path: "/login",
      element: <Login/>,
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleOAuthProvider clientId="680459185774-ti8r4brbplofhgfv000s3oup3ecccrc9.apps.googleusercontent.com">
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;

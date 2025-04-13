import React, { useState, useEffect, useContext } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./assets/light-theme";
import { ThemeContext } from "./context/Context-api";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CallNotification from "./example/Notification";
import io from 'socket.io-client'; // Added missing import

import SingUp from "./accountpage/singup";
import Login from "./accountpage/login";
import Mian from "./layout/main";
import Admin from "./layout/admin/index";
import Voice from "./example/call/voice/index"
import Video from "./example/call/video/index"

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
  {
    path: "/admin",
    element: <Admin/>,
  },
  {
    path:"/Voice/:sender/:receiver",
    element: <Voice/>,
  },
  {
    path:"/Video/:sender/:receiver",
    element: <Video/>,
  },
]);


// ... (your existing imports and router config)

function App() {
  const { mode } = useContext(ThemeContext);
  const theme = getTheme(mode);
  const [incomingCall, setIncomingCall] = useState(null);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.id) return;

    const newSocket = io('https://vfb6vjc3-9000.euw.devtunnels.ms/', {
      query: { userId: storedUser.id }
    });
    setSocket(newSocket);

    newSocket.on("incomingCall", (data) => {
      setIncomingCall(data);
      setShowCallDialog(true);
    });

    return () => {
      newSocket.off("incomingCall");
      newSocket.disconnect();
    };
  }, []);

  const handleAcceptCall = () => {
    if (!incomingCall || !socket) return;
    
    // Send acceptance to caller
    socket.emit("callAnswer", {
      callId: incomingCall.callId,
      answer: true,
      receiverId: incomingCall.user.id
    });

    // Navigate to the call page
    window.location.href = incomingCall.type === 'video' 
      ? `/Video/${incomingCall.user.id}/${incomingCall.user.id}` 
      : `/Voice/${incomingCall.user.id}/${incomingCall.user.id}`;
    
    setShowCallDialog(false);
  };

  const handleRejectCall = () => {
    if (socket && incomingCall) {
      socket.emit("callAnswer", {
        callId: incomingCall.callId,
        answer: false,
        receiverId: incomingCall.user.id
      });
    }
    setShowCallDialog(false);
    setIncomingCall(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleOAuthProvider clientId="your-client-id">
        <RouterProvider router={router} />
        <CallNotification
          open={showCallDialog}
          caller={incomingCall?.user}
          callType={incomingCall?.type}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;

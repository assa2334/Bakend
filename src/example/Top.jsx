//mui Component
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
//icon
import VideoChatOutlinedIcon from "@mui/icons-material/VideoChatOutlined";
import CallIcon from "@mui/icons-material/Call";

export default function Top({name,img,id}) {
  console.log("id",id);
  let callWindow = null;
  return (
    <>
      <Box
        sx={{
          bgcolor: "background.default",
          borderLeft: 2,
          borderColor: "divider",
        }}
      >
        {/* Header Section */}
        <Paper
          elevation={7}
          sx={{
            borderRadius: 0,
            padding: 2,
            display: "flex",
            boxSizing: "border-box",
            marginBottom: 2,
          }}
        >
          {/* Left Section: Avatar and Name */}
          <Box
            sx={{
              display: "flex",
              boxSizing: "border-box",
              justifyContent: "start",
              width: "50%",
              gap: "30px",
              alignItems: "center",
            }}
          >
            <Avatar
              alt={name}
              src={img}
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "text.primary",
                cursor: "pointer",
                transition: "background-color 0.3s ease, color 0.3s ease",
                padding: "4px 8px",
                borderRadius: "4px",
                "&:hover": {
                  bgcolor: "action.hover",
                  color: "primary.main",
                },
              }}
            >
              {name}
            </Typography>
          </Box>

          {/* Right Section: Buttons */}
          <Box
            sx={{
              display: "flex",
              boxSizing: "border-box",
              justifyContent: "end",
              width: "50%",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <Tooltip title={"Video Call"}>
              <IconButton
              onClick={() => {
                if (callWindow && !callWindow.closed) {
                  callWindow.focus(); // Bring existing window to front
                  return;
                }
                const senderId = JSON.parse(localStorage.getItem('user')).id;
                const url = `/Video/${senderId}/${id._id}`;
            
                // Get screen width & height
                const screenWidth = window.screen.width;
                const screenHeight = window.screen.height;
            
                // Define the window size
                const width = 800;
                const height = 600;
            
                // Calculate center position
                const left = (screenWidth - width) / 2;
                const top = (screenHeight - height) / 2;
            
                // Open window in the center
                window.open(url, "_blank", `width=${width},height=${height},left=${left},top=${top}`);
              }}
                sx={{
                  bgcolor: "action.hover",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    bgcolor: "primary.light",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <VideoChatOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={"Call"}>
              <IconButton
               onClick={() => {
                if (callWindow && !callWindow.closed) {
                  callWindow.focus(); // Bring existing window to front
                  return;
                }
                const senderId = JSON.parse(localStorage.getItem('user')).id;
                const url = `/Voice/${senderId}/${id._id}`;
            
                // Get screen width & height
                const screenWidth = window.screen.width;
                const screenHeight = window.screen.height;
            
                // Define the window size
                const width = 800;
                const height = 600;
            
                // Calculate center position
                const left = (screenWidth - width) / 2;
                const top = (screenHeight - height) / 2;
            
                // Open window in the center
                window.open(url, "_blank", `width=${width},height=${height},left=${left},top=${top}`);
              }}
                sx={{
                  bgcolor: "action.hover",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    bgcolor: "primary.light",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <CallIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

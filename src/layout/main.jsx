// Icons
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// MUI Components
import { Box, Tooltip } from "@mui/material";

// Example Component
import { Rightbar } from "../example/Rightbar";
import Message from "./Message/Message";
import Call from "./Call";
import Status from "./Status";
import { useState } from "react";

// React Router
import { useNavigate } from "react-router-dom"; 

// Reusable Sidebar Component
const Sidebar = ({ topIcons, bottomIcons }) => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        width: "40px", // Set width for the sidebar
        height: "100vh",
        borderLeft: 2,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column", // Stack icons vertically
        justifyContent: "space-between", // Push top icons to the top, bottom icons to the bottom
        alignItems: "center",
        py: 2,
      }}
    >
      {/* Top Icons Section */}
      <Box>
        {topIcons.map(({ icon: Icon, label, onClick }, index) => (
          <Tooltip key={index} title={label} placement="right">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 48,
                height: 48,
                borderRadius: "50%",
                cursor: "pointer",
                mb: 2, // Margin for spacing between icons
                "&:hover": {
                  bgcolor: "primary.light",
                },
              }}
              onClick={onClick}
            >
              <Icon fontSize="medium" />
            </Box>
          </Tooltip>
        ))}
      </Box>

      {/* Bottom Icons Section */}
      <Box>
        {bottomIcons.map(({ icon: Icon, label, onClick }, index) => (
          <Tooltip key={index} title={label} placement="right">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 48,
                height: 48,
                borderRadius: "50%",
                cursor: "pointer",
                mb: 2, // Margin for spacing between icons
                "&:hover": {
                  bgcolor: "primary.light",
                },
              }}
              onClick={onClick}
            >
              <Icon fontSize="medium" />
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

// Main Component
export default function Main() {

  const nagivate = useNavigate();
  if (!localStorage.getItem("user")) {
    nagivate("/singup");
  }

  // const theme = useTheme();
  const [page, setpage] = useState({
    value: "Message",
  });
  // Click handlers for each icon
  const handleProfileClick = () => alert("Profile clicked!");
  const handleRightbarClick = () => {};
  const handleRadioClick = () => {
    setpage({ value: "Status" });
  };
  const handlePhoneClick = () => {
    setpage({ value: "Call" });
  };
  const handleMessagesClick = () => {
    setpage({ value: "Message" });
  };

  // Sidebar icons with click handlers
  const topIcons = [
    {
      icon: MessageOutlinedIcon,
      label: "Messages",
      onClick: handleMessagesClick,
    },
    { icon: PhoneOutlinedIcon, label: "Phone", onClick: handlePhoneClick },
    {
      icon: RadioButtonCheckedIcon,
      label: "Status",
      onClick: handleRadioClick,
    },
  ];

  const bottomIcons = [
    { icon: Rightbar, label: "Rightbar", onClick: handleRightbarClick },
    { icon: AccountCircleIcon, label: "Profile", onClick: handleProfileClick },
  ];

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "lightseagreen",
        display: "flex",
        overflow: "auto",
      }}
    >
      {/* Sidebar */}
      <Sidebar topIcons={topIcons} bottomIcons={bottomIcons} />

      {/* Main Content Area */}
      <Box
        sx={{
          bgcolor: "background.default",
          width: "100%",
          height: "100vh",
          borderLeft: 2,
          borderColor: "divider",
        }}
      >
        {page.value === "Message" ? <Message /> : ""}
        {page.value === "Call" ? <Call /> : ""}
        {page.value === "Status" ? <Status /> : ""}
        {/*  */}
        {/* */}

        {/* Additional content goes here */}
      </Box>
    </Box>
  );
}

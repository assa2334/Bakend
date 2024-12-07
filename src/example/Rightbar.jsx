import React, { useState } from "react";
import Box from "@mui/material/Box";
// button
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
//side bar
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import { Stack, Typography } from "@mui/material";
//icon
import SettingsIcon from "@mui/icons-material/Settings";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
//dak mode
import { useContext } from "react";
import { ThemeContext } from "../context/Context-api";

export function Rightbar() {
  const { setMode } = useContext(ThemeContext);

  const [state, setState] = useState({ right: false });
  const [rotate, setRotate] = useState(false); // State to control rotation

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
    setRotate(open); // Trigger rotation on open/close
  };
  function Switcher(params) {
    return (
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          cursor: "pointer",
        }}
        onClick={() => {
          setMode((prevMode) => ({
            ...prevMode,
            lcolor: params.one,
            dcolor: params.two,
            ltext: params.three,
            dtext: params.four,
          }));
        }}
      >
        <div
          style={{
            width: "1rem",
            height: "1rem",
            borderRadius: "50%",
            backgroundColor: `${params.one}`,
          }}
        ></div>
        <div
          style={{
            width: "1rem",
            height: "1rem",
            borderRadius: "50%",
            backgroundColor: `${params.two}`,
          }}
        ></div>
        <div
          style={{
            width: "1rem",
            height: "1rem",
            borderRadius: "50%",
            backgroundColor: `${params.three}`,
          }}
        ></div>
        <div
          style={{
            width: "1rem",
            height: "1rem",
            borderRadius: "50%",
            backgroundColor: `${params.four}`,
          }}
        ></div>
      </Stack>
    );
  }
  //  function background(params) {
  //      return (
  //          <Box
  //          sx={{
  //              width: 100,
  //              height: 100,
  //      backgroundImage: `url("${params}")`,
  //      backgroundPosition: 'center, center',
  //      backgroundSize: ' cover',
  //      margin: '10px',
  //      borderRadius: '2px',
  //      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.6)',
  //      transition: 'box-shadow 0.3s ease, transform 0.3s ease', // Smooth transition
  //      '&:hover': {
  //       transform: 'scale(1.05)', // Slight zoom effect
  //       boxShadow: '0px 2px 15px rgb(0, 115, 230)',
  //       border: '1px solid rgb(72, 124, 176)',
  //      },
  //     }}
  //    ></Box>
  //   );
  //  }

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 350 }}
      padding={1}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Typography
        variant="h1"
        sx={{ color: "text.primary", fontSize: "50px", textAlign: "center" }}
      >
        Setting
      </Typography>
      <Divider />
      <Typography mt={2} component="legend">
        Mode
      </Typography>

      <ButtonGroup variant="outlined">
        <Button
          onClick={() => {
            localStorage.setItem("mode", "light");
            setMode((prevMode) => ({ ...prevMode, modetheme: "light" }));
          }}
        >
          <Typography
            variant="p"
            sx={{
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem", // Add space between icon and text
            }}
          >
            {" "}
            <LightModeIcon /> Light
          </Typography>
        </Button>
        <Button
          onClick={() => {
            localStorage.removeItem("mode");
            const systemPreference = window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches;
            setMode((prevMode) => ({
              ...prevMode,
              modetheme: systemPreference ? "dark" : "light",
            }));
          }}
        >
          {" "}
          <Typography
            variant="p"
            sx={{
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem", // Add space between icon and text
            }}
          >
            <SettingsSystemDaydreamOutlinedIcon />
            System
          </Typography>
        </Button>
        <Button
          onClick={() => {
            localStorage.setItem("mode", "dark");
            setMode((prevMode) => ({ ...prevMode, modetheme: "dark" }));
          }}
        >
          <Typography
            variant="p"
            sx={{
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem", // Add space between icon and text
            }}
          >
            <DarkModeOutlinedIcon /> Dark
          </Typography>
        </Button>
      </ButtonGroup>

      <Typography mt={2} component="legend">
        Theme
      </Typography>
      <Stack
        direction="row"
        m={2}
        sx={{ flexWrap: "wrap", justifyContent: "center", gap: 2 }}
      >
        {Switcher({
          one: "#33da65",
          two: "#33da65",
          three: "#0c0c0d",
          four: "#ebebf0",
        })}
        {Switcher({
          one: "#03a9f4",
          two: "#00a152",
          three: "#0c0c0d",
          four: "#ebebf0",
        })}
        {Switcher({
          one: "#00a152",
          two: "#03a9f4",
          three: "#0c0c0d",
          four: "#ebebf0",
        })}
        {Switcher({
          one: "#3633da",
          two: "#da3333",
          three: "#0c0c0d",
          four: "#ebebf0",
        })}
      </Stack>
      <Typography mt={2} component="legend">
        Background Image
      </Typography>
      <Stack
        direction="row"
        sx={{
          flexWrap: "wrap", // Ensures that items wrap
        }}
      >
        {/* {background('/Screenshot 2024-11-01 061355.png')} */}
      </Stack>
    </Box>
  );

  return (
    <div>
      <Button
        onClick={toggleDrawer("right", true)}
        disableRipple
        disableFocusRipple
        sx={{
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
          },
          "&:active": {
            backgroundColor: "transparent", // Prevent background change on click
          },
        }}
      >
        <Typography variant="div" color="text.primary">
          <SettingsIcon
            sx={{
              fontSize: "20px",
              transition: "transform 0.5s ease",
              transform: rotate ? "rotate(60deg)" : "rotate(0deg)",
            }}
          />
        </Typography>
      </Button>
      <Drawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        {list("right")}
      </Drawer>
    </div>
  );
}

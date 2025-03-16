import { Box } from "@mui/material";
import Naneside from "../Message/NameSide";
import CallSide from "./CallSide";
import {  useNavigate } from "react-router-dom";
export default function Call(params) {
  
  const user = JSON.parse(localStorage.getItem('user'));
  const nagivate = useNavigate();
  if (!user || user.isverify === false) {  
    nagivate("/singup");
  }
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "lightseagreen",
          display: "flex",
          overflow: "auto",
        }}
      >
        <Naneside name={"Call"} />
        <CallSide />
      </Box>
    </>
  );
}

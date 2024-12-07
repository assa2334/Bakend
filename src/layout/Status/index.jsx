import { Box } from "@mui/material";
import Naneside from "../Message/NameSide";
import VideoSide from "./VideoSide";

export default function Status(params) {
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
        <Naneside name={"Status"} />
        <VideoSide />
      </Box>
    </>
  );
}

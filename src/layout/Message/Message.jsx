import { Box } from "@mui/material";
import Naneside from "./NameSide";
import MesageSide from "./Messageside";

export default function Message() {
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
        <Naneside name={"Chats"} />
        <MesageSide />
      </Box>
    </>
  );
}

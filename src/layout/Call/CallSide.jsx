import { Box } from "@mui/material";
import Top from "../../example/Top";

export default function CallSide(params) {
    return(
        <>
<Box
      sx={{
        bgcolor: "background.default",
        width: { xs: "100%", sm: "70%", md: "80%" },
        height: "100vh",
        borderLeft: 2,
        borderColor: "divider",
        overflow: "hidden",
        transition: "width 0.3s ease",
       display :'flex',
       flexDirection:'column',
       justifyContent:'space-between'

      }}
    >
      <Top/>
    </Box>
        </>
    )
}
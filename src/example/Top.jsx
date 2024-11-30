//mui Component
import { Box, Paper, Typography, Avatar, IconButton, Tooltip, } from "@mui/material";
//icon
import VideoChatOutlinedIcon from '@mui/icons-material/VideoChatOutlined';
import CallIcon from '@mui/icons-material/Call';



 export default function Top(params) {
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
                alt="User"
                src="/static/images/avatar/.jpg"
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
                Suabhn
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
              <Tooltip title={'Video Call'} >
                <IconButton
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
    )
  }

//mui Component
import {
  Box,
  Typography,

} from "@mui/material";

import Top from "../../example/Top";
import MessageSend from "./MessageSend";
export default function MesageSide({ user, id, message }) {
  console.log(message, 'djsfffffffffffffffffffffffffffffffffffffffffffffffffffffff');

  function Middle() {
    // Parse user only once
    const storedUser = JSON.parse(localStorage.getItem('user'));

    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          padding: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "text.primary",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "primary.light",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "secondary.light",
          },
        }}
      >
        {message.data.data.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                msg.sender === storedUser.id ? "start" : "end",
            }}
          >
            <Box
              sx={{
                backgroundColor:
                  msg.sender === storedUser.id
                    ? "primary.light"
                    : "secondary.light",
                padding: 1,
                borderRadius: 2,
                maxWidth: "40%",
                wordWrap: "break-word",
                position: "relative",
                display: "flex",
                gap: msg.text ? 4 : 0,
              }}
            >
              {msg.messageType === "text" && (
                <Typography variant="body2">{msg.text}</Typography>
              )}
              {msg.messageType === "image" && (
                <Box
                  component="img"
                  src={msg.mediaUrl}
                  alt="Sent image"
                  sx={{
                    maxWidth: "100%",
                     objectFit: "fill",
                     overflow: "hidden",
                    maxHeight: "200px",
                    borderRadius: 2,
                  }}
                />
              )}
              {msg.messageType === "file" && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    backgroundColor:
                    msg.sender === storedUser.id
                    ? "secondary.light"
                      : "primary.light"

                  }}
                >
                  <Typography variant="body2"  noWrap>
                    File
                  </Typography>
                  <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer">
                    <Typography
                      variant="body2"
                      sx={{ color: "text.light", textDecoration: "underline" }}
                    >
                      Open
                    </Typography>
                  </a>
                </Box>
              )}
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  alignSelf: "end",
                  whiteSpace: "nowrap",
                  color: "text.secondary",
                  mt: 1,
                  fontSize: "10px",
                }}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </Box>
        ))}

      </Box>
    );
  }


  return (
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Top name={user.Name} img={user.img} />
        <Middle />
        <MessageSend user={user} id={id} />
      </Box>
    </>
  );
}

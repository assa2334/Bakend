import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
//mui Component
import { Box,  Typography,  IconButton,  TextField, InputAdornment, Popover, useTheme } from "@mui/material";
//icon

import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import Top from '../../example/Top';


export default function MesageSide() {



  function Buttom(params) {
    const [anchorEl, setAnchorEl] = useState(null); // For emoji picker popover
    const [message, setMessage] = useState(""); // Message text state
    const theme = useTheme(); // Get MUI theme

    // Open emoji picker
    const handleEmojiClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    // Close emoji picker
    const handleClose = () => {
      setAnchorEl(null);
    };

    // Add emoji to message
    const onEmojiClick = (emojiObject) => {
      setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 1,
          bgcolor: 'background.paper',
          boxShadow: 1,
          borderRadius: 2,
          width: '100%',
        }}
      >
        {/* Emoji Picker Popover */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Picker onEmojiClick={onEmojiClick}
            theme={theme.palette.mode === "dark" ? "dark" : "light"} width={300} />
        </Popover>

        {/* Input Field */}
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          variant="outlined"
          size="small"
          sx={{
            flexGrow: 1,
            marginRight: 1,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleEmojiClick}>
                  <Typography variant='p' color='primary.light'>
                    <EmojiEmotionsIcon />
                  </Typography>
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <Typography variant='p' color='primary.light'>
                    <AttachFileIcon />
                  </Typography>
                </IconButton>
                <IconButton>
                  <Typography variant='p' color='primary.light'>
                   <KeyboardVoiceIcon />
                  </Typography>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Send Button */}
        <IconButton color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    );
  }

  const messages = [
    // ... existing messages

    { text: "What technologies are you using for the frontend and backend?", align: "left" },
    { text: "For the frontend, I'm using React and for the backend, I'm using Node.js with Express.", align: "right" },
    { text: "That's a great choice! Have you considered using a real-time communication library like Socket.IO?", align: "left" },
    { text: "Yes, I'm planning to use Socket.IO for real-time features like message delivery and notifications.", align: "right" },
    { text: "That's a smart move. Let me know if you need any help with that.", align: "left" },
    { text: "Thanks, I appreciate it. I'm also working on implementing end-to-end encryption.", align: "right" },
    { text: "That's a crucial feature for a secure messaging app. Good luck with that!", align: "left" },
    { text: "Thanks! I'll keep you updated on my progress.", align: "right" },
    { text: "What technologies are you using for the frontend and backend?", align: "left" },
    { text: "For the frontend, I'm using React and for the backend, I'm using Node.js with Express.", align: "right" },
    { text: "That's a great choice! Have you considered using a real-time communication library like Socket.IO?", align: "left" },
    { text: "Yes, I'm planning to use Socket.IO for real-time features like message delivery and notifications.", align: "right" },
    { text: "That's a smart move. Let me know if you need any help with that.", align: "left" },
    { text: "Thanks, I appreciate it. I'm also working on implementing end-to-end encryption.", align: "right" },
    { text: "That's a crucial feature for a secure messaging app. Good luck with that!", align: "left" },
    { text: "Thanks! I'll keep you updated on my progress.", align: "right" },
  
  ]
  function Middle() {
    return (
      <Box
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        // Custom scrollbar styles
        "&::-webkit-scrollbar": {
          width: "8px", // Adjust the width of the scrollbar
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "text.primary", // Track color
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "primary.light", // Thumb color
          borderRadius: "10px", // Rounded corners for the thumb
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "secondary.light", // Thumb hover color
        },
      }}
    >
{
  messages.map((message, index) => (
    <Box
      key={index}
      sx={{
        display: "flex",
        justifyContent: message.align === "left" ? "flex-start" : "flex-end",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          backgroundColor:message.align === "right" ? "secondary.light" : "primary.light",
          padding: 1,
          borderRadius: 3,
          fontSize: "18px",
          maxWidth: "70%",
          wordWrap: "break-word",
        }}
      >
        {message.text}
      </Typography>
    </Box>
  ))
}
    </Box >
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
       display :'flex',
       flexDirection:'column',
       justifyContent:'space-between'

      }}
    >
      <Top/>
      <Middle />
      <Buttom />
    </Box>

  </>);
}
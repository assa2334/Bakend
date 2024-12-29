import React, { useState, } from "react";
import Picker from "emoji-picker-react";
//mui Component
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Popover,
  useTheme,
} from "@mui/material";
//icon

import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { messageSend,uploadFile } from "../../Api";



export default function MessageSend({id,user}) {
 
    const [anchorEl, setAnchorEl] = useState(null); // For emoji picker popover
    const [message, setMessage] = useState(""); // Message text state
    const theme = useTheme(); // Get MUI theme


    const [audioBlob, setAudioBlob] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
  
    const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      alert('Microphone access granted!');
      const mediaRecorder = new MediaRecorder(stream);
  
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
  
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };
  
      mediaRecorder.start();
      setIsRecording(true);
  
      // Stop recording after 10 seconds (you can modify this as needed)
      setTimeout(async () => {
        mediaRecorder.stop();

        setIsRecording(false);
        alert('Recording stopped!'); 
        var Type ="audio";
    
          let obj ={
            conversation:id,
            recipient:user._id,
            file:audioBlob,
            Type,
        }
        console.log(obj);
        try {
          
          let response = await uploadFile(obj);
          console.log(response, "Message sent successfully");
         if(response.status === 200){
          alert('Audio sent successfully!');
          setAudioBlob(null); 
         }
        } catch (error) {
          console.log("Some error occurred while sending the message");
          setAudioBlob(null); 
        } 

      }, 10000); // 10 seconds
    } catch (error) {
      console.error('Permission denied:', error);
      alert('Please grant microphone access to record voice.');
    }
    };
  
    



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
        setAnchorEl(null);
    };

  
    async function sendmessage(params) {
      if (message.trim() === "") return; 
        let obj ={
            conversation:id,
            recipient:user._id,
            text:message.trim()
        }
        // console.log(obj);
        try {
          
          let response = await messageSend(obj);
          console.log(response, "Message sent successfully");
          setMessage(""); 
        } catch (error) {
          console.log("Some error occurred while sending the message");
        } 

    }
    const handleKeyDown =(event)=>{
      if (event.key === 'Enter') {
        sendmessage()
      }
    }

    const handleFileUpload = async(event)=>{
      const file = event.target.files[0]; 
      var Type ="";
  if (file) {
    if (file.type.startsWith("image/")) {
      Type ="image"
    } else if (file.type === "application/pdf") {
      Type ="file"
    } else {
      alert(`${file.name} is not a supported file type.`);
    }
  }
        let obj ={
          conversation:id,
          recipient:user._id,
          file,
          Type,
      }
      console.log(obj);
      try {
        
        let response = await uploadFile(obj);
        console.log(response, "Message sent successfully");
        // setMessage(""); 
      } catch (error) {
        console.log("Some error occurred while sending the message");
      } 


    }

    return(
       <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 1,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  borderRadius: 2,
                  width: "100%",
                }}
              >
                {/* Emoji Picker Popover */}
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <Picker
                    onEmojiClick={onEmojiClick}
                    theme={theme.palette.mode === "dark" ? "dark" : "light"}
                    width={300}
                  />
                </Popover>
        
                {/* Input Field */}
                <TextField
                  fullWidth
                  value={message}
                  onChange={(e) =>  setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
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
                          <Typography variant="p" color="primary.light">
                            <EmojiEmotionsIcon />
                          </Typography>
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton  component="label"  >
                          <Typography variant="p" color="primary.light">
                            <AttachFileIcon  />
                          </Typography>
                          <input type="file"   style={{display:'none'}} onChange={handleFileUpload} />
                        </IconButton>
                        <IconButton onClick={handleStartRecording} disabled={isRecording}>
                          <Typography variant="p" color="primary.light">
                            <KeyboardVoiceIcon />
                          </Typography>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
        
                {/* Send Button */}
                <IconButton color="primary">
                  <SendIcon onClick={sendmessage} />
                </IconButton>
              </Box>
      </>     
    );
}
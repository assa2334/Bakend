import { Box } from "@mui/material";
import Naneside from "../Message/NameSide";
import VideoSide from "./VideoSide";
// api
import {UserList ,uploadVideo} from '../../api/index'
//react
import { useState, useEffect } from "react";
// mui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";



export default function Status(params) {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);  // Using state for loading instead of useTransition
  const [selectedUser, setSelectedUser] = useState(); 

// test url
async function isCorrectVideoUrl(url) {
  // Validate the URL format
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  if (!urlRegex.test(url)) {
      return false; // Invalid URL format
  }

  // Check for video file extensions
  const videoExtensions = ['.mp4', '.avi', '.mkv', '.webm', '.mov', '.flv'];
  if (!videoExtensions.some(ext => url.toLowerCase().endsWith(ext))) {
      return false; // Not a video file based on extension
  }

  // Check the Content-Type header to confirm it's a video
  try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.startsWith('video/')) {
          return false; // Not a video based on Content-Type
      }
  } catch (error) {
      console.error("Error validating video URL:", error);
      return false; // Network error or inaccessible URL
  }

  // If all checks pass, the URL is valid and points to a video
  return true;
}



    // API call inside useEffect
    useEffect(() => {
      const call = async () => {
        setLoading(true);  // Set loading to true when the API call starts
        try {
          const response = await UserList();
          if (response.data) {
            console.log(response.data.data,'statussdhfgsdgfsgdjdgsfjagdfasjdhfukdfkj');
            
            let filterUser = response.data.data.filter((user) => !user.Status == "");
            console.log(filterUser,'statusfilter');
            setState(filterUser);
            
            console.log(state,'status');
            
          } else {
            console.log('Some error');
          }
        } catch (err) {
          console.log("Error fetching data:", err);
        } finally {
          setLoading(false);  
        }
      };
  
      call();
    }, []);

     const handleUserClick = async (user) => {
          console.log("Selected User:", user);
          setSelectedUser(user); 
      };



      const [videoUrl, setVideoUrl] = useState("");
      const [videoFile, setVideoFile] = useState(null);
      const [open, setOpen] = useState(false);
      const statusUpdatefunction = () => {
        setOpen(true);
      }

    
      const handleFileChange = (event) => {
        setVideoFile(event.target.files[0]);
        console.log(event.target.files[0]);
        
      };
    
      const handleUpload = async() => {
        if (videoUrl) {
          console.log(videoUrl);
          let UrlTest = await isCorrectVideoUrl(videoUrl);
          if (UrlTest) {
            alert("Correct video URL");
            alert("Uploading video from URL:", videoUrl);
            setOpen(false);
            setVideoUrl("");
          } else {
            alert("Invalid video URL!");
          }
        } else if (videoFile) {
          alert("Uploading video file:", videoFile.name);
          let response = await uploadVideo(videoFile);
          console.log(response,'dhjkdksjjsdfjsfjfjsfj');  

        setOpen(false);
        setVideoFile(null);
        } else {
          alert("No video selected!");
        }
    
        // Close the dialog after handling upload
      };

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
        <Naneside name={"Status"}  data={state} loading={loading} onUserClick={handleUserClick} UploadStatus={statusUpdatefunction} />
        <VideoSide select={selectedUser} />
      </Box>
      <Dialog open={open} onClose={()=>{setOpen(false)}} maxWidth="sm" fullWidth>
      <DialogTitle>Status Upload Two Way</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Enter a video URL or upload a video file to upload your status.
        </Typography>
        {/* Input field for URL */}
        <TextField
          label="Video URL"
          fullWidth
          value={videoUrl}
          onChange={(e)=>{setVideoUrl(e.target.value)}}
          margin="normal"
          variant="outlined"
        />
        <Typography align="center" marginY={2}>
          <strong>OR</strong>
        </Typography>
        {/* Button for file upload */}
        <Button variant="contained" component="label" fullWidth>
          Upload Video
          <input
            type="file"
            accept="video/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {videoFile && (
          <Typography variant="body2" color="textSecondary" marginTop={1}>
            Selected file: {videoFile.name}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>{setOpen(false)}} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpload} color="primary" variant="contained">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}

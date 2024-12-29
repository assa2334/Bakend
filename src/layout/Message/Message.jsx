import { Box, Typography } from "@mui/material";
import NameSide from "./NameSide";  // Corrected typo in `Naneside`
import MessageSide from "./Messageside";
// api
import { UserList,Conversation,messagefind } from "../../Api";
import { useState, useEffect } from "react";


export default function Message() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);  // Using state for loading instead of useTransition
  const [selectedUser, setSelectedUser] = useState(); 
  const [Conversationid,setConversationid]= useState('');
  const [data,setdata]= useState();
  // API call inside useEffect
  useEffect(() => {
    const call = async () => {
      setLoading(true);  // Set loading to true when the API call starts
      try {
        const response = await UserList();
        if (response.data) {
          setState(response.data);
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
    try {
      let response = await Conversation(user._id);
      const conversationId = response.data._id;
  
    
      setConversationid(conversationId);
  
      // Fetch messages directly using the conversationId
      let responemessage = await messagefind(conversationId);
      setdata(responemessage);
  
      console.log("Selected User:", user);
      setSelectedUser(user); // Update the selected user last
    } catch (error) {
      console.error("Error in handleUserClick:", error);
    }
  };
  
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "lightseagreen",
        display: "flex",
        overflow: "auto",
      }}
    >
      {/* Pass loading and data status to NameSide */}
      <NameSide name={"Chats"} data={state} loading={loading} onUserClick={handleUserClick} />
      {selectedUser !== undefined && data !== undefined ? 
         <MessageSide user={selectedUser} id={Conversationid}  message={data}/> 
      :
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
        flexDirection: "column", // Align items vertically
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center", // Center align the text
        gap: 2, // Add space between elements
      }}
    >
      <Typography variant="h4" sx={{ color: "text.primary", fontWeight: "bold" }}>
        Welcome to WhatsApp Clone
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "60%" }}>
        Select a chat to start messaging or use the search to find new contacts. Your conversations will appear here.
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.disabled",
          marginTop: 2,
          fontStyle: "italic",
        }}
      >
        Stay connected, stay updated!
      </Typography>
    </Box>
    
     }
    </Box>
  );
}

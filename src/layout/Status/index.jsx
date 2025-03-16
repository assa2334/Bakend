import { Box } from "@mui/material";
import Naneside from "../Message/NameSide";
import VideoSide from "./VideoSide";
import {UserList ,Conversation} from '../../api/index'
import {  useNavigate } from "react-router-dom";
//react
import { useState, useEffect } from "react";
export default function Status(params) {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);  // Using state for loading instead of useTransition
  const [selectedUser, setSelectedUser] = useState(); 
  const [Conversationid,setConversationid]= useState('');
  const [data,setdata]= useState();
  const user = JSON.parse(localStorage.getItem('user'));
  const nagivate = useNavigate();
  if (!user || user.isverify === false) {  
    nagivate("/singup");
  }
    // API call inside useEffect
    useEffect(() => {
      const call = async () => {
        setLoading(true);  // Set loading to true when the API call starts
        try {
          const response = await UserList();
          if (response.data) {
            console.log(response.data,'statussdhfgsdgfsgdjdgsfjagdfasjdhfukdfkj');
            
            let filterUser = response.data.data.filter((user) => user.status !== "");
            setState(filterUser);
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
      
          // // Fetch messages directly using the conversationId
          // let responemessage = await messagefind(conversationId);
          // setdata(responemessage);
      
          // console.log("Selected User:", user);
          // setSelectedUser(user); // Update the selected user last
        } catch (error) {
          console.error("Error in handleUserClick:", error);
        }
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
        <Naneside name={"Status"}  data={state} loading={loading} onUserClick={handleUserClick} />
        <VideoSide />
      </Box>
    </>
  );
}

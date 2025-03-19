import { useParams } from "react-router-dom";

const VideoCall = () => {
  const { sender, receiver } = useParams(); // Extract sender and receiver IDs

  return (
    <div>
      <h1>Video Call</h1>
      <p>Caller ID: {sender}</p>
      <p>Receiver ID: {receiver}</p>
    </div>
  );
};

export default VideoCall;

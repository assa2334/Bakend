import { useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../../context/Context-api";

const VoiceCall = () => {
  const { sender, receiver } = useParams();
  const { socket, peer, peerId } = useContext(ThemeContext);
  const [remotePeerId, setRemotePeerId] = useState(null);
  const [call, setCall] = useState(null);
  const remoteAudio = useRef();

  useEffect(() => {
    // Listen for peer ID of the receiver
    socket.on("receivePeerId", ({ userId, peerId }) => {
      if (userId === receiver) {
        setRemotePeerId(peerId);
      }
    });

    return () => {
      socket.off("receivePeerId");
    };
  }, [receiver, socket]);

  const startCall = () => {
    if (!remotePeerId) return console.error("Receiver peer ID not found");

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const outgoingCall = peer.call(remotePeerId, stream);
      setCall(outgoingCall);
    });
  };

  useEffect(() => {
    peer.on("call", (incomingCall) => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        incomingCall.answer(stream);
        incomingCall.on("stream", (remoteStream) => {
          remoteAudio.current.srcObject = remoteStream;
        });
      });
    });
  }, [peer]);

  return (
    <div>
      <h1>Voice Call</h1>
      <p>Caller ID: {sender}</p>
      <p>Receiver ID: {receiver}</p>
      <button onClick={startCall}>Start Call</button>
      <audio ref={remoteAudio} autoPlay />
    </div>
  );
};

export default VoiceCall;

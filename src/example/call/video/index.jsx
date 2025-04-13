import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Socket } from "../../../context/Socket";
import { Button, Container, Box, Typography } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';

const VoiceCall = () => {
    const { sender, receiver } = useParams();
    const { 
        socket, 
        peer,
        localStream,
        remoteStream,
        Voicecallfunction,
        setLocalStream,
        setRemoteStream
    } = useContext(Socket);
    const navigate = useNavigate();
    const localAudioRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [callStatus, setCallStatus] = useState("initializing");

    useEffect(() => {
        let isMounted = true;
        let streamCleanup = null;
        const currentLocalAudioRef = localAudioRef.current;
        const currentRemoteAudioRef = remoteAudioRef.current;

        const initializeCall = async () => {
            try {
                setCallStatus("initializing");
                
                // Get user media
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    },
                    video: false 
                });
                
                if (!isMounted) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamCleanup = stream;
                setLocalStream(stream);
                
                // Setup local audio
                if (currentLocalAudioRef) {
                    currentLocalAudioRef.srcObject = stream;
                }

                // Add tracks to peer connection
                stream.getTracks().forEach(track => {
                    peer.addTrack(track, stream);
                });

                // Initiate call
                await Voicecallfunction(sender, receiver);
                setCallStatus("calling");

            } catch (err) {
                if (!isMounted) return;
                console.error("Call initialization error:", err);
                setCallStatus("failed");
            }
        };

        initializeCall();

        return () => {
            isMounted = false;
            if (streamCleanup) {
                streamCleanup.getTracks().forEach(track => track.stop());
            }
            if (currentLocalAudioRef?.srcObject) {
                currentLocalAudioRef.srcObject = null;
            }
            if (currentRemoteAudioRef?.srcObject) {
                currentRemoteAudioRef.srcObject = null;
            }
        };
    }, [sender, receiver, peer, socket, Voicecallfunction, setLocalStream]);

    useEffect(() => {
        if (localStream && localAudioRef.current) {
            localAudioRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteStream && remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            setCallStatus("connected");
        }
    }, [remoteStream]);

    useEffect(() => {
        if (!socket) return;

        const handleCallAccepted = () => {
            setCallStatus("connected");
        };

        const handleCallRejected = () => {
            setCallStatus("failed");
            setTimeout(() => navigate("/"), 2000);
        };

        const handleCallEnded = () => {
            setCallStatus("ended");
            setTimeout(() => navigate("/"), 2000);
        };

        socket.on("callAccepted", handleCallAccepted);
        socket.on("callRejected", handleCallRejected);
        socket.on("callEnded", handleCallEnded);

        return () => {
            socket.off("callAccepted", handleCallAccepted);
            socket.off("callRejected", handleCallRejected);
            socket.off("callEnded", handleCallEnded);
        };
    }, [socket, navigate]);

    const toggleMute = () => {
        if (localStream) {
            const audioTracks = localStream.getAudioTracks();
            audioTracks.forEach(track => track.enabled = !track.enabled);
            setIsMuted(!isMuted);
        }
    };

    const endCall = () => {
        if (socket) {
            socket.emit("endCall", { sender, receiver });
        }
        navigate("/");
    };

    return (
        <Container sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Voice Call with {receiver}
            </Typography>
            
            <Typography variant="h6" color="text.secondary" gutterBottom>
                {callStatus === "initializing" ? "Initializing..." :
                 callStatus === "calling" ? "Calling..." : 
                 callStatus === "connected" ? "Call Connected" :
                 callStatus === "failed" ? "Call Failed" :
                 callStatus === "ended" ? "Call Ended" : ""}
            </Typography>
            
            <Box sx={{ my: 4 }}>
                <audio ref={localAudioRef} autoPlay muted />
                <audio ref={remoteAudioRef} autoPlay />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                    variant="contained"
                    color={isMuted ? "error" : "primary"}
                    onClick={toggleMute}
                    startIcon={isMuted ? <MicOffIcon /> : <MicIcon />}
                    disabled={callStatus !== "connected"}
                >
                    {isMuted ? "Unmute" : "Mute"}
                </Button>
                
                <Button
                    variant="contained"
                    color="error"
                    onClick={endCall}
                    startIcon={<CallEndIcon />}
                >
                    End Call
                </Button>
            </Box>
        </Container>
    );
};

export default VoiceCall;
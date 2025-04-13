import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Socket } from "../../../context/Socket";
import { Button, Container, Box, Typography, CircularProgress } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const VoiceCall = () => {
    const { sender, receiver } = useParams();
    const { 
        socket, 
        peer,
        localStream,
        remoteStream,
        startVoiceCall,
        endCall
    } = useContext(Socket);
    const navigate = useNavigate();
    const localAudioRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isRemoteMuted, setIsRemoteMuted] = useState(false);
    const [callStatus, setCallStatus] = useState("initializing");
    const [callDuration, setCallDuration] = useState(0);
    const callTimerRef = useRef(null);

    // Initialize call and set up media streams
    useEffect(() => {
        let isMounted = true;
        let streamCleanup = null;

        const initializeCall = async () => {
            try {
                setCallStatus("initializing");
                
                // Start the call
                await startVoiceCall(sender, receiver);
                setCallStatus("calling");

            } catch (err) {
                console.error("Call initialization error:", err);
                setCallStatus("failed");
                setTimeout(() => navigate("/"), 2000);
            }
        };

        if (isMounted) {
            initializeCall();
        }

        return () => {
            isMounted = false;
            if (streamCleanup) {
                streamCleanup.getTracks().forEach(track => track.stop());
            }
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current);
            }
        };
    }, [sender, receiver, startVoiceCall, navigate]);

    // Handle local audio stream
    useEffect(() => {
        if (localStream && localAudioRef.current) {
            localAudioRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Handle remote audio stream
    useEffect(() => {
        if (remoteStream && remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            setCallStatus("connected");
            
            // Start call timer when connection is established
            if (!callTimerRef.current) {
                const startTime = Date.now();
                callTimerRef.current = setInterval(() => {
                    setCallDuration(Math.floor((Date.now() - startTime) / 1000));
                }, 1000);
            }
        }
    }, [remoteStream]);

    // Socket event handlers
    useEffect(() => {
        if (!socket) return;

        const handleCallAccepted = () => {
            setCallStatus("connected");
        };

        const handleCallRejected = () => {
            setCallStatus("rejected");
            setTimeout(() => navigate("/"), 2000);
        };

        const handleCallEnded = () => {
            setCallStatus("ended");
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current);
            }
            setTimeout(() => navigate("/"), 2000);
        };

        const handleRemoteMute = (isMuted) => {
            setIsRemoteMuted(isMuted);
        };

        socket.on("callAccepted", handleCallAccepted);
        socket.on("callRejected", handleCallRejected);
        socket.on("callEnded", handleCallEnded);
        socket.on("remoteMute", handleRemoteMute);

        return () => {
            socket.off("callAccepted", handleCallAccepted);
            socket.off("callRejected", handleCallRejected);
            socket.off("callEnded", handleCallEnded);
            socket.off("remoteMute", handleRemoteMute);
        };
    }, [socket, navigate]);

    const toggleMute = () => {
        if (localStream) {
            const newMuteState = !isMuted;
            const audioTracks = localStream.getAudioTracks();
            audioTracks.forEach(track => track.enabled = !newMuteState);
            setIsMuted(newMuteState);
            
            // Notify remote peer about mute state change
            if (socket) {
                socket.emit("muteState", { 
                    sender,
                    receiver,
                    isMuted: newMuteState 
                });
            }
        }
    };

    const handleEndCall = () => {
        endCall(sender, receiver);
        navigate("/");
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Container sx={{ 
            textAlign: 'center', 
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh'
        }}>
            {/* Call Status and Duration */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {callStatus === "connected" ? "Voice Call Connected" : 
                     callStatus === "calling" ? "Calling..." :
                     callStatus === "rejected" ? "Call Rejected" :
                     callStatus === "ended" ? "Call Ended" : "Initializing Call"}
                </Typography>
                
                {callStatus === "connected" && (
                    <Typography variant="h6" color="text.secondary">
                        {formatDuration(callDuration)}
                    </Typography>
                )}
            </Box>

            {/* Remote User Status */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="body1">
                    {receiver} {isRemoteMuted && "(Muted)"}
                </Typography>
                {isRemoteMuted && <VolumeUpIcon color="disabled" sx={{ fontSize: 40 }} />}
            </Box>

            {/* Audio Elements (hidden) */}
            <Box sx={{ display: 'none' }}>
                <audio ref={localAudioRef} autoPlay muted />
                <audio ref={remoteAudioRef} autoPlay />
            </Box>

            {/* Loading Indicator */}
            {callStatus === "initializing" && (
                <CircularProgress size={60} sx={{ my: 4 }} />
            )}

            {/* Call Controls */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 3,
                mt: 4,
                width: '100%',
                maxWidth: 400
            }}>
                <Button
                    variant="contained"
                    color={isMuted ? "error" : "primary"}
                    onClick={toggleMute}
                    startIcon={isMuted ? <MicOffIcon /> : <MicIcon />}
                    disabled={!["connected", "calling"].includes(callStatus)}
                    sx={{ flex: 1, py: 2 }}
                >
                    {isMuted ? "Unmute" : "Mute"}
                </Button>
                
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleEndCall}
                    startIcon={<CallEndIcon />}
                    sx={{ flex: 1, py: 2 }}
                >
                    End Call
                </Button>
            </Box>

            {/* Error Message */}
            {callStatus === "failed" && (
                <Typography color="error" variant="body1" sx={{ mt: 4 }}>
                    Failed to establish call. Please try again.
                </Typography>
            )}
        </Container>
    );
};

export default VoiceCall;
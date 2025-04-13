import { createContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export const Socket = createContext();

export const SocketProvider = ({ children }) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callType, setCallType] = useState(null); // 'voice' or 'video'
    
    const storedUser = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user || { id: null };
    };

    const socket = useMemo(() => {
        if (!storedUser().id) return null;
        return io('https://vfb6vjc3-9000.euw.devtunnels.ms/', {
            query: { userId: storedUser()?.id },
        });
    }, []);

    const peer = useMemo(() => {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                // Add TURN servers here if needed
            ],
            iceTransportPolicy: 'all',
            iceCandidatePoolSize: 5
        });
        return pc;
    }, []);

    const createOffer = async (type) => {
        try {
            if (!peer) throw new Error("Peer connection not initialized");
            
            const offer = await peer.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: type === 'video'
            });
            await peer.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error("Error creating offer:", error);
            throw error;
        }
    };

    const createAnswer = async (offer) => {
        try {
            if (!peer) throw new Error("Peer connection not initialized");
            
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            return answer;
        } catch (error) {
            console.error("Error creating answer:", error);
            throw error;
        }
    };

    const startCall = async (receiverId, type) => {
        try {
            setCallType(type);
            const mediaConstraints = {
                audio: true,
                video: type === 'video'
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
            setLocalStream(stream);
            
            stream.getTracks().forEach(track => peer.addTrack(track, stream));
            
            peer.remoteUserId = receiverId;
            const offer = await createOffer(type);
            socket.emit("call-initiate", { receiverId, offer, type });
        } catch (error) {
            console.error("Call initiation error:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (!socket || !peer) return;

        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        // ICE Candidate handling
        peer.onicecandidate = (event) => {
            if (event.candidate && peer.remoteUserId) {
                socket.emit('ice-candidate', {
                    candidate: event.candidate,
                    targetId: peer.remoteUserId
                });
            }
        };

        // Socket event handlers
        socket.on('incoming-call', ({ callerId, offer, type }) => {
            setCallType(type);
            // You can store this data in state to show incoming call UI
        });

        socket.on('call-accepted', (answer) => {
            peer.setRemoteDescription(new RTCSessionDescription(answer))
                .catch(e => console.error("Error setting remote description:", e));
        });

        socket.on('ice-candidate', (candidate) => {
            peer.addIceCandidate(new RTCIceCandidate(candidate))
                .catch(e => console.error("Error adding ICE candidate:", e));
        });

        return () => {
            if (peer) {
                peer.onicecandidate = null;
                peer.ontrack = null;
            }
            if (socket) {
                socket.off('incoming-call');
                socket.off('call-accepted');
                socket.off('ice-candidate');
            }
        };
    }, [socket, peer]);

    return (
        <Socket.Provider value={{ 
            socket, 
            peer, 
            localStream,
            remoteStream,
            callType,
            startCall,
            createAnswer,
            setLocalStream,
            setRemoteStream
        }}>
            {children}
        </Socket.Provider>
    );
};
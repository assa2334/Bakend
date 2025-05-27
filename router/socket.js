const SocketUserController = require('../controller/controllerSocket/user');
const UserModel = require('../model/User');

// Track active users and calls
const activeUsers = new Map(); // { userId: socketId }
const activeCalls = new Map(); // { callId: { participants: {sender, receiver}, type, status } }
const obj = {}



obj.socketHandler = (io) => {
    obj.sendToUser = function( userId, message) {
        try {
          console.log("Attempting to send message to user:", userId);
      
          const socketId = activeUsers.get(userId);
          if (!socketId) {
            console.log("User not connected:", userId);
            return false;
          }
      
          const socket = io.sockets.sockets.get(socketId);
          if (!socket) {
            activeUsers.delete(userId);
            console.log("Stale connection removed for user:", userId);
            return false;
          }
      
          console.log("Sending message to socket:", socketId);
          socket.emit('new_message', message);
          return true;
        } catch (error) {
          console.error('Error sending to user:', error);
          return null;
        }
      }
    
    io.on('connection', async (socket) => {
        const userId = socket.handshake.query.userId;
        
        if (!userId) {
            socket.emit('error', { message: 'User ID is required' });
            socket.disconnect();
            return;
        }

        console.log(`User connected: ${userId}`);
        activeUsers.set(userId, socket.id);
        
        try {

   

            

            // Get user details
            const userData = await UserModel.findById(userId).lean();
            if (!userData) {
                throw new Error('User not found');
            }

            // Voice Call Handling
            socket.on('startVoiceCall', async ({ receiverId }) => {
                try {
                    console.log(`Voice call initiated from ${userId} to ${receiverId}`);
                    
                    if (!activeUsers.has(receiverId)) {
                        socket.emit('callError', { message: 'User is offline' });
                        return;
                    }

                    const callId = `call_${userId}_${receiverId}_${Date.now()}`;
                    activeCalls.set(callId, {
                        participants: { sender: userId, receiver: receiverId },
                        type: 'voice',
                        status: 'ringing'
                    });

                    // Notify receiver
                    io.to(activeUsers.get(receiverId)).emit('incomingVoiceCall', {
                        callId,
                        caller: userData
                    });

                    socket.emit('callInitiated', { callId });

                } catch (error) {
                    console.error('Voice call error:', error);
                    socket.emit('callError', { message: error.message });
                }
            });

            // Video Call Handling
            socket.on('startVideoCall', async ({ receiverId }) => {
                try {
                    console.log(`Video call initiated from ${userId} to ${receiverId}`);
                    
                    if (!activeUsers.has(receiverId)) {
                        socket.emit('callError', { message: 'User is offline' });
                        return;
                    }

                    const callId = `call_${userId}_${receiverId}_${Date.now()}`;
                    activeCalls.set(callId, {
                        participants: { sender: userId, receiver: receiverId },
                        type: 'video',
                        status: 'ringing'
                    });

                    // Notify receiver
                    io.to(activeUsers.get(receiverId)).emit('incomingVideoCall', {
                        callId,
                        caller: userData
                    });

                    socket.emit('callInitiated', { callId });

                } catch (error) {
                    console.error('Video call error:', error);
                    socket.emit('callError', { message: error.message });
                }
            });

            // Call Answer Handling
            socket.on('answerCall', ({ callId, answer }) => {
                try {
                    const call = activeCalls.get(callId);
                    if (!call) {
                        throw new Error('Invalid call ID');
                    }

                    if (call.participants.receiver !== userId) {
                        throw new Error('Unauthorized to answer this call');
                    }

                    if (answer) {
                        call.status = 'active';
                        // Notify caller
                        io.to(activeUsers.get(call.participants.sender)).emit('callAccepted', { 
                            callId,
                            type: call.type
                        });
                    } else {
                        // Notify caller
                        io.to(activeUsers.get(call.participants.sender)).emit('callRejected', { callId });
                        activeCalls.delete(callId);
                    }
                } catch (error) {
                    console.error('Answer call error:', error);
                    socket.emit('callError', { message: error.message });
                }
            });

            // WebRTC Signaling
            socket.on('iceCandidate', ({ candidate, callId, targetId }) => {
                try {
                    const targetSocketId = activeUsers.get(targetId);
                    if (!targetSocketId) {
                        throw new Error('Recipient not available');
                    }

                    // Filter out TCP candidates (optional)
                    if (candidate.candidate.includes('tcp')) {
                        console.log('Filtering out TCP candidate');
                        return;
                    }

                    io.to(targetSocketId).emit('iceCandidate', { 
                        candidate,
                        callId
                    });
                } catch (error) {
                    console.error('ICE candidate error:', error);
                }
            });

            // Mute State Handling
            socket.on('muteState', ({ callId, isMuted }) => {
                try {
                    const call = activeCalls.get(callId);
                    if (!call) return;

                    const otherUserId = call.participants.sender === userId 
                        ? call.participants.receiver 
                        : call.participants.sender;

                    if (activeUsers.has(otherUserId)) {
                        io.to(activeUsers.get(otherUserId)).emit('remoteMute', isMuted);
                    }
                } catch (error) {
                    console.error('Mute state error:', error);
                }
            });

            // End Call Handling
            socket.on('endCall', ({ callId }) => {
                try {
                    const call = activeCalls.get(callId);
                    if (!call) return;

                    const otherUserId = call.participants.sender === userId 
                        ? call.participants.receiver 
                        : call.participants.sender;

                    if (activeUsers.has(otherUserId)) {
                        io.to(activeUsers.get(otherUserId)).emit('callEnded', { callId });
                    }

                    activeCalls.delete(callId);
                    console.log(`Call ${callId} ended`);
                } catch (error) {
                    console.error('End call error:', error);
                }
            });

            // Disconnection Handling
            socket.on('disconnect', async () => {
                console.log(`User disconnected: ${userId}`);
                activeUsers.delete(userId);
              
                // End all active calls for this user
                for (const [callId, call] of activeCalls) {
                    if (call.participants.sender === userId || call.participants.receiver === userId) {
                        const otherUserId = call.participants.sender === userId 
                            ? call.participants.receiver 
                            : call.participants.sender;

                        if (activeUsers.has(otherUserId)) {
                            io.to(activeUsers.get(otherUserId)).emit('callEnded', { 
                                callId,
                                reason: 'User disconnected' 
                            });
                        }
                        activeCalls.delete(callId);
                    }
                }
            });

        } catch (error) {
            console.error('Connection setup error:', error);
            socket.disconnect();
        }
    });

    // Periodically clean up stale calls (optional)
    setInterval(() => {
        const now = Date.now();
        for (const [callId, call] of activeCalls) {
            const callTime = parseInt(callId.split('_')[3]);
            if (now - callTime > 3600000) { // 1 hour timeout
                activeCalls.delete(callId);
            }
        }
    }, 60000); // Check every minute
};


  

module.exports =obj ;
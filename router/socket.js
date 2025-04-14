const SocketUserController = require('../controller/controllerSocket/user');
const UserModel = require('../model/User');

// Track active users and calls
const activeUsers = new Map(); // { userId: socketId }
const activeCalls = new Map(); // { callId: { participants: {sender, receiver}, type, status } }

const socketHandler = (io) => {
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
            

            // Voice Call Handling
            socket.on("Request-Call", async (data) => {
                const { sender, receiver, offer, type } = data;
            
                const receiverSocketId = activeUsers.get(receiver);
                
                if (receiverSocketId) {
                    // Send the offer to the receiver
                    const userData = await UserModel.findById(sender);
            if (!userData) {
                throw new Error('User not found');
            }
                    io.to(receiverSocketId).emit("Incoming-Call", {
                        sender,
                        offer,
                        type,
                        user:userData,
                        receiver,
                    });
            
                    console.log(`Call request sent from ${sender} to ${receiver}`);
                } else {
                    // Receiver is not online
                    socket.emit("Call-Failed", {
                        message: "User is not available"
                    });
            
                    console.log(`Call failed. Receiver ${receiver} is not online.`);
                }
            });
            socket.on("Answer-Call", async (data) => {
                const { sender, receiver, answer } = data;
            
                const senderSocketId = activeUsers.get(sender);
                if (!senderSocketId) {
                    socket.emit("Call-Failed", {
                        message: "Sender is not available"
                    });
                    console.log(`Answer failed. Sender ${sender} not online.`);
                    return;
                }
            
                // Send answer back to sender
                io.to(senderSocketId).emit("Call-Accepted", {
                    sender,
                    receiver,
                    answer
                });
            
                console.log(`Call answered by ${receiver} for ${sender}`);
            });
            
             socket.on("ice-candidate", ({ to, candidate }) => {
            const targetSocketId = activeUsers.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit("ice-candidate", { candidate });
            }
        });

            // Disconnection Handling
            socket.on('disconnect', async () => {
                console.log(`User disconnected: ${userId}`);
                // activeUsers.delete(userId);
              
                // End all active calls for this user
              
            });

        } catch (error) {
            console.error('Connection setup error:', error);
            socket.disconnect();
        }
    });

    // Periodically clean up stale calls (optional)
 
};

module.exports = socketHandler;
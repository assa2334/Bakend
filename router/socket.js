const SocketUserController = require('../controller/controllerSocket/user')
const socketHandler = (io) => {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId; // Get user ID from query
        console.log(userId,"hello subhan");
        SocketUserController.statusChangeOnline(userId)
  
        socket.on("peerId", ({ userId, peerId }) => {
            console.log(`User ${userId} has Peer ID: ${peerId}`);
            socket.broadcast.emit("receivePeerId", { userId, peerId });
          });
        socket.on('userDisconnected', (data) => {
            SocketUserController.statusChangeOffline(data)
            console.log(`User disconnected: ${socket.id} | User ID: ${data}`);
        });

        // Handling disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id} | User ID: ${userId}`);
        });
    });
};

module.exports = socketHandler;

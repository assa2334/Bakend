const UserModel = require('../model/User');
const OtherFUnction = require('../controller/controllerSocket/user');
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
            console.log('❌ No userId provided in handshake query');
            socket.emit('error', { message: 'User ID is required' });
            socket.disconnect();
            return;
        }

        console.log(`✅ User connected: ${userId}`);
        activeUsers.set(userId, socket.id);
        
        try {

   

            

    console.log(`User connected: ${userId}`);
    activeUsers.set(userId, socket.id);

    // ========================
    // 🔔 Incoming Call Request
    // ========================
    socket.on("Request-Call", async ({ sender, receiver, offer, type }) => {
      const receiverSocketId = activeUsers.get(receiver);

      if (!receiverSocketId) {
        socket.emit("Call-Failed", { message: "User is not available" });
        console.log(`❌ Call failed: Receiver ${receiver} is offline`);
        return;
      }

      const senderData = await UserModel.findById(sender);
      if (!senderData) {
        socket.emit("Call-Failed", { message: "Sender not found" });
        return;
      }

      // Save call state
      const callId = `${sender}_${receiver}`;
      activeCalls.set(callId, {
        sender,
        receiver,
        type,
        status: "ringing"
      });

      // Emit to receiver
      io.to(receiverSocketId).emit("Incoming-Call", {
        sender,
        receiver,
        offer,
        type,
        user: senderData
      });
      

      console.log(`📞 Call request sent from ${sender} offer ${offer} ➡️ ${receiver}`);
    });

    // ========================
    // ✅ Answer Call
    // ========================
    socket.on("Answer-Call", ({ sender, receiver, answer }) => {
      const senderSocketId = activeUsers.get(sender);
      console.log(answer, "answer");
      
      if (!senderSocketId) {
        socket.emit("Call-Failed", { message: "Sender is not online" });
        return;
      }

      // Update call state
      const callId = `${sender}_${receiver}`;
      if (activeCalls.has(callId)) {
        activeCalls.get(callId).status = "connected";
      }

      io.to(senderSocketId).emit("Call-Accepted", {
        sender,
        receiver,
        answer
      });

      console.log(`✅ Call answered by ${receiver} anwser${answer} for ${sender}`);
    });

    // ========================
    // ❌ Call Failed (mic denied or other reason)
    // ========================
    socket.on("Call-Failed", ({ sender, receiver, message }) => {
      const senderSocketId = activeUsers.get(sender);
      const receiverSocketId = activeUsers.get(receiver);

      const callId = `${sender}_${receiver}`;
      activeCalls.set(callId, {
        sender,
        receiver,
        type: "unknown",
        status: "failed"
      });

      if (senderSocketId) {
        io.to(senderSocketId).emit("Call-Failed", {
          message: message || "Call failed"
        });
      }

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("Call-Failed", {
          message: message || "Call failed"
        });
      }

      console.log(`❌ Call failed between ${sender} and ${receiver}: ${message}`);
    });

    // ========================
    // 🔁 ICE Candidates
    // ========================
    socket.on("ice-candidate", ({ to, candidate }) => {
      const targetSocketId = activeUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("ice-candidate", { candidate });
      }
    });

    // ========================
    // ❌ Call Ended
    // ========================
    socket.on("End-Call", async ({ sender, receiver,endCall,Type , StartTime, EndTime, DurationTime , }) => {
    
      
      const callId = `${sender}_${receiver}`;
      if (activeCalls.has(callId)) {
        activeCalls.get(callId).status = "ended";
      }

      const receiverSocketId = activeUsers.get(endCall);
      if (receiverSocketId) {
        console.log(`📴 Call ended between ${sender} and ${receiver}`);
          io.to(receiverSocketId).emit("Call-Failed", { message: "Second Person cross Call" });
        io.to(receiverSocketId).emit("Call-Ended", { sender });
      }

      let respones = await OtherFUnction.StrogeCallHistor(sender, receiver, Type, StartTime, EndTime, DurationTime, obj.sendToUser);
  
      
    });

    // ========================
    // 🔌 Disconnect
    // ========================
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      activeUsers.delete(userId);

      // End any active calls
      for (const [callId, call] of activeCalls.entries()) {
        if (call.sender === userId || call.receiver === userId) {
          activeCalls.set(callId, { ...call, status: "ended" });

          const otherUserId = call.sender === userId ? call.receiver : call.sender;
          const otherSocketId = activeUsers.get(otherUserId);
          if (otherSocketId) {
            io.to(otherSocketId).emit("Call-Ended", { sender: userId });
          }

          console.log(`❌ Disconnected user ended call ${callId}`);
        }
      }
    });
 
   } catch (error) {
    console.log("socket cash all code check problem");
    
    }
     });
};


  

module.exports =obj ;

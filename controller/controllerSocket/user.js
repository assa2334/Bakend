// In your user controller (controllerSocket/user.js)

const UserModel = require('../../model/User');
const conversation = require('../../model/conversation');
const sendToUserFunc = require('../../router/socket')
const messageSchema = require('../../model/Message');
const user = {
    statusChangeOnline: async (userId) => {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        online: "active",
                        lastActive: new Date()
                    }
                },
                { new: true } // Return the updated document
            );

            if (!updatedUser) {
                console.log(`User ${userId} not found for online status update`);
                return { success: false, message: "User not found" };
            }

            console.log(`User ${userId} status updated to online`);
            return { success: true, message: "User is now online", user: updatedUser };
        } catch (error) {
            console.error("Error updating to online status:", error);
            return { success: false, message: "Database error" };
        }
    },

    statusChangeOffline: async (userId) => {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        online: "inactive", // Changed from "deactive" to more standard "inactive"
                        lastActive: new Date()
                    }
                },
                { new: true }
            );

            if (!updatedUser) {
                console.log(`User ${userId} not found for offline status update`);
                return { success: false, message: "User not found" };
            }

            console.log(`User ${userId} status updated to offline`);
            return { success: true, message: "User is now offline", user: updatedUser };
        } catch (error) {
            console.error("Error updating to offline status:", error);
            return { success: false, message: "Database error" };
        }
    },

    StrogeCallHistor: async (sender, receiver, Type, callStartTime, callEndTime, callDuration, sendToUser) => {
        console.log("Storing call history for sender:", sender, "receiver:", receiver, "type:", Type ,"Call Start Time:", callStartTime, "Call End Time:", callEndTime, "Call Duration:", callDuration);
        try {
            // Step 1: Find the conversation between sender and receiver
            const key = [sender, receiver].sort().join('_');
            console.log('Conversation key:', key);

            const conversationDoc = await conversation.findOne({ conversation: key });

            if (!conversationDoc) {
                console.error('Conversation not found');
                return { success: false, message: 'Conversation not found' };
            }

            // Step 2: Create a new call message
            const newCall = new messageSchema({
                sender,
                recipient: receiver,
                conversation: conversationDoc._id,
                isCall: true,
                messageType: Type,
                callDetails: {
                    callType: Type,
                    callStartTime,
                    callEndTime,
                    callDuration,
                },
            });

            const savedCall = await newCall.save();
            sendToUser(receiver, {
                    type: 'new_message',
                    data: savedCall
                })
            sendToUser(sender, {
                    type: 'new_message',
                    data: savedCall
                })
            
            return { success: true, message: "Call history saved", data: savedCall };
        } catch (error) {
            console.error("❌ Error saving call history:", error);
            return { success: false, message: "Internal server error", error };
        }
    }

};

module.exports = user;
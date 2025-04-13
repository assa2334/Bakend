// In your user controller (controllerSocket/user.js)

const UserModel = require('../../model/User');

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
    }
};

module.exports = user;
const UserModel = require('../../model/User'); // Import your User model

const user = {};

user.statusChangeOnline = async (userId) => {
    try {
        // Find user by ID
        let findUser = await UserModel.findOne({ _id: userId });

        if (!findUser) {
            console.log(`User with ID ${userId} not found.`);
            return { success: false, message: "User not found" };
        }

        // Update status
        findUser.online = "active";
        findUser.lastdata = new Date();

        // Save the updated user
        await findUser.save();
        console.log(`User ${userId} is now online.`);

        return { success: true, message: "User status updated" };
    } catch (error) {
        console.error("Error updating user status:", error);
        return { success: false, message: "Internal server error" };
    }
};
user.statusChangeOffline = async (userId) => {
    try {
        // Find user by ID
        let findUser = await UserModel.findOne({ _id: userId });

        if (!findUser) {
            console.log(`User with ID ${userId} not found.`);
            return { success: false, message: "User not found" };
        }

        // Update status
        findUser.online = "deactive";
        findUser.lastdata = new Date();

        // Save the updated user
        await findUser.save();
        console.log(`User ${userId} is now online.`);

        return { success: true, message: "User status updated" };
    } catch (error) {
        console.error("Error updating user status:", error);
        return { success: false, message: "Internal server error" };
    }
};

module.exports = user;

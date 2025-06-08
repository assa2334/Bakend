const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
conversation:{type:mongoose.Schema.Types.ObjectId,ref:'conversation', required:true},
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to sender
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to recipient
  text: { type: String },  // Optional, used for text-based messages
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },  // Message read status
  
  
  // New fields for media and call details
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'file', 'call'],
    default: 'text',
  },
  mediaUrl: { type: String },  // URL for media (image/video/file)
  
  // Fields for call functionality
  isCall: { type: Boolean, default: false },  // Identifies if the message is a call
  callDetails: {
    callType: { type: String, enum: ['voice', 'video'], required: false },  // Type of call
    callStartTime: { type: Date },  // Start time of the call
    callEndTime: { type: Date },  // End time of the call
    callDuration: { type: Number },  // Duration of the call in seconds
  },
});



module.exports = mongoose.model('Message', messageSchema);


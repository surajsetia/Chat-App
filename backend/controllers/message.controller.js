import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id; // Assuming protectRoute middleware attaches user to req

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      conversationId: conversation._id,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // Socket.io integration can be added here to emit the new message to the receiver in real-time

    /*await newMessage.save();
    await conversation.save(); */

    await Promise.all([newMessage.save(), conversation.save()]); // Save both concurrently

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error sending message:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { id: userToChatI } = req.params;
    const senderId= req.user._id;


    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatI] },
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json([]);
    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error fetching messages:", error.message);
    res.status(500).json({ error: "Server error" });
  }
}; 
const { getChatResponse } = require('../services/groqService');
const Chat = require('../models/Chat');

// @desc    Chat with AI Companion
// @route   POST /api/chat/message
// @access  Public (Optional Auth)
const chatHandler = async (req, res) => {
  const { message, context, userId } = req.body;

  if (!message) {
      return res.status(400).json({ error: "Message is required" });
  }

  // 1. Get AI Response
  // If user is logged in, we can fetch their past chat history to build context
  let historyContext = context || [];
  
  if (userId) {
      try {
        let chat = await Chat.findOne({ userId });
        if (chat) {
            // Get last 5 messages for context
            const lastMsgs = chat.messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
            historyContext = [...lastMsgs, ...historyContext];
        }
      } catch (err) {
          console.error("Error fetching chat history", err);
      }
  }

  const response = await getChatResponse(message, historyContext);
  
  // 2. Persist to MongoDB if userId is present AND saveToHistory is true (default true)
  if (userId && req.body.saveToHistory !== false) {
      try {
          let chat = await Chat.findOne({ userId });
          if (!chat) {
              chat = await Chat.create({ userId, messages: [] });
          }
          chat.messages.push({ role: 'user', content: message });
          chat.messages.push({ role: 'assistant', content: response });
          await chat.save();
      } catch (err) {
          console.error("Error saving chat", err);
      }
  }
  
  // Simulate delay for "thinking" animation in frontend if in mock mode
  if (!process.env.GROQ_API_KEY) {
      setTimeout(() => {
          res.json({ reply: response });
      }, 1000);
  } else {
      res.json({ reply: response });
  }
};

// @desc    Get Chat History
// @route   GET /api/chat/history?userId=xxx
// @access  Public (Optional Auth)
const getChatHistory = async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.json([]); 
    }

    try {
        const chat = await Chat.findOne({ userId });
        if (chat) {
            res.json(chat.messages);
        } else {
            res.json([]);
        }
    } catch (err) {
        console.error("Error fetching history", err);
        res.status(500).json({ message: "Failed to fetch history" });
    }
};

const deleteChatHistory = async (req, res) => {
    const { userId } = req.query;
    try {
        await Chat.findOneAndDelete({ userId });
        res.json({ message: "Chat history cleared" });
    } catch (err) {
        console.error("Error clearing history", err);
        res.status(500).json({ error: "Failed to clear history" });
    }
};

// @desc    Delete a specific message
// @route   DELETE /api/chat/message/:msgId
// @access  Private
const deleteChatMessage = async (req, res) => {
    const { userId } = req.query;
    const { msgId } = req.params;

    try {
        await Chat.updateOne(
            { userId },
            { $pull: { messages: { _id: msgId } } }
        );
        res.json({ message: "Message deleted" });
    } catch (err) {
        console.error("Error deleting message", err);
        res.status(500).json({ error: "Failed to delete message" });
    }
};

module.exports = { chatHandler, getChatHistory, deleteChatHistory, deleteChatMessage };

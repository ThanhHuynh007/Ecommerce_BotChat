const ChatbotService = require("../services/ChatbotService");

const chatWithBot = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({
      status: "ERR",
      message: "Message is required",
    });
  }

  const response = await ChatbotService.askGemini(message);
  return res.status(200).json(response);
};

module.exports = { chatWithBot };

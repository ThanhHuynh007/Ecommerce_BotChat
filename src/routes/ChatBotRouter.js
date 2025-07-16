const express = require("express");
const router = express.Router();
const { chatWithBot } = require("../controller/ChatbotController");

router.post("/", chatWithBot); // ✅ sửa lại từ /chatbot → /

module.exports = router;

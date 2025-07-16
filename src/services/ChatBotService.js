import axios from "axios";

export const sendMessageToBot = async (message) => {
  const res = await axios.post("http://localhost:3001/api/chatbot", { message });
  return res.data.reply;
};

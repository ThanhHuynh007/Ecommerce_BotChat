const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askGemini = async (question) => {
  try {
    const questionTrimmed = (question || '').trim();
    if (!questionTrimmed) {
      return {
        status: "ERR",
        message: "Empty question provided.",
      };
    }

    // Danh sách sản phẩm mẫu (có thể thay bằng truy vấn DB)
    const products = [
      "iPhone 16 – 19 triệu",
      "Laptop với tầm giá 17 – 18 triệu",
      "Samsung A14 – 4.5 triệu",
      "Realme C55 – 4.2 triệu",
    ].join('\n');

    const prompt = `
Bạn là một trợ lý bán hàng thông minh của cửa hàng điện thoại XCenter.

Dưới đây là danh sách sản phẩm hiện có:
${products}

Nhiệm vụ:
- Gợi ý sản phẩm phù hợp theo tiêu chí người dùng (giá rẻ, hiệu năng, thương hiệu)
- Trả lời ngắn gọn, thân thiện, dễ hiểu bằng tiếng Việt
- Nếu không rõ nhu cầu, hãy hỏi lại

Câu hỏi khách hàng:
"${questionTrimmed}"

Hãy phản hồi tự nhiên như người thật.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      status: "OK",
      message: "SUCCESS",
      reply: text,
    };
  } catch (err) {
    console.error("Gemini Error:", err?.response?.data || err.message || err);
    return {
      status: "ERR",
      message: "Gemini API failed",
    };
  }
};

module.exports = { askGemini };

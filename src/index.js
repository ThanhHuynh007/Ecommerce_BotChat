const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Tăng giới hạn payload lên 10MB
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// ✅ Cấu hình CORS đúng cách
app.use(cors({
  origin: 'http://localhost:3000',  // Gốc của frontend React
  credentials: true                 // Cho phép gửi cookie, Authorization token
}));

app.use(cookieParser());

routes(app);

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connect Db success");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

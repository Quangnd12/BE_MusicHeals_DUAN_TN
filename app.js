const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const userRoutes = require("./src/routes/userRoutes");
const helmet = require("helmet");

dotenv.config();

const app = express();

// Cấu hình bảo mật HTTP headers
app.use(helmet());

// Cấu hình CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Dùng biến môi trường cho client URL
    credentials: true, // Cho phép gửi cookie và thông tin xác thực
  })
);

// Middleware logging
app.use(morgan("dev"));

// Body parser để parse request body JSON
app.use(bodyParser.json());

// Xử lý cookie
app.use(cookieParser());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Xử lý lỗi 404 (Not Found)
app.use((req, res, next) => {
  res.status(404).json({
    message: "Không tìm thấy trang yêu cầu.",
  });
});

// Xử lý lỗi 500 (Server Error)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log lỗi chi tiết
  res.status(500).json({
    message: "Có lỗi xảy ra từ server. Vui lòng thử lại sau.",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/api`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});

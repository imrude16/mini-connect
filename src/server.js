import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./infrastructure/database/connectDB.js";
import { initSocket } from "./infrastructure/socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Create HTTP server from Express app
    const server = http.createServer(app);

    // 3️⃣ Initialize Socket.IO on same server
    initSocket(server);

    // 4️⃣ Start listening
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

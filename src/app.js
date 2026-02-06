import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.route.js";
import profileRoutes from "./modules/profile/profile.route.js";
import postRoutes from "./modules/post/post.route.js";
import commentRoutes from "./modules/comment/comment.route.js";
import notificationRoutes from "./modules/notification/notification.route.js";
import feedRoutes from "./modules/feed/feed.route.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

/* Global Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// serve uploaded files statically
app.use("/uploads", express.static("uploads"));


/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);
app.use("/api", notificationRoutes);
app.use("/api", feedRoutes);


/* Health Check */
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running 🚀" });
});

export default app;

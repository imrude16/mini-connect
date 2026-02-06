import express from "express";
import authMiddleware from "../../common/middlewares/auth.middleware.js";
import upload from "../../infrastructure/storage/multer.config.js";
import { createPostController , toggleLikeController , getAllPostsController } from "./post.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createPostController
);

router.post(
  "/:postId/like",
  authMiddleware,
  toggleLikeController
);

router.get(
  "/",
  authMiddleware,
  getAllPostsController
);


export default router;

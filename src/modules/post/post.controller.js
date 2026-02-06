import fs from "fs";
import { createPostSchema } from "./post.validation.js";
import { createPostService , toggleLikeService , getAllPostsService } from "./post.service.js";

export const createPostController = async (req, res) => {
  try {
    // 1️⃣ Validate body
    const { error } = createPostSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    // 2️⃣ Ensure image exists
    if (!req.file) {
      return res.status(400).json({
        message: "Post image is required"
      });
    }

    // 3️⃣ Create post
    const post = await createPostService({
      userId: req.userId,
      caption: req.body.caption,
      image: req.file.path
    });

    res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (err) {

    // 🧹 Clean up file if something fails
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    res.status(400).json({
      message: err.message
    });
  }
};

export const toggleLikeController = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const result = await toggleLikeService({
      postId,
      userId
    });

    res.status(200).json({
      message: result.liked ? "Post liked" : "Post unliked",
      likesCount: result.likesCount
    });

  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

export const getAllPostsController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getAllPostsService({ page, limit });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


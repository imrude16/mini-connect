import mongoose from "mongoose";
import Post from "./post.model.js";
import { createNotificationService }
  from "../notification/notification.service.js";

/*
  SERVICE: Create Post
*/
export const createPostService = async ({ userId, caption, image }) => {
  return Post.create({
    userId,
    caption,
    image
  });
};

/*
  SERVICE: Toggle Like / Unlike Post
  - Prevents duplicate likes
  - Handles ObjectId comparison safely
  - ALWAYS returns a result
*/
export const toggleLikeService = async ({ postId, userId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(postId).session(session);

    if (!post) {
      throw new Error("Post not found");
    }

    const hasLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (hasLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);

      if (post.userId.toString() !== userId.toString()) {
        await createNotificationService({
          userId: post.userId,
          type: "LIKE",
          message: "Someone liked your post",
          referenceId: post._id,
          session   // 🔑 pass session
        });
      }
    }

    await post.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      liked: !hasLiked,
      likesCount: post.likes.length
    };

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/*
  SERVICE: Get all posts
*/
export const getAllPostsService = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "userId",
      select: "email"
    })
    .populate({
      path: "likes",
      select: "email"
    });

  const totalPosts = await Post.countDocuments();

  return {
    page,
    limit,
    totalPosts,
    totalPages: Math.ceil(totalPosts / limit),
    posts
  };
};


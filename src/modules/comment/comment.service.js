import mongoose from "mongoose";
import Comment from "./comment.model.js";
import Post from "../post/post.model.js";
import { createNotificationService }
  from "../notification/notification.service.js";

/*
  SERVICE: Add Comment to Post
*/
export const addCommentService = async ({ postId, userId, text }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const postExists = await Post.findById(postId).session(session);
    if (!postExists) throw new Error("Post not found");

    const comment = await Comment.create(
      [{ postId, userId, text }],
      { session }
    );

    if (postExists.userId.toString() !== userId.toString()) {
      await createNotificationService({
        userId: postExists.userId,
        type: "COMMENT",
        message: "Someone commented on your post",
        referenceId: postId,
        session
      });
    }

    await session.commitTransaction();
    session.endSession();

    return comment[0];

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/*
  SERVICE: Delete Comment (Ownership Check)
*/
export const deleteCommentService = async ({ commentId, userId }) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  // ownership check
  if (comment.userId.toString() !== userId.toString()) {
    throw new Error("Not authorized to delete this comment");
  }

  await comment.deleteOne();
};

/*
  SERVICE: Add Reply to Comment
*/
export const addReplyService = async ({
  postId,
  parentCommentId,
  userId,
  text
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parentComment = await Comment.findById(parentCommentId).session(session);
    if (!parentComment) throw new Error("Parent comment not found");

    const reply = await Comment.create(
      [{ postId, parentCommentId, userId, text }],
      { session }
    );

    if (parentComment.userId.toString() !== userId.toString()) {
      await createNotificationService({
        userId: parentComment.userId,
        type: "REPLY",
        message: "Someone replied to your comment",
        referenceId: parentCommentId,
        session
      });
    }

    await session.commitTransaction();
    session.endSession();

    return reply[0];

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};


/*
  SERVICE: Get All Comments for a Post
*/
export const getCommentsByPostService = async ({
  postId,
  page = 1,
  limit = 5
}) => {
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ postId })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "userId",
      select: "email"
    });

  const totalComments = await Comment.countDocuments({ postId });

  return {
    page,
    limit,
    totalComments,
    totalPages: Math.ceil(totalComments / limit),
    comments
  };
};


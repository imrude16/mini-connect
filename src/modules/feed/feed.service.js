import Post from "../post/post.model.js";
import mongoose from "mongoose";

export const getFeedService = async ({
  userId,
  page = 1,
  limit = 5,
  search,
  authorId,
  sort = "latest",
  from,
  to
}) => {
  const skip = (page - 1) * limit;

  const matchStage = {};

  // 🔎 Search by caption
  if (search) {
    matchStage.caption = {
      $regex: search,
      $options: "i"
    };
  }

  // 👤 Filter by author
  if (authorId) {
    matchStage.userId = new mongoose.Types.ObjectId(authorId);
  }

  // 📅 Date range filter
  if (from || to) {
    matchStage.createdAt = {};
    if (from) matchStage.createdAt.$gte = new Date(from);
    if (to) matchStage.createdAt.$lte = new Date(to);
  }

  // 🔃 Sorting
  const sortStage =
    sort === "oldest"
      ? { createdAt: 1 }
      : { createdAt: -1 };

  const feed = await Post.aggregate([
    { $match: matchStage },
    { $sort: sortStage },
    { $skip: skip },
    { $limit: limit },

    // join author
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author"
      }
    },
    { $unwind: "$author" },

    // join profile
    {
      $lookup: {
        from: "profiles",
        localField: "userId",
        foreignField: "userId",
        as: "profile"
      }
    },
    {
      $unwind: {
        path: "$profile",
        preserveNullAndEmptyArrays: true
      }
    },

    // likes info
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        likedByMe: {
          $in: [
            new mongoose.Types.ObjectId(userId),
            "$likes"
          ]
        }
      }
    },

    // join comments
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments"
      }
    }
  ]);

  const totalPosts = await Post.countDocuments(matchStage);

  return {
    page,
    limit,
    totalPosts,
    totalPages: Math.ceil(totalPosts / limit),
    feed
  };
};
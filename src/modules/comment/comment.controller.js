import { addCommentSchema , replySchema} from "./comment.validation.js";
import {
  addCommentService,
  deleteCommentService,
  addReplyService,
  getCommentsByPostService
} from "./comment.service.js";

export const addCommentController = async (req, res) => {
  try {
    const { error } = addCommentSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const comment = await addCommentService({
      postId: req.params.postId,
      userId: req.userId,
      text: req.body.text
    });

    res.status(201).json({
      message: "Comment added",
      comment
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCommentController = async (req, res) => {
  try {
    await deleteCommentService({
      commentId: req.params.commentId,
      userId: req.userId
    });

    res.status(200).json({
      message: "Comment deleted"
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addReplyController = async (req, res) => {
  try {
    const { error } = replySchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const reply = await addReplyService({
      postId: req.params.postId,
      parentCommentId: req.params.commentId,
      userId: req.userId,
      text: req.body.text
    });

    res.status(201).json({
      message: "Reply added",
      reply
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCommentsByPostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const result = await getCommentsByPostService({
      postId,
      page,
      limit
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


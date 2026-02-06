import express from "express";
import authMiddleware from "../../common/middlewares/auth.middleware.js";
import {
  addCommentController,
  deleteCommentController,
  addReplyController ,
  getCommentsByPostController
} from "./comment.controller.js";

const router = express.Router();

// add comment to post
router.post(
  "/posts/:postId/comments",
  authMiddleware,
  addCommentController
);

// delete own comment
router.delete(
  "/comments/:commentId",
  authMiddleware,
  deleteCommentController
);

router.post(
  "/posts/:postId/comments/:commentId/replies",
  authMiddleware,
  addReplyController
);

router.get(
  "/posts/:postId/comments",
  authMiddleware,
  getCommentsByPostController
);


export default router;

/* 

| Action               | Route                                        | ID Used            |
| -------------------- | -------------------------------------------- | ------------------ |
| Add comment          | `/posts/:postId/comments`                    | postId             |
| Reply                | `/posts/:postId/comments/:commentId/replies` | postId + commentId |
| Delete comment/reply | `/comments/:commentId`                       | commentId          |

*/

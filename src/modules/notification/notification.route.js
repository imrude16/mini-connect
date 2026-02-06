import express from "express";
import authMiddleware from "../../common/middlewares/auth.middleware.js";
import {
  getNotificationsController,
  markAsReadController
} from "./notification.controller.js";

const router = express.Router();

router.get(
  "/notifications",
  authMiddleware,
  getNotificationsController
);

router.patch(
  "/notifications/:notificationId/read",
  authMiddleware,
  markAsReadController
);

export default router;

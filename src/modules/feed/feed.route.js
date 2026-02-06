import express from "express";
import authMiddleware from "../../common/middlewares/auth.middleware.js";
import { getFeedController } from "./feed.controller.js";

const router = express.Router();

router.get(
  "/feed",
  authMiddleware,
  getFeedController
);

export default router;

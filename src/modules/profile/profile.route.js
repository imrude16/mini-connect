import express from "express";
import { createProfileController } from "./profile.controller.js";
import authMiddleware from "../../common/middlewares/auth.middleware.js";
import upload from "../../infrastructure/storage/multer.config.js";

const router = express.Router();

// POST /api/profile
router.post("/", authMiddleware, upload.single("profilePic"), createProfileController);

export default router;

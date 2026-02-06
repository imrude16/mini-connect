import fs from "fs";
import { profileSchema } from "./profile.validation.js";
import { createProfile } from "./profile.service.js";

/*
  CONTROLLER: Create Profile
*/
export const createProfileController = async (req, res) => {
  try {
    // Step 1: Validate request body
    const { error } = profileSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    // Step 2: Extract userId (from JWT middleware)
    const userId = req.userId;

    // Step 3: Call service to create profile
    const profile = await createProfile({
      userId,
      data: req.body,
      profilePic: req.file ? req.file.path : null
    });

    // Step 4: Send success response
    res.status(201).json({
      message: "Profile created successfully",
      profileId: profile._id
    });

  } catch (err) {

    // 🧹 SOLUTION 1: CLEAN UP UPLOADED FILE ON FAILURE
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete uploaded file:", unlinkErr);
        }
      });
    }

    res.status(400).json({
      message: err.message
    });
  }
};

import Profile from "./profile.model.js";

/*
  SERVICE: Create Profile
  This handles business logic only
*/
export const createProfile = async ({ userId, data, profilePic }) => {

  // Step 1: Check if profile already exists
  const existingProfile = await Profile.findOne({ userId });

  if (existingProfile) {
    throw new Error("Profile already exists");
  }

  // Step 2: Create profile document
  const profile = await Profile.create({
    userId,
    ...data,
    profilePic
  });

  // Step 3: Return created profile
  return profile;
};

import { Schema , model } from "mongoose";

/*
  Profile Schema
  One profile belongs to ONE user
*/
const profileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",        // relation with User collection
      required: true,
      unique: true        // one-to-one relation
    },

    fullName: {
      type: String,
      required: true
    },

    dob: {
      type: Date,
      required: true
    },

    mobile: {
      type: String,
      required: true
    },

    address: {
      landmark: String,
      area: String,
      pincode: String,
      city: String,
      state: String
    },

    bio: {
      type: String,
      required: true,
      maxlength: 100
    },

    profilePic: {
      type: String,       // file path / URL
      default: null
    }
  },
  { timestamps: true }
);

const Profile = model("Profile", profileSchema);
export default Profile;

import { Schema , model } from "mongoose";

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    caption: {
      type: String,
      trim: true
    },

    image: {
      type: String,
      required: true
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

export default model("Post", postSchema);
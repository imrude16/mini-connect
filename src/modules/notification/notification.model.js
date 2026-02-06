import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["LIKE", "COMMENT", "REPLY"],
      required: true
    },

    message: {
      type: String,
      required: true
    },

    referenceId: {
      type: Schema.Types.ObjectId
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default model("Notification", notificationSchema);

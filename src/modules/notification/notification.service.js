import Notification from "./notification.model.js";
import { emitNotification } 
  from "../../infrastructure/socket/socket.js";


export const createNotificationService = async ({
  userId,
  type,
  message,
  referenceId,
  session
}) => {
  const notification = await Notification.create(
    [{
      userId,
      type,
      message,
      referenceId
    }],
    { session }
  );

  emitNotification(userId, notification[0]);

  return notification[0];
};



export const getUserNotificationsService = async ({
  userId,
  page = 1,
  limit = 10
}) => {
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments({ userId });

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    notifications
  };
};


export const markNotificationReadService = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    userId
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  notification.isRead = true;
  await notification.save();

  return notification;
};

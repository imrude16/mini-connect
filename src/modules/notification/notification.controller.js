import {
  getUserNotificationsService,
  markNotificationReadService
} from "./notification.service.js";

export const getNotificationsController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getUserNotificationsService({
      userId: req.userId,
      page,
      limit
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const markAsReadController = async (req, res) => {
  try {
    const notification = await markNotificationReadService(
      req.params.notificationId,
      req.userId
    );

    res.status(200).json({
      message: "Notification marked as read",
      notification
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

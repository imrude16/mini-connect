import { getFeedService } from "./feed.service.js";

export const getFeedController = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      userId: authorId,
      sort,
      from,
      to
    } = req.query;

    const result = await getFeedService({
      userId: req.userId,
      page: Number(page) || 1,
      limit: Number(limit) || 5,
      search,
      authorId,
      sort,
      from,
      to
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
import { Request, Response } from "express";
import {
  countReviewsByStore,
  getRatingDistribution,
  sumRatingByStore,
} from "../../repository/ReviewRepository";

const getReviewStatsController = async (req: Request, res: Response) => {
  const storeId = Number(req.params.storeId);

  if (isNaN(storeId)) {
    return res.status(400).json({ message: "Invalid storeId" });
  }

  try {
    const [reviewsCount, totalRatingResult, ratingDistribution] =
      await Promise.all([
        countReviewsByStore(storeId),
        sumRatingByStore(storeId),
        getRatingDistribution(storeId),
      ]);

    const averageRating =
      reviewsCount > 0 && totalRatingResult._sum.rating !== null
        ? totalRatingResult._sum.rating / reviewsCount
        : 0;

    return res
      .status(200)
      .json({ ratingDistribution, averageRating, reviewsCount });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch store stats" });
  }
};
export default getReviewStatsController;

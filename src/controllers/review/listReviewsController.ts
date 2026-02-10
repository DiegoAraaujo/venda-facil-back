import { Request, Response } from "express";
import {
  countReviewsByStore,
  findReviewsByStore,
} from "../../repository/ReviewRepository";

const listReviewsController = async (req: Request, res: Response) => {
  const storeId = Number(req.query.storeId);

  if (isNaN(storeId)) {
    return res.status(400).json({ message: "Invalid storeId" });
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const perPage = Math.min(Number(req.query.perPage) || 10, 20);
  const skip = (page - 1) * perPage;

  try {
    const [reviews, totalReviews] = await Promise.all([
      findReviewsByStore(storeId, skip, perPage),
      countReviewsByStore(storeId),
    ]);
    const totalPages = Math.ceil(totalReviews / perPage);

    return res.status(200).json({
      data: reviews,
      meta: {
        totalReviews,
        page,
        perPage,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch{
    return res.status(500).json({
      message: "Error searching for store reviews.",
    });
  }
};

export default listReviewsController;

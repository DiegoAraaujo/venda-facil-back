import { Request, Response } from "express";
import { findLatestReviews } from "../../repository/ReviewRepository";

const getLatest3ReviewsController = async (req: Request, res: Response) => {
  const storeId = Number(req.params.storeId);
  if (isNaN(storeId)) {
    return res.status(400).json({ message: "Invalid storeId" });
  }

  try {
    const reviews = await findLatestReviews(storeId);
    return res.status(200).json(reviews);
  } catch {
    return res.status(500).json({
      message: "Error retrieving the store's last 3 reviews.",
    });
  }
};

export default getLatest3ReviewsController;

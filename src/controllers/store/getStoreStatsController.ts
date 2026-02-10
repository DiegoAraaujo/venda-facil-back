import { Request, Response } from "express";
import { countProducts } from "../../repository/ProductRepository";
import { countSales } from "../../repository/PurchaseRepository";
import {
  countReviewsByStore,
  sumRatingByStore,
} from "../../repository/ReviewRepository.js";

const getStoreStatsController = async (req: Request, res: Response) => {
  const storeId = Number(req.params.storeId);

  if (isNaN(storeId)) {
    return res.status(400).json({ message: "Store ID inválido" });
  }

  try {
    const [productCount, salesCount, ratingTotal, reviewsCount] =
      await Promise.all([
        countProducts(storeId),
        countSales(storeId),
        sumRatingByStore(storeId),
        countReviewsByStore(storeId),
      ]);

    const averageRating =
      reviewsCount > 0 && ratingTotal._sum.rating !== null
        ? ratingTotal._sum.rating / reviewsCount
        : 0;

    return res.status(200).json({
      productCount,
      salesCount,
      reviewsCount,
      rating: averageRating,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving store status." });
  }
};

export default getStoreStatsController;

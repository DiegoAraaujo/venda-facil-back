import { Request, Response } from "express";
import { deleteFileFromS3 } from "../../utils/s3";
import { createReviewByStore } from "../../repository/ReviewRepository";
import { reviewSchema } from "../../utils/validation";
import { MulterS3File } from "../../types/multer-s3-file";

const createReviewController = async (req: Request, res: Response) => {
  const storeId = Number(req.params.storeId);

  if (isNaN(storeId)) {
    return res.status(400).json({ message: "Invalid storeId" });
  }

  const { value, error } = reviewSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: error.details.map((e) => e.message),
    });
  }

  const file = req.file as MulterS3File | undefined;

  if (file) value.profile_photo = file.location;

  try {
    const review = await createReviewByStore(storeId, value);
    return res.status(201).json(review);
  } catch (error) {
    if (file) {
      await deleteFileFromS3(file.key);
    }
    return res.status(500).json({
      message: "Error creating store review.",
    });
  }
};

export default createReviewController;

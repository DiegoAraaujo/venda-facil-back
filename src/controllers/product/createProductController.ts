import { Request, Response } from "express";
import { ProductSchema } from "../../utils/validation";
import { MulterS3File } from "../../types/multer-s3-file";
import { addImages } from "../../repository/ImageRepository";
import { deleteFileFromS3 } from "../../utils/s3";
import { createProduct } from "../../repository/ProductRepository";

const createProductController = async (req: Request, res: Response) => {
  const storeId = Number(req.storeId);

  if (req.body.variants && typeof req.body.variants === "string") {
    req.body.variants = JSON.parse(req.body.variants);
  }

  const { value, error } = ProductSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: error.details.map((e) => e.message),
    });
  }

  const files = req.files as MulterS3File[];

  if (!files || files.length === 0) {
    return res.status(400).json({
      message: "At least one image is required",
    });
  }

  if (files.length > 6) {
    return res.status(400).json({
      message: "Maximum of 6 images allowed",
    });
  }

  try {
    const product = await createProduct(storeId, value);

    const images = files.map((file, index) => ({
      url: file.location,
      is_cover: index === 0,
    }));

    const imgs = await addImages(product.id, images);

    return res.status(201).json({ ...product, images: imgs });
  } catch (error) {
    if (files) {
      await Promise.all(files.map((file) => deleteFileFromS3(file.key)));
    }

    return res.status(500).json({
      message: "Error while creating product",
    });
  }
};

export default createProductController;

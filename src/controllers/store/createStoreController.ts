import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

import { storeSchema } from "../../utils/validation";
import { MulterFiles } from "../../types/store";
import { MulterS3File } from "../../types/multer-s3-file";
import { createCategory } from "../../repository/CategoryRepository";
import { createSubcategory } from "../../repository/SubcategoryRepository";
import { deleteFileFromS3 } from "../../utils/s3";
import { createStore } from "../../repository/StoreRepository.js";

export const createStoreController = async (req: Request, res: Response) => {
  if (req.body.categories && typeof req.body.categories === "string") {
    try {
      req.body.categories = JSON.parse(req.body.categories);
    } catch (error) {
      return res.status(400).json({ message: "Categories are required." });
    }
  }

  const { value, error } = storeSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: error.details.map((e) => e.message),
    });
  }

  const files = req.files as MulterFiles;

  if (!files?.banner || !files?.profile_photo) {
    return res.status(400).json({
      message: "It is mandatory to submit the banner and profile picture.",
    });
  }

  const banner = files.banner[0] as MulterS3File;
  const profile = files.profile_photo[0] as MulterS3File;

  try {
    const hashedPassword = await bcrypt.hash(value.password, 10);
    const {
      email,
      name,
      description,
      whatsApp,
      instagram,
      address,
      business_hours,
    } = value;

    const storePayload = {
      email,
      password: hashedPassword,
      name,
      description,
      whatsApp,
      instagram,
      address,
      business_hours,
      banner: banner.location,
      profile_photo: profile.location,
    };

    const newStore = await createStore(storePayload);

    if (Array.isArray(req.body.categories)) {
      for (const c of req.body.categories) {
        const category = await createCategory(newStore.id, c.value);
        if (Array.isArray(c.subCategories) && c.subCategories.length > 0) {
          await Promise.all(
            c.subCategories.map((sc: string) =>
              createSubcategory(category.id, sc),
            ),
          );
        }
      }
    }

    return res.status(201).json(newStore);
  } catch (err: unknown) {
    await deleteFileFromS3(banner.key);
    await deleteFileFromS3(profile.key);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const target = err.meta?.target as string[] | undefined;
      const field = target?.[0];

      return res.status(409).json({
        code: "UNIQUE_CONSTRAINT",
        field,
      });
    }

    return res.status(500).json({
      message: "error when creating store",
    });
  }
};

export default createStoreController;

import { Request, Response } from "express";
import { findStoreById } from "../../repository/StoreRepository";

const getStoreController = async (req: Request, res: Response) => {
  const storeId = Number(req.params.storeId);

  if (isNaN(storeId)) {
    return res.status(400).json({ message: "The 'storeId' field is required" });
  }

  try {
    const store = await findStoreById(storeId);

    if (!store) {
      return res.status(404).json({
        message: `No store found`,
      });
    }

    const storePublic = {
      id: store.id,
      name: store.name,
      description: store.description,
      banner: store.banner,
      profile_photo: store.profile_photo,
      instagram: store.instagram,
      whatsApp: store.whatsApp,
      address: store.address,
      business_hours: store.business_hours,
    };

    return res.status(200).json(storePublic);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the store." });
  }
};

export default getStoreController;

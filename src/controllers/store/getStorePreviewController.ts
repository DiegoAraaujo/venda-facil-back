import { Request, Response } from "express";
import { findStoreByName } from "../../repository/StoreRepository";
import { countProducts } from "../../repository/ProductRepository";

const getStorePreviewController = async (req: Request, res: Response) => {
  const { name } = req.params;

  if (!name.trim()) {
    return res.status(400).json({ message: "The 'name' field is required" });
  }

  try {
    const store = await findStoreByName(name.trim());
    if (!store) {
      return res.status(404).json({
        message: `No store found with the name ${name}.`,
      });
    }

    const productCount = await countProducts(store.id);

    const storePublic = {
      id: store.id,
      name: store.name,
      description: store.description,
      banner: store.banner,
      profile_photo: store.profile_photo,
      productCount,
    };

    return res.status(200).json(storePublic);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the store." });
  }
};

export default getStorePreviewController;

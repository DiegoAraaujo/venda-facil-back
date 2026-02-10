import { PurchaseStatus } from "@prisma/client";
import { Request, Response } from "express";
import { countOrders, getPurchaseByStoreId } from "../../repository/PurchaseRepository";

const listPurchasesController = async (req: Request, res: Response) => {
  const storeId = Number(req.storeId);
  const status = req.params.status;

  if (!status || !(status in PurchaseStatus)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const perPage = Math.min(Number(req.query.perPage) || 10, 20);
  const skip = (page - 1) * perPage;

  try {
    const [result, total] = await Promise.all([
      getPurchaseByStoreId(storeId, status as PurchaseStatus, skip, perPage),
      countOrders(storeId, status as PurchaseStatus),
    ]);

    const totalPages = Math.ceil(total / perPage);

    const formatted = result.map((p) => {
      return {
        id: p.id,
        buyerName: p.client.full_name,
        whatsApp: p.client.whatsApp,
        address: p.client.address,
        orderDate: p.created_at,
        status: p.status,
        items: p.items.map((item) => {
          const inStock = item.variant.stock >= item.quantity;

          return {
            id: item.id,
            variantId: item.variant.id,
            productName: item.variant.product.name,
            unitPrice: item.price,
            quantity: item.quantity,
            totalPrice: item.quantity * item.price,
            color: item.color,
            size: item.size,
            image: item.variant.product.images[0]?.url || null,
            inStock,
            avaliable:
              !item.variant.deleted_at && !item.variant.product.deleted_at,
          };
        }),
      };
    });

    return res.status(200).json({
      data: formatted,
      meta: {
        total,
        page,
        perPage,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export default listPurchasesController;
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { registerVisitRecord } from "../../repository/StoreRepository";
import { Prisma } from "@prisma/client";

const registerVisitController = async (req: Request, res: Response) => {
  const storeId = Number(req.params.storeId);
  if (isNaN(storeId))
    return res.status(400).json({ message: "Invalid store ID" });

  let visitorId = req.cookies.visitor_id;

  if (!visitorId) {
    visitorId = uuidv4();
    res.cookie("visitor_id", visitorId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  try {
    const today = new Date();
    const visitDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    await registerVisitRecord(visitorId, storeId, visitDate);

    return res.status(200).json({ success: true });
  } catch (err: any) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(200).json({ success: true });
    }

    return res.status(500).json({ success: false });
  }
};

export default registerVisitController;

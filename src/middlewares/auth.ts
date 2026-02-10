import { NextFunction, Request, Response } from "express";
import { verify } from "../utils/jwt";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token was not provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const { JWT_ACCESS_TOKEN_SECRET } = process.env;

    if (!JWT_ACCESS_TOKEN_SECRET)
      throw new Error("JWT_ACCESS_TOKEN_SECRET is not defined");

    const decoded = await verify(token, JWT_ACCESS_TOKEN_SECRET);

    const storeId = Number(decoded.storeId);

    if (!storeId || isNaN(storeId)) {
      return res.status(401).json({ message: "Invalid storeId in token" });
    }

    req.storeId = storeId;
    return next();
  } catch {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export default auth;

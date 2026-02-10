import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { loginSchema } from "../../utils/validation";
import { findStoreByEmail } from "../../repository/StoreRepository";
import { sign } from "../../utils/jwt";


const loginStoreController = async (req: Request, res: Response) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details.map((e) => e.message),
    });
  }

  const { email, password } = value;

  try {
    const store = await findStoreByEmail(email);

    if (!store) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, store.password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } = process.env;

    if (!JWT_ACCESS_TOKEN_SECRET || !JWT_REFRESH_TOKEN_SECRET)
      throw new Error("JWT secret key is not defined");

    const accessToken = await sign(
      { storeId: store.id },
      "5m",
      JWT_ACCESS_TOKEN_SECRET,
    );
    const refreshToken = await sign(
      { storeId: store.id },
      "7d",
      JWT_REFRESH_TOKEN_SECRET,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      data: {
        id: store.id,
        name: store.name,
        email: store.email,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default loginStoreController;

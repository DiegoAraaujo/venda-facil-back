import { Request, Response } from "express";
import { sign, verify } from "../../utils/jwt";

const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token was not provided" });
  }

  try {
    const { JWT_REFRESH_TOKEN_SECRET, JWT_ACCESS_TOKEN_SECRET } = process.env;

    if (!JWT_REFRESH_TOKEN_SECRET || !JWT_ACCESS_TOKEN_SECRET)
      throw new Error(
        "JWT_REFRESH_TOKEN_SECRET and JWT_ACCESS_TOKEN_SECRET are not defined",
      );

    const decoded = await verify(refreshToken, JWT_REFRESH_TOKEN_SECRET);

    const newAccessToken = await sign(
      { storeId: decoded.storeId },
      "5m",
      JWT_ACCESS_TOKEN_SECRET,
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch {
    return res
      .status(401)
      .json({ message: "Refresh token is invalid or expired" });
  }
};

export default refreshTokenController;

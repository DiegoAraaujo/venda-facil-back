import jwt from "jsonwebtoken";

export interface Payload {
  storeId: number;
}

export const sign = (
  payload: Payload,
  expiresIn: jwt.SignOptions["expiresIn"],
  jwtSecretKey: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecretKey, { expiresIn }, (error, token) => {
      if (error || !token) {
        return reject(error);
      }

      return resolve(token);
    });
  });
};

export const verify = (
  token: string,
  jwtSecretKey: string,
): Promise<Payload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecretKey, (error, decoded) => {
      if (error || !decoded) {
        return reject(error);
      }

      return resolve(decoded as Payload);
    });
  });
};

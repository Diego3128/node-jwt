import jwt from "jsonwebtoken";
import { type SignOptions } from "jsonwebtoken";

type ExpiresInType = SignOptions["expiresIn"];

export class JWTAdapter {
  //
  static generateJWT = async ({
    payload,
    duration = "1h",
  }: {
    payload: any;
    duration?: string;
  }): Promise<null | string> => {
    // transform jwt callback into a promise.
    // if token creation fails, promise is not rejected, promise is resolved but returning null
    return new Promise((resolve) => {
      jwt.sign(
        {
          data: payload,
        },
        "SEED",
        { expiresIn: duration as ExpiresInType },
        (error, token) => {
          if (error) return resolve(null);
          return resolve(token ?? null);
        }
      );
    });
  };
  //
  static validateJWT = async ({
    token,
  }: {
    token: string;
  }): Promise<any | null> => {
    //
    throw new Error("Not implemented");
  };
}

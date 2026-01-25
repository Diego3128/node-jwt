import { Request, Response, NextFunction } from "express";
import { JWTAdapter } from "../../config";
import { UserModel } from "../../data/mongo";
import { UserEntity } from "../../domain";
export class AuthMiddleware {
  static validateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    // validate authorization header
    const authorization = req.header("Authorization");
    if (!authorization)
      return res.status(401).json({ message: "No token provided" });
    // validate jwt
    if (!authorization?.startsWith("Bearer "))
      return res.status(401).json({ message: "Invalid authorization token" });

    const token = authorization?.split(" ").at(1) ?? "";

    try {
      // validate JWT
      const payload = await JWTAdapter.validateJWT<{
        id: string;
        iat: string;
        exp: string;
      }>({ token });

      if (!payload) return res.status(401).json({ message: "Invalid token" });
      // get user associated with the token
      const user = await UserModel.findById(payload.id);
      if (!user)
        return res.status(401).json({ message: "Invalid user or token" });

      //   todo: validate if the user is active. create new middleware

      // create user entity fromthe user model
      const userEntity = UserEntity.createFromObject(user);
      // add user to the req body
      req.body.user = userEntity;
      //   next middleware
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

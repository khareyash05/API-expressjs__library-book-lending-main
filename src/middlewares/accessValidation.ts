import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserType, ValidationRequest } from "../types/UserTypes";

export const verifyAccess = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const request = req as ValidationRequest;
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.split(" ")[1];

    const secret = process.env.JWT_ACCESS_SECRET!;
    jwt.verify(token, secret, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }
      request.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  // try {
  //   const decoded = jwt.verify(token, secret);
  //   if (typeof decoded !== "string") req.user = decoded as UserType;
  //   next();
  // } catch (error) {
  //   return res.status(403).json({ message: "Token is invalid" });
  // }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const request = req as ValidationRequest;
  const { authorization } = req.headers;
  if (!authorization || request.user.role !== "admin") {
    return res.status(401).json({ message: "You are not authorized" });
  }
  next();
};

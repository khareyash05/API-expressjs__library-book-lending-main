import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRequest } from "../types/UserTypes";

const prisma = new PrismaClient();

const accessTokenSecret = process.env.JWT_ACCESS_SECRET!;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET!;
const expiresIn = "1d";

export const tokenRefresh = async (req: Request, res: Response) => {
  const requestToken = req.body.refresh_token;
  if (!requestToken)
    return res
      .status(401)
      .json({
        message: "You are not authenticated",
        requestToken: requestToken,
      });

  const user = await prisma.user.findFirst({
    where: {
      refresh_token: requestToken,
    },
  });

  if (!user) return res.status(403).json({ message: "Invalid refresh token" });

  jwt.verify(
    requestToken,
    process.env.JWT_REFRESH_SECRET!,
    async (err: any, user: any) => {
      err && console.log(err);
      const newAccessToken = jwt.sign(user, accessTokenSecret, { expiresIn });
      const newRefreshToken = jwt.sign(user, refreshTokenSecret);

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          refresh_token: newRefreshToken,
        },
      });

      res.status(200).json({
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      });
    }
  );
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn });
    const refreshToken = jwt.sign(payload, refreshTokenSecret);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refresh_token: refreshToken,
      },
    });

    return res.status(200).json({
      message: "Login success",
      data: {
        ...user,
        refresh_token: refreshToken,
      },
      accessToken,
    });
  } else {
    return res.status(400).json({
      message: "Username or Password is wrong",
    });
  }
};

export const userAccount = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  const user = await prisma.user.findUnique({
    where: {
      id: request.user.id,
    },
    select: {
      id: true,
      email: true,
      role: true,
      member: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  res.json({ data: user });
};

export const logout = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  const user = await prisma.user.findUnique({
    where: {
      id: request.user.id,
    },
    select: {
      id: true,
      refresh_token: true,
    },
  });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  await prisma.user.update({
    where: {
      id: request.user.id,
    },
    data: {
      refresh_token: null,
    },
  });
  res.status(200).json({ message: "Logout successfully" });
};

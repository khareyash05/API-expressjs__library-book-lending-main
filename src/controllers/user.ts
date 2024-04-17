import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { UserRequest } from "../types/UserTypes";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
        },
      });
      res.json({ message: "successfully get list of users", data: users });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin" || request.user.id == req.params.id) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: request.params.id,
        },
        include: {
          member: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
      });
      res.json({
        message: "successfully get user with id " + request.params.id,
        data: user,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({
      message: "You are not authorized",
      userparam: req.params.id,
      user: request.user,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, confirm_password } = req.body;
    if (password !== confirm_password)
      return res.status(400).json({ message: "password not match" });

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        role: "admin",
      },
    });
    res.json({
      message: "successfully create user with id " + user.id,
      data: user,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin" || request.user.id === req.params.id) {
    try {
      const { email, password } = request.body;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await prisma.user.update({
        where: {
          id: request.params.id,
        },
        data: {
          email,
          password: hashedPassword,
        },
      });
      res.json({
        message: "successfully update user with id " + request.params.id,
        data: user,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin" || request.user.id === req.params.id) {
    try {
      const member = await prisma.member.findUnique({
        where: {
          user_id: request.params.id,
        },
        select: {
          id: true,
          loans: {
            select: {
              status_id: true,
            },
          },
        },
      });

      if (member?.loans) {
        member.loans.map((loan) => {
          if (loan.status_id == "65fd4cccbb5355c26b8d7e4d") {
            return res
              .status(400)
              .json({ message: "user still have loan dependents" });
          }
        });
      }

      await prisma.user.delete({
        where: {
          id: request.params.id,
        },
      });

      const updateMember = await prisma.member.update({
        where: {
          id: member?.id,
        },
        data: {
          status: "deactived",
        },
      });

      res.json({
        message: "successfully delete user with id " + request.params.id,
        data: null,
        user_member: updateMember,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { UserRequest } from "../types/UserTypes";

const prisma = new PrismaClient();

export const getMembers = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      const members = await prisma.member.findMany({
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
          status: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      res.json({ message: "successfully get list of member", data: members });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const getMember = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin" || request.user.id == req.params.userId) {
    try {
      const member = await prisma.member.findUnique({
        where: {
          id: request.params.memberId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      if (member?.user?.id !== request.user.id) {
        return res.status(401).json({ message: "You are not authorized" });
      }
      res.json({
        message: "successfully get member with id " + request.params.memberId,
        data: member,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const createMember = async (req: Request, res: Response) => {
  try {
    const { name, email, address, phone, password, confirm_password } =
      req.body;

    const checkEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.status(400).json({ message: "email already exist" });
    }
    if (password !== confirm_password)
      return res.status(400).json({ message: "password not match" });

    const hashPassword = await bcrypt.hash(password, 10);

    const member = await prisma.member.create({
      data: {
        name,
        phone,
        address,
        status: "active",
        user: {
          create: {
            email,
            password: hashPassword,
            role: "member",
          },
        },
      },
      include: {
        user: true,
      },
    });
    res.json({
      message: "successfully create member with id " + member.id,
      data: member,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin" || request.user.id == req.params.userId) {
    try {
      const member = await prisma.member.update({
        where: {
          id: request.params.memberId,
        },
        data: {
          ...request.body,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      if (member?.user?.id !== request.user.id) {
        return res.status(401).json({ message: "You are not authorized" });
      }
      res.json({
        message:
          "successfully update member with id " + request.params.memberId,
        data: member,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    const member = await prisma.member.findUnique({
      where: {
        id: request.params.memberId,
      },
      select: {
        status: true,
        user: true,
      },
    });

    if (member?.user && member.status == "active") {
      return res.status(400).json({ message: "delete user account first" });
    }

    try {
      await prisma.member.delete({
        where: {
          id: request.params.memberId,
        },
      });
      res.json({
        message:
          "successfully delete member with id :" + request.params.memberId,
        data: null,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

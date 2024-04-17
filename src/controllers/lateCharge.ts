import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRequest } from "../types/UserTypes";

const prisma = new PrismaClient();

export const getLateCharges = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      const lateCharges = await prisma.late_charge.findMany({
        select: {
          id: true,
          total_delay: true,
          charge: true,
          is_paid: true,
          loan: {
            select: {
              id: true,
              member: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      res.json({ message: "successfully get late charges", data: lateCharges });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const getLateCharge = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
  try {
    const lateCharge = await prisma.late_charge.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        loan: {
          select: {
            id: true,
            due_date: true,
            return_date: true,
            member: {
              select: {
                name: true,
              },
            },
            book: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
    res.json({
      message: "successfully get late charge with id" + req.params.id,
      data: lateCharge,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const createLateCharge = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      const lateCharge = await prisma.late_charge.create({
        data: {
          ...req.body,
        },
      });
      res.json({
        message: "successfully create late charge with id" + lateCharge.id,
        data: lateCharge,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const updateLateCharge = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      const lateCharge = await prisma.late_charge.update({
        where: {
          id: req.params.id,
        },
        data: {
          ...req.body,
        },
      });
      res.json({
        message: "successfully update late charge with id " + req.params.id,
        data: lateCharge,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const deleteLateCharge = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      const lateCharge = await prisma.late_charge.delete({
        where: {
          id: req.params.id,
        },
      });
      res.json({
        message: "successfully delete late charge with id " + req.params.id,
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

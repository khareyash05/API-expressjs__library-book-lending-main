import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRequest } from "../types/UserTypes";

const prisma = new PrismaClient();

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await prisma.genre.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.json({ message: "successfully get list of genre", data: genres });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const getGenre = async (req: Request, res: Response) => {
  try {
    const genre = await prisma.genre.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        books: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    res.json({
      message: "successfully get genre by id " + req.params.id,
      data: genre,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const createGenre = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      const { name } = req.body;
      const genre = await prisma.genre.create({
        data: {
          name,
        },
      });
      res.json({
        message: "successfully create genre with id " + genre.id,
        data: genre,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      const { name } = req.body;
      const genre = await prisma.genre.update({
        where: {
          id: req.params.id,
        },
        data: {
          name,
          updatedAt: new Date(),
        },
      });
      res.json({
        message: "successfully update genre with id : " + req.params.id,
        data: genre,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      await prisma.genre.delete({
        where: {
          id: req.params.id,
        },
      });
      res.json({
        message: "successfully delete genre with id : " + req.params.id,
        data: null,
      });
    } catch (error) {
      const err = error as Error;
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

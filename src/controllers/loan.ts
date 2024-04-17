import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { addDays } from "../helper/addDays";
import { dayDifference } from "../helper/dayDifference";
import { compareDates } from "../helper/compareDates";
import { UserRequest } from "../types/UserTypes";

const prisma = new PrismaClient();

export const getLoans = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      const loans = await prisma.loan.findMany({
        select: {
          id: true,
          start_date: true,
          due_date: true,
          return_date: true,
          member: {
            select: {
              id: true,
              name: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
            },
          },
          loan_status: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      res.json({ message: "successfully get list of loans", data: loans });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const getUserLoans = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.id == req.params.userId) {
    try {
      const member = await prisma.member.findUnique({
        where: {
          user_id: request.params.userId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      const loans = await prisma.loan.findMany({
        where: {
          member_id: member?.id,
        },
        select: {
          id: true,
          start_date: true,
          due_date: true,
          return_date: true,
          member: {
            select: {
              id: true,
              name: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
            },
          },
          loan_status: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      res.json({ message: "successfully get list of loans", data: loans });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const getLoan = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
  try {
    const loan = await prisma.loan.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        start_date: true,
        due_date: true,
        return_date: true,
        member: {
          select: {
            id: true,
            name: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
          },
        },
        loan_status: {
          select: {
            id: true,
            name: true,
          },
        },
        late_charge: {
          select: {
            id: true,
            total_delay: true,
            charge: true,
            is_paid: true,
          },
        },
      },
    });
    res.json({
      message: "successfully get loan with id " + req.params.id,
      data: loan,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const createLoan = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      const reqLoan = req.body;
      const start_date = new Date();
      const due_date = addDays(start_date, 20);

      const loan = await prisma.loan.create({
        data: {
          ...reqLoan,
          status_id: "65fd4cccbb5355c26b8d7e4d",
          start_date,
          due_date,
        },
        select: {
          id: true,
          start_date: true,
          due_date: true,
          return_date: true,
          member: {
            select: {
              id: true,
              name: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
            },
          },
          loan_status: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      await prisma.book.update({
        where: {
          id: reqLoan.book_id,
        },
        data: {
          available: {
            decrement: 1,
          },
        },
      });
      res.json({
        message: "successfully create loan with id " + loan.id,
        data: loan,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const updateLoan = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      const reqUpdate = req.body;
      const loanDate = await prisma.loan.findUnique({
        where: {
          id: req.params.id,
        },
        select: {
          return_date: true,
          due_date: true,
        },
      });
      if (!loanDate) return res.status(404).json({ message: "Loan not found" });
      if (reqUpdate.return_date == null) {
        const loan = await prisma.loan.update({
          where: {
            id: req.params.id,
          },
          data: {
            ...reqUpdate,
          },
          select: {
            id: true,
            start_date: true,
            due_date: true,
            return_date: true,
            member: {
              select: {
                id: true,
                name: true,
              },
            },
            book: {
              select: {
                id: true,
                title: true,
              },
            },
            loan_status: {
              select: {
                id: true,
                name: true,
              },
            },
            late_charge: {
              select: {
                id: true,
                total_delay: true,
                charge: true,
                is_paid: true,
              },
            },
          },
        });
        return res.json({
          message: "successfully update loan with id " + loan.id,
          data: loan,
        });
      }

      const retunOnTime =
        reqUpdate.return_date &&
        compareDates(
          new Date(reqUpdate.return_date),
          new Date(loanDate.due_date)
        );

      const isLate = retunOnTime ? undefined : reqUpdate;

      const status_id = retunOnTime
        ? "65fd4cccbb5355c26b8d7e4c"
        : "65fd4cccbb5355c26b8d7e4e";
      const totalDelay = dayDifference(new Date(), new Date(loanDate.due_date));
      const loan = await prisma.loan.update({
        where: {
          id: req.params.id,
        },
        data: {
          late_charge: isLate && {
            create: {
              total_delay: totalDelay,
              charge: totalDelay * 2000,
              is_paid: false,
            },
          },
          status_id,
          ...reqUpdate,
        },
        select: {
          id: true,
          start_date: true,
          due_date: true,
          return_date: true,
          member: {
            select: {
              id: true,
              name: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
            },
          },
          loan_status: {
            select: {
              id: true,
              name: true,
            },
          },
          late_charge: {
            select: {
              id: true,
              total_delay: true,
              charge: true,
              is_paid: true,
            },
          },
        },
      });

      res.json({
        message: "successfully update loan with id " + req.params.id,
        data: loan,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "You are not authorized" });
  }
};

export const deleteLoan = async (req: Request, res: Response) => {
  const request = req as UserRequest;
  if (request.user.role === "admin") {
    try {
      await prisma.loan.delete({
        where: {
          id: req.params.id,
        },
      });
      res.json({
        message: "successfully delete loan with id : " + req.params.id,
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

export const getLoanStatuses = async (req: Request, res: Response) => {
  try {
    const status = await prisma.loan_status.findMany();
    res.json({ message: "successfully get list of status", data: status });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

import express from "express";
import { adminOnly, verifyAccess } from "../middlewares/accessValidation";

import { getUsers, getUser, updateUser, deleteUser } from "../controllers/user";
import {
  getMembers,
  getMember,
  deleteMember,
  updateMember,
} from "../controllers/member";
import { createGenre, deleteGenre, updateGenre } from "../controllers/genre";
import {
  createAuthor,
  deleteAuthor,
  updateAuthor,
} from "../controllers/author";
import { createBook, updateBook, deleteBook } from "../controllers/book";
import {
  getLoans,
  getLoan,
  createLoan,
  deleteLoan,
  updateLoan,
  getLoanStatuses,
  getUserLoans,
} from "../controllers/loan";
import {
  getLateCharges,
  getLateCharge,
  createLateCharge,
  updateLateCharge,
  deleteLateCharge,
} from "../controllers/lateCharge";
import { logout, tokenRefresh, userAccount } from "../controllers/auth";

const privateRouter = express.Router();

privateRouter.use(verifyAccess);

privateRouter.get("/api/auth/user", userAccount);
privateRouter.delete("/api/logout", logout);

// User API
privateRouter.get("/api/users", adminOnly, getUsers);
privateRouter.get("/api/users/:id", getUser);
privateRouter.put("/api/users/:id", updateUser);
privateRouter.delete("/api/users/:id", deleteUser);

// Member API
privateRouter.get("/api/members", adminOnly, getMembers);
privateRouter.get("/api/users/:userId/members/:memberId", getMember);
privateRouter.patch("/api/users/:userId/members/:memberId", updateMember);
privateRouter.delete("/api/members/:memberId", adminOnly, deleteMember);

// Author API
privateRouter.post("/api/authors", adminOnly, createAuthor);
privateRouter.patch("/api/authors/:id", adminOnly, updateAuthor);
privateRouter.delete("/api/authors/:id", adminOnly, deleteAuthor);

// Genre API
privateRouter.post("/api/genres", adminOnly, createGenre);
privateRouter.patch("/api/genres/:id", adminOnly, updateGenre);
privateRouter.delete("/api/genres/:id", adminOnly, deleteGenre);

// Book API
privateRouter.post("/api/books", adminOnly, createBook);
privateRouter.patch("/api/books/:id", adminOnly, updateBook);
privateRouter.put("/api/books/:id", adminOnly, updateBook);
privateRouter.delete("/api/books/:id", adminOnly, deleteBook);

// Loan API
privateRouter.get("/api/loans", adminOnly, getLoans);
privateRouter.get("/api/users/:userId/loans", getUserLoans);
privateRouter.get("/api/loans/:id", getLoan);
privateRouter.post("/api/loans", adminOnly, createLoan);
privateRouter.patch("/api/loans/:id", adminOnly, updateLoan);
privateRouter.delete("/api/loans/:id", adminOnly, deleteLoan);

privateRouter.get("/api/loan-status", getLoanStatuses);

// Late Charge API
privateRouter.get("/api/late-charges", adminOnly, getLateCharges);
privateRouter.get("/api/late-charges/:id", getLateCharge);
privateRouter.post("/api/late-charges", adminOnly, createLateCharge);
privateRouter.patch("/api/late-charges/:id", adminOnly, updateLateCharge);
privateRouter.delete("/api/late-charges/:id", adminOnly, deleteLateCharge);

export default privateRouter;

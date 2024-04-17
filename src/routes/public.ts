import express from "express";
import formidableMiddleware from "express-formidable";

const publicRouter = express.Router();

import { createMember } from "../controllers/member";
import { createUser } from "../controllers/user";
import { login, tokenRefresh } from "../controllers/auth";
import { getAuthor, getAuthors } from "../controllers/author";
import { getGenre, getGenres } from "../controllers/genre";
import { getBook, getBooks } from "../controllers/book";

publicRouter.post("/api/auth/refresh", tokenRefresh);

publicRouter.post("/api/members", createMember);
publicRouter.post("/api/user-admin", createUser);

publicRouter.post("/api/login", login);

publicRouter.get("/api/authors", getAuthors);
publicRouter.get("/api/authors/:id", getAuthor);

publicRouter.get("/api/genres", getGenres);
publicRouter.get("/api/genres/:id", getGenre);

publicRouter.post("/api/books-by-filter", formidableMiddleware(), getBooks);
publicRouter.get("/api/books/:id", getBook);

export default publicRouter;

import publicRouter from "./routes/public";
import privateRouter from "./routes/private";

import express from "express";
import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

const app = express();
const PORT = 5000;

//middleware
app.use(express.json());

app.use(publicRouter);
app.use(privateRouter);

app.listen(PORT, () => {
  console.log(`Server running in PORT: ${PORT}`);
});

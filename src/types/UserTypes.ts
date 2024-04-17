import type { Request, Response } from "express";

export interface UserType {
  id: string;
  email: string;
  role: string;
  refreshToken?: string;
}

export interface UserRequest extends Request {
  user: UserType;
}

export interface ValidationRequest extends Request {
  authorization: string;
  user: UserType;
}

import { Request, Response, NextFunction } from "express";
import ApiError from "../helpers/types/error";
import jwt, { JwtPayload } from "jsonwebtoken";

const { SECRET = "super-strong-secret" } = process.env;

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (header: string) => {
  return header.replace("Bearer ", "");
};

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer "))
    return next(ApiError.UnauthorizedError());

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    return next(ApiError.UnauthorizedError());
  }

  req.body.user = payload;
  next();
};

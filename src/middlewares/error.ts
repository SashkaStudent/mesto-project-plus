import { Response, Request, NextFunction } from "express";
import ApiError from "../helpers/types/error";
import { DEFAULT_ERROR } from "../helpers/error-codes";

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .send({ message: err.message, errors: err.errors });
  }
  return res.status(DEFAULT_ERROR).send({ message: err.message });
};

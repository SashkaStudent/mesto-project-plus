import { NextFunction, Request, Response, Router } from "express";
import ApiError from "../helpers/types/error";

const router = Router();
router.all("/", (req: Request, res: Response, next: NextFunction) =>
  next(ApiError.NotFoundError())
);

export default router;

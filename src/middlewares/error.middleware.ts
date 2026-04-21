import type { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);
  res
    .status(500)
    .json({
      message: err.message || "Internal Server Error",
      error: err,
      cause: err.cause || null,
      stack: err.stack || null,
    });
};

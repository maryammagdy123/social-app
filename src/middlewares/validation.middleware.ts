import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../common/exceptions";
import { ZodType } from "zod";

export const validation = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.safeParse(req.body);
    if (error) {
      throw new ValidationError("Validation Error", {
        error: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
    }
    next();
  };
};

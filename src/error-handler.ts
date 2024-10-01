import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { BadRequestsException } from "./exceptions/bad-requests";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (err: any) {
      let exception: HttpException;

      if (err instanceof HttpException) {
        exception = err;
      } else {
        if (err instanceof ZodError) {
          exception = new BadRequestsException(
            "Unprocessable entity.",
            ErrorCode.UNPROCESSABE_ENTITY,
            err
          );
        } else {
          exception = new InternalException(
            "Somthing webt wrong!",
            ErrorCode.INTERNAL_EXCEPTION,
            err
          );
        }
      }
      next(exception);
    }
  };
};

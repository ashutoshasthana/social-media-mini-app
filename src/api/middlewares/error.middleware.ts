import { NextFunction, Request, Response } from "express";
import HttpException from "../../exceptions/HttpException";

//Middleware function for error handling
const errorMiddleware = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) => {
    console.log("Error Middleware started !!!");
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  const success = error.success || false;
  response.status(status).send({
    status,
    success,
    message,
  });
};

export default errorMiddleware;

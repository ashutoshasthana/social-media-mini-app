import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import bcrypt from "bcrypt";
import validationMiddleware from "../middlewares/validation.middleware";
import middlewares from "../middlewares";
import LoginCredDto from "../../models/login.dto";
import { User } from "../../models/user.dto";
import knex from "../../data/knex";
import { app_services } from "../../services";
import HttpException from "../../exceptions/HttpException";
import { pseudoRandomBytes } from "crypto";

//import middlewares from '../middlewares';

const route = Router();

export default async (app: Router) => {
  app.use("/", route);
  const logger: any = Container.get("logger");


  //Route for user signin
  route.post(
    "/signin",
    validationMiddleware(LoginCredDto,true),
    async (req: Request, res: Response, next: NextFunction) => {
      //console.log("User Sign in : ",req);
      var input: LoginCredDto = req.body;
      logger.debug("Loggin User");
      try {
        const loginServiceInstance = Container.get(app_services.loginService);
        const serRes = await loginServiceInstance.userLogin(
          input.user_name,
          input.password,
          next
        );
        //console.log("userRes : ",data);
        res.json({ data: serRes, success: true });
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );



  //Route for New user signup.
  route.post(
    "/sign-up",
    middlewares.isAuth,
    validationMiddleware(User,true),
    async (request: Request, response: Response, next: NextFunction) => {
      var input: User = request.body;
      logger.debug("----New User signup---");
      try {
        const loginServiceInstance = Container.get(app_services.loginService);
        const res = await loginServiceInstance.newUserSignup(input);
        if (res)
          response.json({
            status: 200,
            success: true,
            message: "User Registerd Successfully!",
          });
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );

  //Route for user Forgot password
  route.post(
    "/forgot-password",
    middlewares.isAuth,
    validationMiddleware(null),
    async (req: Request, res: Response) => {     
      return res.json({ user: "Ashutosh Asthana forgot-password" }).status(200);
    }
  );
};

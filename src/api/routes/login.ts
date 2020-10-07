import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import bcrypt from "bcrypt";
import validationMiddleware from "../middlewares/validation.middleware";
import middlewares from "../middlewares";
import LoginCredDto , { ResetPassword } from "../../models/login.dto";

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
        const serRes = await loginServiceInstance.userLogin(input.user_name,input.password);
        //console.log("userRes : ",data);
        res.json({ data: serRes, success: true });
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );


    //Route for user Forgot password
    route.post(
      "/reset-password",
      middlewares.isAuth,
      validationMiddleware(ResetPassword),
      async (req: Request, res: Response,next: NextFunction) => {  
        try {
          const { token } = req as any;
          const loginServiceInstance = Container.get(app_services.loginService);
          const resetPasswordRes = await loginServiceInstance.resetPassword(req.body,token.user);            
          return res.json(resetPasswordRes).status(200);
        } catch(e){
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

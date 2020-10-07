import { validateSync } from 'class-validator';
import { Router, Request, Response, NextFunction} from 'express';
import validationMiddleware from '../middlewares/validation.middleware';
import middlewares from "../middlewares";
import { User } from "../../models/user.dto";
import { Container } from "typedi";
import { app_services } from "../../services";
import HttpException from '../../exceptions/HttpException';


//import middlewares from '../middlewares';
const route = Router();

export default (app: Router) => {    
   app.use('/user', route);
//   route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
//     return res.json({ user: req.currentUser }).status(200);
//   });


    //route for user signup
    route.post('/sign-up',validationMiddleware(User,true), async (req: Request, res: Response,next:NextFunction) => {
      try {
        const userServiceInstance = Container.get(app_services.userService); 
        const addUserRes = await userServiceInstance.addNewUser(req.body);
        res.json(addUserRes).status(200) ;
      }catch(e){
        return next(new HttpException(e.status, e.success, e.message));
      }
        
    });


    //route for user signup
    route.post('/editprofile',middlewares.isAuth,validationMiddleware(User,true), async (req: Request, res: Response,next:NextFunction) => {
        try {
          const userServiceInstance = Container.get(app_services.userService); 
          const addUserRes = await userServiceInstance.addNewUser(req.body);
          res.json(addUserRes).status(200) ;
        }catch(e){
          return next(new HttpException(e.status, e.success, e.message));
        }
          
      });

};

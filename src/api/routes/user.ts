import { Router, Request, Response} from 'express';
//import middlewares from '../middlewares';
const route = Router();

export default (app: Router) => {    
   app.use('/users', route);
//   route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
//     return res.json({ user: req.currentUser }).status(200);
//   });

    route.get('/me', (req: Request, res: Response) => {
        console.log("Get User Called");
        return res.json({ user:"Ashutosh Asthana" }).status(200);
    });
};
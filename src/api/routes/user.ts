import { validateSync } from "class-validator";
import { Router, Request, Response, NextFunction } from "express";
import validationMiddleware from "../middlewares/validation.middleware";
import middlewares from "../middlewares";
import { User, SendRequest, EditRequest, Post } from "../../models/user.dto";
import { Container } from "typedi";
import { app_services } from "../../services";
import HttpException from "../../exceptions/HttpException";

//import middlewares from '../middlewares';
const route = Router();

export default (app: Router) => {
  app.use("/user", route);
  //   route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
  //     return res.json({ user: req.currentUser }).status(200);
  //   });

  //route for user signup
  route.post(
    "/sign-up",
    validationMiddleware(User, true),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userServiceInstance = Container.get(app_services.userService);
        const addUserRes = await userServiceInstance.addNewUser(req.body);
        res.json(addUserRes).status(200);
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );

  //route for user Edit profile
  route.post(
    "/editprofile",
    middlewares.isAuth,
    validationMiddleware(User, true),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userServiceInstance = Container.get(app_services.userService);
        const EditProfileRes = await userServiceInstance.addNewUser(req.body);
        res.json(EditProfileRes).status(200);
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );

  //route for user to send request
  route.post(
    "/sendrequest",
    middlewares.isAuth,
    validationMiddleware(SendRequest, true),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req as any;
        const userServiceInstance = Container.get(app_services.userService);
        const sendRequestRes = await userServiceInstance.sendRequest(
          req.body,
          token.user
        );
        res.json(sendRequestRes).status(200);
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );

  //route for user to send request
  route.get(
    "/requestslist",
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req as any;
        const userServiceInstance = Container.get(app_services.userService);
        const listOftrequest = await userServiceInstance.listAllrequest(
          token.user
        );
        res.json(listOftrequest).status(200);
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );

  //route for user signup
  route.post(
    "/edit-request-status",
    middlewares.isAuth,
    validationMiddleware(EditRequest, true),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req as any;
        const userServiceInstance = Container.get(app_services.userService);
        const editRequestRes = await userServiceInstance.editRequestStatus(
          req.body,
          token.user
        );
        res.json(editRequestRes).status(200);
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );

  //route for remove friend
  route.get(
    "/removefriend/:id",
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req as any;
        const userServiceInstance = Container.get(app_services.userService);
        const RemoveFriendRes = await userServiceInstance.removeFriend(
          parseInt(req.params.id),
          token.user
        );
        res.json(RemoveFriendRes).status(200);
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );

  //route for user to add Post
  route.post(
    "/addpost",
    middlewares.isAuth,
    validationMiddleware(Post, true),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req as any;
        const userServiceInstance = Container.get(app_services.userService);
        const addPostRes = await userServiceInstance.addPost(
          req.body,
          token.user
        );
        res.json(addPostRes).status(200);
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );

  //route for user to delete Post
  route.get(
    "/removepost/:id",
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req as any;
        const userServiceInstance = Container.get(app_services.userService);
        const removePostRes = await userServiceInstance.removePost(
          parseInt(req.params.id),
          token.user
        );
        res.json(removePostRes).status(200);
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );

  //route for user's Friends list
  route.get(
    "/friendlist",
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req as any;
        const userServiceInstance = Container.get(app_services.userService);
        const listRes = await userServiceInstance.getFriendList(token.user);
        res.json(listRes).status(200);
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );

  //route for user to mutual Friend List
  route.get(
    "/mutulfriendlist/:id",
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req as any;
        const userServiceInstance = Container.get(app_services.userService);
        const listRes = await userServiceInstance.getFMutualFriendsList(parseInt(req.params.id),token.user);
        res.json(listRes).status(200);
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );

  //route for user to Friends of  Friend List
  route.get(
    "/friends-of-friends/:id",
    middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req as any;
        const userServiceInstance = Container.get(app_services.userService);
        const listRes = await userServiceInstance.getFriendofFriendsList(parseInt(req.params.id),token.user);
        res.json(listRes).status(200);
      } catch (e) {
        return next(new HttpException(e.status, e.success, e.message));
      }
    }
  );
};
